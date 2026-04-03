const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * @description Chốt chặn xác thực Token (JWT)
 * @param {Object} req.headers.authorization - Phải chứa chuỗi 'Bearer <token>'
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Gán dữ liệu user vào request để các controller phía sau sử dụng
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }
};

/**
 * @description Kiểm tra quyền quản trị (Role-Based Access Control)
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Quyền truy cập bị từ chối. Chỉ dành cho Admin!",
    });
  }
};
module.exports = { protect, admin };
