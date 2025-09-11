const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for user registration
// POST /api/auth/register
router.post('/register', authController.register);

// Route for user login
// POST /api/auth/login
router.post('/login', authController.login);

router.post('/login-with-token', authMiddleware, authController.loginWithToken);

module.exports = router;
