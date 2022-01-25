const express = require('express');
const { getMyProfile } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

router.get('/get-my-info', authenticate, getMyProfile);

module.exports = router;
