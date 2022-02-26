const express = require('express');
const app = express();
const router = express.Router();

const {
  createProduct,
  getAllProduct,
  getProductByHobby,
  getProductById,
  searchProduct,
  trendingProduct,
} = require('../controllers/productController');
const upload = require('../middlewares/upload');

// Get all product
router.get('/', getAllProduct);

router.get('/hobby/:hobbyId', getProductByHobby);
// Get product by id
// router.post('/:id',);

router.get('/trending/', trendingProduct);
router.get('/search/', searchProduct);
router.get('/:id', getProductById);
// Create a new product
// pending : upload image to cloudinary then implement authentication
router.post('/', upload.single('productImg'), createProduct);

module.exports = router;
