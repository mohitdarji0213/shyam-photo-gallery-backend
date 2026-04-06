const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getNewProducts, getFeaturedProducts, searchProducts } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/new', getNewProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/:slug', getProduct);
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
