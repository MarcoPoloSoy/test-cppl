const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all appointment routes
router.use(authMiddleware);

router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.createAppointment);
router.get('/dashboard', appointmentController.getAppointmentDashboardInfo);
router.get('/patient/:id', appointmentController.getAppointmentsByPatient);
router.get('/doctor/:id', appointmentController.getAppointmentsByDoctor);
router.get('/:id', appointmentController.getAppointmentById);
router.delete('/:id', appointmentController.deleteAppointment);
router.patch('/:id', appointmentController.updateAppointment);

module.exports = router;
