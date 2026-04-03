const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

/**
 * @description Định tuyến cho hệ thống tài khoản
 */

// Đăng ký thành viên mới
router.post('/register', registerUser);

// Đăng nhập hệ thống
router.post('/login', loginUser);

module.exports = router;