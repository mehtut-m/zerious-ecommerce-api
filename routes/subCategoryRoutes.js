const express = require('express');
const {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategory,
} = require('../controllers/subCategoryController');

const {
  authenticate,
  authenticateAdmin,
} = require('../middlewares/authenticate');

const router = express.Router();

// Complete
router.get('/', getAllSubCategory);
router.post('/', authenticate, authenticateAdmin, createSubCategory);
router.delete('/:id', authenticate, authenticateAdmin, deleteSubCategory);

// Note Complete
// router.put('/:id', authenticate, authenticateAdmin, updateCategory);

module.exports = router;
