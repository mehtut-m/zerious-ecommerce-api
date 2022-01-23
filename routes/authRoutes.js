const express = require('express');
const router = express.Router();

const { generateToken } = require('../middlewares/authentication/auth');

// Import Controllers
const {
  googleLogin,
  facebookLogin,
  register,
  login,
} = require('../controllers/authController');

const { authenticate } = require('../middlewares/authentication/auth');

// Google Login Routes
router.post('/google', googleLogin, generateToken);

// Facebook Login Routes
router.post('/fb', facebookLogin, generateToken);

// Register Routes
router.post('/register', register, generateToken);

// Login Routes
router.post('/login', login, generateToken);
router.post('/protected', authenticate);

module.exports = router;
