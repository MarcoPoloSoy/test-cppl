require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const navigationRoutes = require('./routes/navigationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const path = require('path');


const app = express();

// Middlewares
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse request bodies as JSON

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/search', searchRoutes);

// Angular
app.use(express.static(path.join(__dirname, '../frontend/dist/mpgr/browser')));

app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/mpgr/browser/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
