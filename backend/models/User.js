const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Schema: Quản lý tài khoản khách hàng và phân quyền Admin
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // PHÂN QUYỀN (Authorization)
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    resetPasswordOtp: { type: String },
    resetPasswordExpire: { type: Date },
  },
  {
    timestamps: true,
  },
);

// Hash mật khẩu trước khi lưu DB
userSchema.pre("save", async function () {
  // Nếu mật khẩu không bị thay đổi (VD: chỉ cập nhật mã OTP) thì dừng lại, không băm nữa
  if (!this.isModified("password")) return;

  // Nếu có mật khẩu mới thì tiến hành băm
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
