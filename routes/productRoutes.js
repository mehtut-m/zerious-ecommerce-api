const express = require('express');
const app = express();
const router = express.Router();

const {
  createProduct,
  getAllProduct,
  getProductByHobby,
} = require('../controllers/productController');
const upload = require('../middlewares/upload');

// Get all product
router.get('/', getAllProduct);

router.get('/hobby/:hobbyId', getProductByHobby);
// Get product by id
// router.post('/:id',);

// Create a new product
// pending : upload image to cloudinary then implement authentication
router.post('/', upload.single('productImg'), createProduct);

module.exports = router;
