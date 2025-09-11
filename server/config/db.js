const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Creates and exports a connection pool to the MySQL database.
 * Using a pool is more efficient for handling multiple simultaneous connections.
 * Credentials are loaded securely from environment variables (.env).
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Optional: Test the connection when starting the application
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to the MySQL database.');
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

module.exports = pool;
