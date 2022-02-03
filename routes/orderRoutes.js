const express = require('express');
const app = express();
const router = express.Router();

const {
  updateCart,
  getCart,
  clearCart,
  removeCartItemById,
  getMyOrder,
  getMyOrderById,
} = require('../controllers/orderController');

const { authenticate } = require('../middlewares/authenticate');

// Get all cart
router.get('/cart', authenticate, getCart);
// router.get('/:orderId', authenticate, getCart);
router.post('/', authenticate, updateCart);
// delete only cart-item
router.delete('/cart/item/:orderItemId', authenticate, removeCartItemById);
// delete entire order
router.delete('/cart/:orderId', authenticate, clearCart);

// Get All user order
router.get('/', authenticate, getMyOrder);
router.get('/:id', authenticate, getMyOrderById);

// Check out
// router.post('/', authenticate, updateCart);

module.exports = router;
