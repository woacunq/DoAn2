const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema: Quản lý tài khoản khách hàng và phân quyền Admin
 */
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // PHÂN QUYỀN (Authorization)
    isAdmin: {
        type: Boolean,
        required: true,
        default: false 
    }
}, {
    timestamps: true
});

// Hash mật khẩu trước khi lưu DB
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);