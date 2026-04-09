const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer"); // Bổ sung thư viện gửi Mail

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
}; 

/**
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

// ==========================================
// TÍNH NĂNG QUÊN MẬT KHẨU (GỬI OTP QUA MAIL)
// ==========================================

/**
 * @desc    Yêu cầu cấp lại mật khẩu (Gửi OTP qua mail)
 * @route   POST /api/users/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });
    }

    // Tạo mã OTP 6 số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP vào Database, hạn sử dụng 5 phút
    user.resetPasswordOtp = otp;
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Cấu hình gửi mail bằng Mật khẩu ứng dụng Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"PREDATOR STORE" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Mã OTP Khôi Phục Mật Khẩu",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
          <h2 style="color: #333;">Khôi phục mật khẩu PREDATOR STORE</h2>
          <p style="color: #555;">Bạn đã yêu cầu đặt lại mật khẩu. Đây là mã xác nhận của bạn:</p>
          <h1 style="color: #00bcd4; font-size: 40px; letter-spacing: 5px; background: #f0f8ff; padding: 15px; border-radius: 8px;">${otp}</h1>
          <p style="color: red; font-size: 14px;">Mã này chỉ có hiệu lực trong 5 phút!</p>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">Nếu bạn không yêu cầu, vui lòng bỏ qua email này để bảo mật tài khoản.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Mã OTP đã được gửi đến email của bạn" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Xác nhận OTP và đổi mật khẩu mới
 * @route   POST /api/users/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    // Tìm user khớp email, khớp OTP và OTP chưa hết hạn
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpire: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn!" });
    }

    // Cập nhật mật khẩu mới (Sẽ được tự động Hash nhờ hàm pre('save') trong Model User)
    user.password = newPassword;
    
    // Dọn dẹp OTP sau khi đổi pass thành công
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};