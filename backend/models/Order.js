const mongoose = require('mongoose');

/**
 * Order Schema: Quản lý đơn đặt hàng và trạng thái giao hàng
 */
const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    // Danh sách các sản phẩm trong đơn hàng
    orderItems: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true }, 
        
        // THÔNG TIN BIẾN THỂ 
        size: { type: String, required: true },
        variantType: { type: String }, 

        isCustom: { type: Boolean, default: false },
        customName: { type: String }, 
        customNumber: { type: String }, 
        
        subTotal: { type: Number, required: true }, 

        // Tham chiếu ID sản phẩm gốc
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        }
    }],

    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true }
    },

    paymentMethod: {
        type: String,
        required: true,
        enum: ['COD', 'Bank Transfer', 'Paypal'],
        default: 'COD'
    },

    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },

    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },

    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date }

}, {
    timestamps: true 
});

module.exports = mongoose.model('Order', orderSchema);