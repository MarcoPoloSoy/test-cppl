const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Assuming db.js exports a connection pool


// Register a new user
exports.register = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, role]
        );
        res.status(201).send({ message: 'Successfully registered user', userId: result.insertId });
    } catch (error) {
        res.status(500).send({ message: 'Error registering user', error });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        const hashedPassword = await bcrypt.hash(password, 10)
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        // Get doctor or patient information
        // relation_id can be doctor.id or patient.id
        user.relation_id = null;
        user.relation = null;
        if (user.role == 'doctor') {
            const [doctor] = await db.query('SELECT * FROM doctors WHERE user_id = ?', [user.id]);
            if (doctor.length > 0) {
                user.relation_id = doctor[0]['id'];
                user.relation = doctor[0];
            }
        }

        if (user.role == 'patient') {
            const [patient] = await db.query('SELECT * FROM patients WHERE user_id = ?', [user.id]);
            if (patient.length > 0) {
                user.relation_id = patient[0]['id'];
                user.relation = patient[0];
            }
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, relation_id: user.relation_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).send({ token, user: { id: user.id, email: user.email, role: user.role, relation: user.relation } });
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor', error });
    }
};

exports.loginWithToken = async (req, res) => {

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(403).send({ message: 'Malformed token' });
    }

    console.log('token', token);

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Invalid or expired token' });
        }
        const user = decoded; // Add user info (id, role) to the request
        user.relation_id = null;
        user.relation = null;
        if (user.role == 'doctor') {
            const [doctor] = await db.query('SELECT * FROM doctors WHERE user_id = ?', [user.id]);
            if (doctor.length > 0) {
                user.relation_id = doctor[0]['id'];
                user.relation = doctor[0];
            }
        }

        if (user.role == 'patient') {
            const [patient] = await db.query('SELECT * FROM patients WHERE user_id = ?', [user.id]);
            if (patient.length > 0) {
                user.relation_id = patient[0]['id'];
                user.relation = patient[0];
            }
        }

        const resp = { token, user: user }
        console.log('resp', resp);
        return res.status(200).send(resp);
    });



    // return res.status(403).send({ message: 'Unknow error' });
}