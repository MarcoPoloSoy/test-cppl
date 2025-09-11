const { parse } = require('dotenv');
const db = require('../config/db');

// Create new appointment
exports.createAppointment = async (req, res) => {
    const { patient_id, doctor_id, start_at, end_at, reason } = req.body;
    const user = req.user;
    const status = user.role === 'patient' ? 'pending' : 'scheduled';

    try {

        // Collision validation is handled by the database via a trigger.
        // The database will return an error if you try to insert a duplicate appointment
        // or the dates overlap for the same doctor or patient within a given date range.
        const [result] = await db.query(
            'INSERT INTO appointments (patient_id, doctor_id, start_at, end_at, reason) VALUES (?, ?, ?, ?, ?)',
            [patient_id, doctor_id, start_at, end_at, reason]
        );
        res.status(201).send({ message: 'Appointment created successfully', appointmentId: result.insertId });
    } catch (error) {
        // Duplicate entry error (code ER_DUP_ENTRY)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({ message: 'Scheduling conflict. The doctor or patient already has an appointment at that date and time.' });
        }
        // Custom error from DB trigger for overlapping dates
        if (error.code === 'ER_SIGNAL_EXCEPTION') {
            return res.status(409).send({ message: error.sqlMessage });
        }
        res.status(500).send({ message: 'Error creating appointment', error });
    }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const user = req.user; // User info from JWT (id, role, relation_id)

    try {
        // First, get the appointment to verify ownership
        const [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [appointmentId]);

        if (rows.length === 0) {
            return res.status(404).send({ message: 'Appointment not found.' });
        }

        const appointment = rows[0];

        // Authorization check: the doctor of the appointment, or an admin can delete it.
        const isDoctor = user.role === 'doctor' && user.relation_id === appointment.doctor_id;
        const isAdmin = user.role === 'admin';

        // A doctor can cancel, an admin can delete.
        if (!isDoctor && !isAdmin) {
            return res.status(403).send({ message: 'Unauthorized to delete this appointment.' });
        }

        // Proceed with deletion
        await db.query('DELETE FROM appointments WHERE id = ?', [appointmentId]);
        res.status(200).send({ message: 'Appointment deleted successfully.', deleted: true });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting appointment.', deleted: false, error });
    }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const patchData = req.body.appointment || req.body.patchData || req.body;
    const user = req.user; // User info from JWT

    try {
        // First, get the appointment to verify ownership
        const [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [appointmentId]);

        if (rows.length === 0) {
            return res.status(404).send({ message: 'Appointment not found.' });
        }

        const appointment = rows[0];

        // Authorization check: patient, doctor of the appointment, or an admin can update.
        const isPatient = user.role === 'patient' && user.relation_id === appointment.patient_id;
        const isDoctor = user.role === 'doctor' && user.relation_id === appointment.doctor_id;
        const isAdmin = user.role === 'admin';

        if (!isPatient && !isDoctor && !isAdmin) {
            return res.status(403).send({ message: 'Unauthorized to modify this appointment.' });
        }

        // Build the update query dynamically based on the fields provided
        const nonNullFields = Object.entries(patchData).filter(([, value]) => value !== undefined && value !== null);

        if (nonNullFields.length === 0) {
            return res.status(400).send({ message: 'No fields provided for update.' });
        }

        const setClause = nonNullFields.map(([key]) => `${key} = ?`).join(', ');
        const values = nonNullFields.map(([, value]) => value);

        await db.query(`UPDATE appointments SET ${setClause} WHERE id = ?`, [...values, appointmentId]);

        // Fetch the updated appointment to return it
        const [updatedRows] = await db.query(`
            SELECT 
                a.id, a.start_at, a.end_at, a.reason, a.status,
                p.id as patient_id,
                p.name as patient_name,
                p.last_name as patient_last_name,
                d.id as doctor_id,
                d.name as doctor_name,
                d.last_name as doctor_last_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            WHERE a.id = ?;
        `, [appointmentId]);
        if (updatedRows.length === 0) {
            // This case is unlikely if the initial check passed, but it's good practice
            return res.status(404).send({ message: 'Appointment not found after update.' });
        }

        res.status(200).json(updatedRows[0]);
    } catch (error) {
        // Handle potential collision errors from the database trigger
        if (error.code === 'ER_SIGNAL_EXCEPTION') {
            return res.status(409).send({ message: error.sqlMessage });
        }
        res.status(500).send({ message: 'Error updating appointment.', error });
    }
};

