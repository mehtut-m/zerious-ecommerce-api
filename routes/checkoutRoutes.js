const express = require('express');
const router = express.Router();
const { checkOutCreditCard } = require('../controllers/checkOutController');
const { authenticate } = require('../middlewares/authenticate');

router.post('/credit-card', authenticate, checkOutCreditCard);

module.exports = router;
