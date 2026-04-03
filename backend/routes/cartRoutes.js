const express = require('express');
const router = express.Router();
const { getCart, addToCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @description Mọi yêu cầu giỏ hàng đều cần Token hợp lệ
 */
router.use(protect); 

router.get('/', getCart);
router.post('/', addToCart);

module.exports = router;