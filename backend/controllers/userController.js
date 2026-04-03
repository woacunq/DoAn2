const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
/**
 * @description Tạo JSON Web Token (Chìa khóa vạn năng)
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

/**
 * @desc    Đăng ký tài khoản khách hàng mới
 * @route   POST /api/users/register
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Kiểm tra email đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email này đã được sử dụng" });
    }

    // 2. Tạo User mới (Mật khẩu sẽ tự động được Hash trong Model)
    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id), // Gửi token về để khách dùng luôn
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Xác thực người dùng & Lấy Token (Đăng nhập)
 * @route   POST /api/users/login
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Kiểm tra user có tồn tại và mật khẩu có khớp không
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
