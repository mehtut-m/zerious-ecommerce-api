const express = require('express');
const router = express.Router();

const { generateToken } = require('../middlewares/authentication/auth');

// Import Controllers
const { googleLogin, facebookLogin } = require('../controllers/authController');

// Google Login Routes
router.post('/google', googleLogin, generateToken);
router.post('/fb', facebookLogin);

module.exports = router;
