const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', createOrder);
router.get('/', protect, adminOnly, getOrders);
router.get('/:id', protect, adminOnly, getOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
