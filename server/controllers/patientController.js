const db = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Creates a new patient. This involves two steps in a transaction:
 * 1. Create a user in the 'users' table.
 * 2. Create a patient in the 'patients' table linked to the new user.
 */
exports.createPatient = async (req, res) => {
    const { user_email, name, last_name, phone } = req.body;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const password = "secret"
        const email = user_email

        // 1. Create the user with role 'patient'
        const hashedPassword = await bcrypt.hash(password, 10);
        const [userResult] = await connection.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, 'patient']
        );
        const userId = userResult.insertId;

        // 2. Create the patient profile
        const [patientResult] = await connection.query(
            'INSERT INTO patients (name, last_name, phone, user_id) VALUES (?, ?, ?, ?)',
            [name, last_name, phone, userId]
        );

        await connection.commit();
        res.status(201).send({ message: 'Patient created successfully', patientId: patientResult.insertId });
    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({ message: 'Email already exists.' });
        }
        res.status(500).send({ message: 'Error creating patient', error });
    } finally {
        connection.release();
    }
};

/**
 * Retrieves a list of all patients.
 */
exports.getAllPatients = async (req, res) => {
    try {
        const query = `
            SELECT 
                d.id, d.name, d.last_name, d.phone,
                u.email as user_email,
                u.role as user_role
                FROM patients d
                JOIN users u ON d.user_id = u.id
                ORDER BY d.name ASC;
        `;
        const [patients] = await db.query(query);
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving patients', error });
    }
};

/**
 * Retrieves a single patient by their ID.
 */
exports.getPatientById = async (req, res) => {
    const patientId = req.params.id;
    try {
        const [patient] = await db.query('SELECT id, name, last_name, phone FROM patients WHERE id = ?', [patientId]);
        if (patient.length === 0) {
            return res.status(404).send({ message: 'Patient not found' });
        }
        res.status(200).json(patient[0]);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving patient', error });
    }
};

/**
 * Updates a patient's information.
 */
exports.updatePatient = async (req, res) => {
    const patientId = req.params.id;
    const patchData = req.body.patient || req.body.patchData || req.body;
    console.log('updatePatient()');
    console.log('patientId', patientId);
    console.log('patchData', patchData);


    try {

        // TODO: Use Middleware
        // const isPatient = user.role === 'patient' && user.relation_id === patientId;
        // const isAdmin = user.role === 'admin';

        // if (!isPatient && !isAdmin) {
        //     return res.status(403).send({ message: 'Unauthorized to modify this patient.' });
        // }

        const [result] = await db.query(
            'UPDATE patients SET name = ?, last_name = ?, phone = ? WHERE id = ?',
            [patchData.name, patchData.last_name, patchData.phone, patientId]
        );



        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Patient not found' });
        }

        const query = `
            SELECT 
                d.id, d.name, d.last_name, d.phone,
                u.email as user_email,
                u.role as user_role
                FROM patients d
                JOIN users u ON d.user_id = u.id
                WHERE d.id = ?
                ORDER BY d.name ASC;
        `;
        const [patient] = await db.query(query, [patientId]);
        // res.status(200).json(patient);

        res.status(200).send(patient[0]);
    } catch (error) {
        res.status(500).send({ message: 'Error updating patient', error });
    }
};

/**
 * Deletes a patient.
 * This will also delete the associated user due to ON DELETE CASCADE in the database.
 */
exports.deletePatient = async (req, res) => {
    const patientId = req.params.id;
    const connection = await db.getConnection();

    try {
        // First, find the patient to get the user_id
        const [patient] = await connection.query('SELECT user_id FROM patients WHERE id = ?', [patientId]);

        if (patient.length === 0) {
            return res.status(404).send({ message: 'Patient not found' });
        }

        const userId = patient[0].user_id;

        // Delete the user, which will cascade to the patients table
        await connection.query('DELETE FROM users WHERE id = ?', [userId]);
        res.status(200).send({ deleted: true, message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).send({ deleted: false, message: 'Error deleting patient', error });
    }
};

/**
 * Searches for patients by a single search term against name, or last name.
 */
exports.searchPatients = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).send({ message: 'A search query parameter "q" is required.' });
    }

    try {
        const searchTerm = `%${q}%`;
        let query = `
            SELECT 
                d.id, d.name, d.last_name, d.phone,
                u.email as user_email,
                u.role as user_role
            FROM patients d
            JOIN users u ON d.user_id = u.id
            WHERE d.name LIKE ? OR d.last_name LIKE ? OR d.phone LIKE ? OR u.email LIKE ?
        `;

        const params = [searchTerm, searchTerm, searchTerm, searchTerm];

        query += " ORDER BY d.name ASC";

        const [patients] = await db.query(query, params);

        // if (patients.length === 0) {
        //     return res.status(404).send({ message: 'No patients found matching the criteria' });
        // }

        res.status(200).json(patients);
    } catch (error) {
        res.status(500).send({ message: 'Error searching patients', error });
    }
};
