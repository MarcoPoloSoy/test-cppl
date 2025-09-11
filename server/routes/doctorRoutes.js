const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

// This is a simple authorization middleware example.
// It checks if the logged-in user has the 'admin' role.
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send({ message: 'Access denied. Admin role required.' });
    }
};

// It checks if the logged-in user is the owner or has the 'admin' role.
const isAdminOrOwner = (req, res, next) => {
    if (
        req.user && (req.user.role === 'admin' || (req.user.role === 'doctor' && req.user.relation_id === parseInt(req.params.id, 10)))) {
        next();
    } else {
        res.status(403).send({ message: 'Access denied. Owner or admin role required.' });
    }
};


// Public route to list all doctors
router.get('/search', authMiddleware, doctorController.searchDoctors);
router.get('/', authMiddleware, doctorController.getAllDoctors);
router.get('/:id', authMiddleware, doctorController.getDoctorById);

// Protected routes for admins
router.post('/', [authMiddleware, isAdmin], doctorController.createDoctor);
router.patch('/:id', [authMiddleware, isAdminOrOwner], doctorController.updateDoctor);
router.delete('/:id', [authMiddleware, isAdmin], doctorController.deleteDoctor);

module.exports = router;