/**
 * Retrieves a single appointment by its ID, including patient and doctor information.
 */
exports.getAppointmentById = async (req, res) => {
    const appointmentId = req.params.id;

    try {
        const query = `
            SELECT 
                a.id, a.start_at, a.end_at, a.reason, a.status,
                p.id as patient_id,
                p.name as patient_name,
                p.last_name as patient_last_name,
                d.id as doctor_id,
                d.name as doctor_name,
                d.last_name as doctor_last_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            WHERE a.id = ?;
        `;
        const [rows] = await db.query(query, [appointmentId]);

        if (rows.length === 0) {
            return res.status(404).send({ message: 'Appointment not found.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving appointment.', error });
    }
};

// Getting patient's appointments (protected route)
exports.getAppointmentsByPatient = async (req, res) => {
    const patientId = parseInt(req.params.id, 10);
    // Verify that the user is the correct doctor or an admin
    if (req.user.role !== 'admin' && (req.user.role !== 'patient' || req.user.relation_id !== patientId)) {
        return res.status(403).send({ message: 'Unauthorized access' });
    }

    try {

        const query = `
            SELECT a.id, a.start_at, a.end_at, a.reason, a.status,
                d.id as doctor_id,
                d.name as doctor_name,
                d.last_name as doctor_last_name
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            WHERE a.patient_id = ?
            ORDER BY a.start_at DESC;
        `;


        const [appointments] = await db.query(query, [patientId]);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).send({ message: 'Error getting appointments', error });
    }
};

// Getting doctor's appointments (protected route)
exports.getAppointmentsByDoctor = async (req, res) => {
    const doctorId = parseInt(req.params.id, 10);
    // Verify that the user is the correct doctor or an admin
    if (req.user.role !== 'admin' && (req.user.role !== 'doctor' || req.user.relation_id !== doctorId)) {
        return res.status(403).send({ message: 'Unauthorized access' });
    }

    try {
        const query = `
            SELECT a.id, a.start_at, a.end_at, a.reason, a.status,
                p.id as patient_id,
                p.name as patient_name,
                p.last_name as patient_last_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            WHERE a.doctor_id = ?
            ORDER BY a.start_at DESC;
        `;

        const [appointments] = await db.query(query, [doctorId]);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).send({ message: 'Error getting appointments', error });
    }
};

/**
 * Retrieves a list of all appointments. (Admin only)
 * This query joins with patients and doctors to provide more context.
 */
exports.getAppointments = async (req, res) => {
    // Ensure only admins can access this
    if (req.user.role !== 'admin') {
        return res.status(403).send({ message: 'Unauthorized access. Admin role required.' });
    }

    try {

        // Get all appointments
        const query = `
            SELECT 
                a.id, a.start_at, a.end_at, a.reason, a.status,
                p.id as patient_id,
                p.name as patient_name,
                p.last_name as patient_last_name,
                d.id as doctor_id,
                d.name as doctor_name,
                d.last_name as doctor_last_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            ORDER BY a.start_at DESC;
        `;
        const [appointments] = await db.query(query);

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving all appointments', error });
    }
};


