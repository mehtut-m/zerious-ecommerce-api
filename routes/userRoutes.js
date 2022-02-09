const express = require('express');
const { getMyProfile } = require('../controllers/userController');
const { createAddress } = require('../controllers/addressController');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

router.get('/my-info', authenticate, getMyProfile);
router.post('/address', authenticate, createAddress);

module.exports = router;
