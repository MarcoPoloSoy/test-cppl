const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middleware/authMiddleware');

// Define the global search route
// This route is protected and requires authentication
router.get('/', authMiddleware, searchController.globalSearch);

module.exports = router;
