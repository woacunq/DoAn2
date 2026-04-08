const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createOrder);

router.get("/myorders", getMyOrders);

// ROUTES CHO ADMIN
router.get("/", admin, getAllOrders); // Lấy toàn bộ đơn hàng của hệ thống
router.put("/:id/deliver", admin, updateOrderToDelivered); // Đánh dấu đã giao

module.exports = router;
