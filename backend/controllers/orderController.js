const Order = require("../models/Order");
const Cart = require("../models/Cart");

/**
 * @desc    Tạo đơn hàng mới
 */
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product",
    );

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    // Logic mapping dữ liệu (để tránh lỗi Validation lần trước)
    const orderItems = cart.cartItems.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      image: item.product.image,
      price: item.price,
      size: item.size,
      subTotal: item.price * item.quantity,
      product: item.product._id,
    }));

    const totalPrice = orderItems.reduce((acc, item) => acc + item.subTotal, 0);

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Lấy danh sách đơn hàng của tôi (QUAN TRỌNG: Phải có hàm này)
 */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
/**
 * @desc    Admin lấy danh sách TẤT CẢ đơn hàng
 * @route   GET /api/orders
 * @access  Private/Admin
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name email");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Admin cập nhật trạng thái đơn hàng (Đã giao hàng)
 * @route   PUT /api/orders/:id/deliver
 * @access  Private/Admin
 */
exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = "Delivered"; // Cập nhật text status nếu bạn có trường này

      const updatedOrder = await order.save();
      res.json({ success: true, data: updatedOrder });
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
