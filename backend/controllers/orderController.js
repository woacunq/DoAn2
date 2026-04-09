const Order = require("../models/Order");
const Cart = require("../models/Cart");
const crypto = require("crypto");
const moment = require("moment");

// Hàm hỗ trợ sắp xếp object theo bảng chữ cái
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

/**
 * @desc    Tạo đơn hàng mới (Nhận data từ Frontend)
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
    });

    const createdOrder = await order.save();

    // ĐÃ TẮT: Không tự động xóa sạch giỏ hàng trong DB nữa, vì Frontend đã xử lý xóa từng món khách chọn mua.
    // await Cart.findOneAndDelete({ user: req.user._id });

    // ==========================================
    // XỬ LÝ THANH TOÁN VNPAY
    // ==========================================
    if (paymentMethod === "VNPAY") {
      const tmnCode = process.env.VNP_TMNCODE.trim();
      const secretKey = process.env.VNP_HASHSECRET.trim();
      let vnpUrl = process.env.VNP_URL.trim();
      const returnUrl = process.env.VNP_RETURNURL.trim();

      // Dùng một IP Public an toàn để né lỗi VNPay chặn IP Localhost
      const ipAddr = "13.160.92.202";

      // Múi giờ GMT+7 chuẩn tuyệt đối
      const createDate = moment().utcOffset(7).format("YYYYMMDDHHmmss");

      const vnp_Params = {
        vnp_Amount: Math.round(totalPrice * 100),
        vnp_Command: "pay",
        vnp_CreateDate: createDate,
        vnp_CurrCode: "VND",
        vnp_IpAddr: ipAddr,
        vnp_Locale: "vn",
        vnp_OrderInfo: "Thanh toan don hang", // Ép chuỗi an toàn tuyệt đối, không dùng ký tự đặc biệt
        vnp_OrderType: "other",
        vnp_ReturnUrl: returnUrl,
        vnp_TmnCode: tmnCode,
        vnp_TxnRef: createdOrder._id.toString(),
        vnp_Version: "2.1.0",
      };

      let signData = "";
      let urlQuery = "";

      const sortedKeys = Object.keys(vnp_Params).sort();

      for (let i = 0; i < sortedKeys.length; i++) {
        const key = sortedKeys[i];
        const value = vnp_Params[key];

        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(value).replace(/%20/g, "+");

        signData += encodedKey + "=" + encodedValue;
        urlQuery += encodedKey + "=" + encodedValue;

        if (i < sortedKeys.length - 1) {
          signData += "&";
          urlQuery += "&";
        }
      }

      const hmac = crypto.createHmac("sha512", secretKey);
      const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

      vnpUrl += "?" + urlQuery + "&vnp_SecureHash=" + signed;

      return res
        .status(201)
        .json({ success: true, paymentUrl: vnpUrl, data: createdOrder });
    }

    // Nếu thanh toán COD
    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Xử lý kết quả trả về từ VNPay
 */
exports.vnpayReturn = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    const secretKey = process.env.VNP_HASHSECRET.trim();

    const sortedKeys = Object.keys(vnp_Params).sort();
    let signData = "";
    for (let i = 0; i < sortedKeys.length; i++) {
      const key = sortedKeys[i];
      const value = vnp_Params[key];
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value).replace(/%20/g, "+");

      signData += encodedKey + "=" + encodedValue;
      if (i < sortedKeys.length - 1) {
        signData += "&";
      }
    }

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      if (vnp_Params["vnp_ResponseCode"] === "00") {
        const orderId = vnp_Params["vnp_TxnRef"];
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          paidAt: Date.now(),
          status: "Processing",
        });
        return res
          .status(200)
          .json({ success: true, message: "Thanh toán thành công" });
      }
      return res
        .status(400)
        .json({ success: false, message: "Thanh toán thất bại" });
    }
    return res.status(400).json({ success: false, message: "Sai checksum" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = "Delivered";
      const updatedOrder = await order.save();
      res.json({ success: true, data: updatedOrder });
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
