const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct, // Thêm hàm xóa để quản lý kho
} = require("../controllers/productController");

// Import "vệ sĩ" để kiểm tra Token và quyền Admin
const { protect, admin } = require("../middleware/authMiddleware");

/**
 * @description Quản lý hệ thống định tuyến cho Sản phẩm (Products)
 */

// Middleware log (giữ nguyên để debug)
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Request: ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * @route   GET /api/products
 * @access  Public (Ai cũng xem được)
 */
router.get("/", getAllProducts);

/**
 * @route   POST /api/products
 * @access  Private/Admin (Chỉ Admin mới được tạo)
 */
router.post("/", protect, admin, createProduct);

/**
 * @route   PUT /api/products/:id
 * @access  Private/Admin (Chỉ Admin mới được sửa)
 */
router.put("/:id", protect, admin, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @access  Private/Admin (Chỉ Admin mới được xóa)
 */
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;