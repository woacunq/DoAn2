const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Import "vệ sĩ" để kiểm tra Token và quyền Admin
const { protect, admin } = require("../middleware/authMiddleware");

/**
 * @description Quản lý hệ thống định tuyến cho Sản phẩm (Products)
 */

// Middleware log (giữ nguyên để debug)
router.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] Request: ${req.method} ${req.originalUrl}`,
  );
  next();
});

/**
 * @route   GET /api/products
 * @access  Public (Ai cũng xem được danh sách)
 */
router.get("/", getAllProducts);

/**
 * @route   GET /api/products/:id
 * @access  Public (QUAN TRỌNG: Ai cũng phải xem được chi tiết để mua hàng)
 */
router.get("/:id", getProductById);

/**
 * @route   POST /api/products
 * @access  Private/Admin
 */
router.post("/", protect, admin, createProduct);

/**
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
router.put("/:id", protect, admin, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
