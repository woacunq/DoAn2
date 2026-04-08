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

/**
 * @desc    Lấy thông tin profile của người dùng đang đăng nhập (Dùng khi F5 trang)
 * @route   GET /api/users/profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    // Biến req.user đã được gán từ middleware 'protect' trước đó
    const user = req.user;

    if (user) {
      // Trả về cấu trúc giống hệt lúc Login để Frontend dễ xử lý
      res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; /**
 * @desc    Lấy danh sách tất cả người dùng
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Tìm tất cả user, sắp xếp mới nhất lên đầu.
    // Dùng .select('-password') để tuyệt đối không gửi mật khẩu (dù đã mã hóa) về Frontend
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Xóa người dùng
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Bảo mật cấp cao: Không cho phép Admin này xóa tài khoản của Admin khác (hoặc tự sát)
    if (user.isAdmin) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Không thể xóa tài khoản Quản trị viên",
        });
    }

    // Xóa vật lý user khỏi database
    await User.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Đã xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
