const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

// Authorization middleware: checks if the logged-in user is an admin.
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send({ message: 'Access denied. Admin role required.' });
    }
};

// Authorization middleware: checks if the logged-in user is the owner or an admin.
const isAdminOrOwner = (req, res, next) => {
    const requestedId = parseInt(req.params.id, 10);
    if (req.user && (req.user.role === 'admin' || (req.user.role === 'patient' && req.user.relation_id === requestedId))) {
        next();
    } else {
        res.status(403).send({ message: 'Access denied. Owner or admin role required.' });
    }
};

// Public route to list all patients (all active sesions)
router.get('/search', authMiddleware, patientController.searchPatients);
router.get('/', [authMiddleware], patientController.getAllPatients);
router.get('/:id', [authMiddleware], patientController.getPatientById);


// Protected routes for admins
router.post('/', [authMiddleware, isAdmin], patientController.createPatient);
router.patch('/:id', [authMiddleware, isAdminOrOwner], patientController.updatePatient);
router.delete('/:id', [authMiddleware, isAdmin], patientController.deletePatient);

module.exports = router;
