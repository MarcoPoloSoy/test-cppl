const db = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Creates a new doctor. This involves two steps in a transaction:
 * 1. Create a user in the 'users' table.
 * 2. Create a doctor in the 'doctors' table linked to the new user.
 */
exports.createDoctor = async (req, res) => {
    const { user_email, name, last_name, specialty, phone } = req.body;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const password = "secret"
        const email = user_email

        // 1. Create the user with role 'doctor'
        const hashedPassword = await bcrypt.hash(password, 10);
        const [userResult] = await connection.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, 'doctor']
        );
        const userId = userResult.insertId;

        // 2. Create the doctor profile
        const [doctorResult] = await connection.query(
            'INSERT INTO doctors (name, last_name, specialty, phone, user_id) VALUES (?, ?, ?, ?, ?)',
            [name, last_name, specialty, phone, userId]
        );

        await connection.commit();
        res.status(201).send({ message: 'Doctor created successfully', doctorId: doctorResult.insertId });
    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({ message: 'Email already exists.' });
        }
        res.status(500).send({ message: 'Error creating doctor', error });
    } finally {
        connection.release();
    }
};

/**
 * Retrieves a list of all doctors.
 */
exports.getAllDoctors = async (req, res) => {
    try {
        const query = `
            SELECT 
                d.id, d.name, d.last_name, d.specialty, d.phone,
                u.email as user_email,
                u.role as user_role
                FROM doctors d
                JOIN users u ON d.user_id = u.id
                ORDER BY d.name ASC;
        `;
        const [doctors] = await db.query(query);
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving doctors', error });
    }
};

/**
 * Retrieves a single doctor by their ID.
 */
exports.getDoctorById = async (req, res) => {
    const doctorId = req.params.id;
    try {
        const [doctor] = await db.query('SELECT id, name, last_name, specialty, phone FROM doctors WHERE id = ?', [doctorId]);
        if (doctor.length === 0) {
            return res.status(404).send({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor[0]);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving doctor', error });
    }
};

/**
 * Updates a doctor's information.
 */
exports.updateDoctor = async (req, res) => {
    const doctorId = req.params.id;
    const patchData = req.body.doctor || req.body.patchData || req.body;
    console.log('updateDoctor()');
    console.log('doctorId', doctorId);
    console.log('patchData', patchData);


    try {

        // TODO: Use Middleware
        // const isDoctor = user.role === 'doctor' && user.relation_id === doctorId;
        // const isAdmin = user.role === 'admin';

        // if (!isDoctor && !isAdmin) {
        //     return res.status(403).send({ message: 'Unauthorized to modify this doctor.' });
        // }

        const [result] = await db.query(
            'UPDATE doctors SET name = ?, last_name = ?, specialty = ?, phone = ? WHERE id = ?',
            [patchData.name, patchData.last_name, patchData.specialty, patchData.phone, doctorId]
        );



        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Doctor not found' });
        }

        const query = `
            SELECT 
                d.id, d.name, d.last_name, d.specialty, d.phone,
                u.email as user_email,
                u.role as user_role
                FROM doctors d
                JOIN users u ON d.user_id = u.id
                WHERE d.id = ?
                ORDER BY d.name ASC;
        `;
        const [doctor] = await db.query(query, [doctorId]);
        // res.status(200).json(doctor);

        res.status(200).send(doctor[0]);
    } catch (error) {
        res.status(500).send({ message: 'Error updating doctor', error });
    }
};

/**
 * Deletes a doctor.
 * This will also delete the associated user due to ON DELETE CASCADE in the database.
 */
exports.deleteDoctor = async (req, res) => {
    const doctorId = req.params.id;
    const connection = await db.getConnection();

    try {
        // First, find the doctor to get the user_id
        const [doctor] = await connection.query('SELECT user_id FROM doctors WHERE id = ?', [doctorId]);

        if (doctor.length === 0) {
            return res.status(404).send({ message: 'Doctor not found' });
        }

        const userId = doctor[0].user_id;

        // Delete the user, which will cascade to the doctors table
        await connection.query('DELETE FROM users WHERE id = ?', [userId]);
        res.status(200).send({ deleted: true, message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).send({ deleted: false, message: 'Error deleting doctor', error });
    }
};

/**
 * Searches for doctors by a single search term against name, specialty, or last name.
 */
exports.searchDoctors = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).send({ message: 'A search query parameter "q" is required.' });
    }

    try {
        const searchTerm = `%${q}%`;
        let query = `
            SELECT 
                d.id, d.name, d.last_name, d.specialty, d.phone,
                u.email as user_email,
                u.role as user_role
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            WHERE d.name LIKE ? OR d.last_name LIKE ? OR d.specialty LIKE ? OR d.phone LIKE ? OR u.email LIKE ?
        `;

        const params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];

        query += " ORDER BY d.name ASC";

        const [doctors] = await db.query(query, params);

        // if (doctors.length === 0) {
        //     return res.status(404).send({ message: 'No doctors found matching the criteria' });
        // }

        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).send({ message: 'Error searching doctors', error });
    }
};
