// Import the database connection
const db = require('../config/db');

// Search for appointments based on a query string.
// The query searches the reason for the appointment, patient's name, and doctor's name.
const searchAppointments = async (query) => {
    // SQL query to find matching appointments
    const sql = `
        SELECT 
            a.id, a.reason, a.status, a.start_at, a.end_at,
            p.name as patient_name, p.last_name as patient_last_name,
            d.name as doctor_name, d.last_name as doctor_last_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.reason LIKE ? 
        OR p.name LIKE ? OR p.last_name LIKE ?
        OR d.name LIKE ? OR d.last_name LIKE ?
    `;
    // Execute the query with the search term
    const [rows] = await db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
    return rows;
};

// Search for doctors based on a query string.
// The query searches the doctor's name, last name, specialty, phone number, and email.
const searchDoctors = async (query) => {
    // SQL query to find matching doctors
    const sql = `
        SELECT 
            d.id, d.name, d.last_name, d.specialty, d.phone,
            u.email as user_email
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        WHERE d.name LIKE ? OR d.last_name LIKE ? OR d.specialty LIKE ? OR d.phone LIKE ? OR u.email LIKE ?
    `;
    // Execute the query with the search term
    const [rows] = await db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
    return rows;
};

// Search for patients based on a query string.
// The query searches the patient's name, last name, phone number, and email.
const searchPatients = async (query) => {
    // SQL query to find matching patients
    const sql = `
        SELECT 
            p.id, p.name, p.last_name, p.phone,
            u.email as user_email
        FROM patients p
        JOIN users u ON p.user_id = u.id
        WHERE p.name LIKE ? OR p.last_name LIKE ? OR p.phone LIKE ? OR u.email LIKE ?
    `;
    // Execute the query with the search term
    const [rows] = await db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
    return rows;
};

// Perform a global search across appointments, doctors, and patients.
exports.globalSearch = async (req, res) => {
    // Get the search query from the request
    const { q } = req.query;

    // Check if a search query was provided
    if (!q) {
        return res.status(400).send({ message: 'A search query parameter "q" is required.' });
    }

    try {
        // Perform all search queries in parallel
        const [appointments, doctors, patients] = await Promise.all([
            searchAppointments(q),
            searchDoctors(q),
            searchPatients(q)
        ]);

        // Return the search results as a JSON object
        res.status(200).json({
            appointments,
            doctors,
            patients
        });
    } catch (error) {
        // Handle any errors that occurred during the search
        res.status(500).send({ message: 'Error performing global search', error });
    }
};