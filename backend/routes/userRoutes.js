const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const { protect, admin } = require("../middleware/authMiddleware");

/**
 * @description Định tuyến cho hệ thống tài khoản
 */

// ==========================================
// ROUTES CHO KHÁCH HÀNG
// ==========================================
// Đăng ký thành viên mới
router.post("/register", registerUser);

// Đăng nhập hệ thống
router.post("/login", loginUser);

// Xem profile cá nhân
router.get("/profile", protect, getUserProfile);

// 🚨 ĐÃ SỬA: Gọi trực tiếp tên hàm vì đã import ở trên
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ==========================================
// ROUTES CHO QUẢN TRỊ VIÊN (ADMIN)
// ==========================================
// Lấy danh sách tất cả người dùng
router.get("/", protect, admin, getAllUsers);

// Xóa người dùng theo ID
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