exports.getAppointmentDashboardInfo = async (req, res) => {
    // Ensure only admins can access this
    if (req.user.role !== 'admin') {
        return res.status(403).send({ message: 'Unauthorized access. Admin role required.' });
    }

    try {
        // Get today's appointments
        const todayQuery = `
            SELECT 
                a.id, a.start_at, a.end_at, a.reason, a.status,
                p.id as patient_id, p.name as patient_name, p.last_name as patient_last_name,
                d.id as doctor_id, d.name as doctor_name, d.last_name as doctor_last_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            WHERE DATE(a.start_at) = CURDATE()
            ORDER BY a.start_at ASC;
        `;
        const [todayAppointments] = await db.query(todayQuery);

        // Get tomorrow's appointments
        const tomorrowQuery = `
            SELECT 
                a.id, a.start_at, a.end_at, a.reason, a.status,
                p.id as patient_id, p.name as patient_name, p.last_name as patient_last_name,
                d.id as doctor_id, d.name as doctor_name, d.last_name as doctor_last_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            WHERE DATE(a.start_at) = CURDATE() + INTERVAL 1 DAY
            ORDER BY a.start_at ASC;
        `;
        const [tomorrowAppointments] = await db.query(tomorrowQuery);

        // Next days appointments
        const query = `
            SELECT 
                a.id, a.start_at, a.end_at, a.reason, a.status,
                p.id as patient_id, p.name as patient_name, p.last_name as patient_last_name,
                d.id as doctor_id, d.name as doctor_name, d.last_name as doctor_last_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            WHERE DATE(a.start_at) >= CURDATE() + INTERVAL 2 DAY
            ORDER BY a.start_at ASC;
        `;
        const [nextDaysAppointments] = await db.query(query);

        // Count doctors
        const countDoctorsQuery = `
            SELECT COUNT(*) AS totalRows FROM doctors
        `;
        const countDoctorsResp = await db.query(countDoctorsQuery);
        const countDoctors = countDoctorsResp.length > 0 ? countDoctorsResp[0][0]['totalRows'] : 0;

        // Count patients
        const countPatientsQuery = `
            SELECT COUNT(*) AS totalRows FROM patients
        `;
        const countPatientsResp = await db.query(countPatientsQuery);
        const countPatients = countPatientsResp.length > 0 ? countPatientsResp[0][0]['totalRows'] : 0;

        console.log('the_counters', countDoctors, countPatients)

        // Query to get all doctors
        const doctorsQuery = `
            SELECT 
                d.id, d.name, d.last_name, d.specialty, d.phone,
                u.email as user_email,
                u.role as user_role
                FROM doctors d
                JOIN users u ON d.user_id = u.id;
        `;
        const [doctors] = await db.query(doctorsQuery);

        // Query to get all patients
        const patientsQuery = `
            SELECT p.id, p.name, p.last_name, p.birth_date, p.phone,
            u.email as user_email,
            u.role as user_role
            FROM patients p
            JOIN users u ON p.user_id = u.id;
        `;
        const [patients] = await db.query(patientsQuery);

        // Query to get appointment counters
        const appointmentCountersQuery = `
        SELECT
            COUNT(*) AS total_appointments,
            SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) AS scheduled_count,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_count,
            SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_count,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
            SUM(CASE WHEN start_at < CURDATE() THEN 1 ELSE 0 END) AS past_appointments,
            SUM(CASE WHEN start_at > CURDATE() THEN 1 ELSE 0 END) AS future_appointments,
            SUM(CASE WHEN DATE(start_at) = CURDATE() THEN 1 ELSE 0 END) AS today_appointments,
            SUM(CASE WHEN DATE(start_at) = CURDATE() AND status = 'completed' THEN 1 ELSE 0 END) AS today_completed_appointments
        FROM
            appointments;
        `;
        const [appointmentCountersResp] = await db.query(appointmentCountersQuery);
        const appointmentCounters = appointmentCountersResp.length > 0 ? appointmentCountersResp[0] : {};

        // console.log('appointmentCounters', appointmentCounters);

        const counterObj = {
            appointments: {
                total: appointmentCounters.total_appointments,
                scheduled: parseInt(appointmentCounters.scheduled_count),
                completed: parseInt(appointmentCounters.completed_count),
                cancelled: parseInt(appointmentCounters.cancelled_count),
                pending: parseInt(appointmentCounters.pending_count),
                past: parseInt(appointmentCounters.past_appointments),
                future: parseInt(appointmentCounters.future_appointments),
                today: parseInt(appointmentCounters.today_appointments),
                today_completed: parseInt(appointmentCounters.today_completed_appointments)
            },
            doctors: countDoctors,
            patients: countPatients
        }

        const response = {
            appointments: {
                today: todayAppointments,
                tomorrow: tomorrowAppointments,
                next: nextDaysAppointments
            },
            doctors: doctors,
            patients: patients,
            counters: counterObj

        };
        res.status(200).json(response);

    } catch (error) {
        res.status(500).send({ message: 'Error retrieving all appointments', error });
    }
};