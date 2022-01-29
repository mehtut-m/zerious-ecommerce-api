const express = require('express');
const app = express();
const router = express.Router();

const {
  updateCart,
  getCart,
  clearCart,
  removeCartItemById,
  getMyOrder,
} = require('../controllers/orderController');

const { authenticate } = require('../middlewares/authenticate');

// Get all productx
router.get('/cart', authenticate, getMyOrder);
// router.get('/:orderId', authenticate, getCart);
router.post('/', authenticate, updateCart);
// delete entire order
router.delete('/cart/:orderId', authenticate, clearCart);
// delete only cart-item
router.delete('/cart/item/:orderItemId', authenticate, removeCartItemById);

// Check out
// router.post('/', authenticate, updateCart);

module.exports = router;
