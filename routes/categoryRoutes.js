const express = require('express');
const {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} = require('../controllers/categoryController');

const {
  authenticate,
  authenticateAdmin,
} = require('../middlewares/authentication/auth');

const router = express.Router();

// Complete
router.get('/', getAllCategory);
router.post('/', authenticate, authenticateAdmin, createCategory);
router.put('/:id', authenticate, authenticateAdmin, updateCategory);

// Note Complete

// Pending delete using transactions
router.delete('/:id', authenticate, authenticateAdmin, deleteCategory);

module.exports = router;
