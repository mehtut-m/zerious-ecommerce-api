const express = require('express');
const {
  getAllBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandController');

const {
  authenticate,
  authenticateAdmin,
} = require('../middlewares/authenticate');

const router = express.Router();

router.get('/', getAllBrand);

router.post('/', authenticate, authenticateAdmin, createBrand);
router.put('/:id', authenticate, authenticateAdmin, updateBrand);
router.delete('/:id', authenticate, authenticateAdmin, deleteBrand);

module.exports = router;
