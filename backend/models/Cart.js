const mongoose = require('mongoose');

/**
 * @description Cart Schema: Lưu trữ tạm thời các sản phẩm khách định mua
 * @notes Giỏ hàng sẽ tự động cập nhật khi khách hàng thêm/bớt sản phẩm
 */
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: { type: Number, required: true, default: 1 },
        size: { type: String, required: true },
        variantType: { type: String }, // VD: TF hoặc FG cho giày
        
        // LOGIC TÙY CHỈNH (In ấn cho Áo)
        isCustom: { type: Boolean, default: false },
        customName: { type: String },
        customNumber: { type: String },
        
        price: { type: Number, required: true } // Lưu giá tại thời điểm thêm vào giỏ
    }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);