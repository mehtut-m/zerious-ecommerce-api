const express = require('express');
const app = express();
const router = express.Router();

const { addItemToCart } = require('../controllers/orderController');
const { authenticate } = require('../middlewares/authenticate');

// Get all product
router.post('/', authenticate, addItemToCart);

module.exports = router;
