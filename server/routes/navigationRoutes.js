const express = require('express');
const router = express.Router();
const { getNavigation } = require('../controllers/navigationController');

router.get('/', getNavigation);

module.exports = router;
