const express = require('express');
const router = express.Router();

const { generateToken } = require('../middlewares/authentication/auth');

// Import Controllers
const { googleLogin } = require('../controllers/authController');

// Google Login Routes
router.post('/google', googleLogin, generateToken);

module.exports = router;
