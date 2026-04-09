const mongoose = require("mongoose");

/**
 * Order Schema: Quản lý đơn đặt hàng và trạng thái giao hàng
 */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    // Danh sách các sản phẩm trong đơn hàng
    orderItems: [
      {
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
          ref: "Product",
        },
      },
    ],

    shippingAddress: {
      fullName: { type: String, required: true }, // CẬP NHẬT: Thêm tên người nhận
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      required: true,
      // CẬP NHẬT: Thêm VNPAY và MOMO vào danh sách hợp lệ
      enum: ["COD", "Bank Transfer", "Paypal", "VNPAY", "MOMO"],
      default: "COD",
    },

    // CẬP NHẬT: Thêm tiền hàng và phí ship để khớp với payload từ React
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    status: {
      type: String,
      required: true,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
