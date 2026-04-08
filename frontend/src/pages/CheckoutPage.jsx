import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import { MapPin, Phone, User, CheckCircle, ArrowLeft, Map } from "lucide-react";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Khởi tạo State với dữ liệu từ LocalStorage (nếu có)
  const [shippingAddress, setShippingAddress] = useState(() => {
    const savedAddress = localStorage.getItem("predator_shipping_info");
    if (savedAddress) {
      return JSON.parse(savedAddress);
    }
    // Nếu chưa từng lưu, lấy tạm tên từ tài khoản người dùng (nếu có)
    return {
      fullName: user?.name || "",
      phone: "",
      address: "",
      city: "",
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const shippingPrice = itemsPrice > 2000000 ? 0 : 30000;
  const totalPrice = itemsPrice + shippingPrice;

  // 2. Tự động lưu vào LocalStorage mỗi khi thông tin thay đổi
  useEffect(() => {
    localStorage.setItem(
      "predator_shipping_info",
      JSON.stringify(shippingAddress)
    );
  }, [shippingAddress]);

  // Bảo vệ route
  useEffect(() => {
    if (!user) {
      alert("Vui lòng đăng nhập để tiến hành thanh toán!");
      navigate("/login");
    } else if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [user, cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formattedOrderItems = cartItems.map((item) => ({
        name: item.name,
        quantity: item.qty,
        image: item.image,
        price: item.price,
        size: item.size,
        subTotal: item.price * item.qty,
        product: item._id,
      }));

      const { data } = await axiosClient.post("/orders", {
        orderItems: formattedOrderItems,
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
        },
        paymentMethod: "COD",
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice,
      });

      alert(
        "🎉 Đặt hàng thành công! Mã đơn hàng của bạn là: " +
          (data?.data?._id || data?._id)
      );
      clearCart();
      navigate("/");
    } catch (err) {
      console.error("Lỗi đặt hàng:", err.response?.data);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi đặt hàng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 animate-in fade-in duration-500">
      <Link
        to="/cart"
        className="flex items-center gap-2 text-gray-500 hover:text-predator mb-8 transition-all font-medium w-fit"
      >
        <ArrowLeft size={20} /> Quay lại giỏ hàng
      </Link>

      <h1 className="text-3xl font-black italic uppercase mb-10 border-l-4 border-predator pl-4 text-gray-900">
        Thanh toán
      </h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 border border-red-100 font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
        <div className="lg:col-span-3">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-black uppercase mb-6 italic text-gray-900 border-b border-gray-100 pb-4">
              Thông tin nhận hàng
            </h2>

            <form onSubmit={placeOrderHandler} className="space-y-6">
              <div className="relative">
                <User
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Họ và tên người nhận"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-predator transition-all text-gray-900 font-medium"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="relative">
                <Phone
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="Số điện thoại"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-predator transition-all text-gray-900 font-medium"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="relative">
                <MapPin
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Địa chỉ chi tiết (Số nhà, Tên đường...)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-predator transition-all text-gray-900 font-medium"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="relative">
                <Map
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="Tỉnh / Thành phố"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-predator transition-all text-gray-900 font-medium"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full bg-predator text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:brightness-105 shadow-md active:scale-[0.98] transition-all uppercase tracking-widest mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}{" "}
                <CheckCircle size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm sticky top-24">
            <h2 className="text-xl font-black uppercase mb-6 italic text-gray-900 border-b border-gray-100 pb-4">
              Đơn hàng của bạn
            </h2>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-gray-50 rounded-lg border border-gray-100 p-1"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 truncate uppercase">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Size: {item.size} x {item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {(item.price * item.qty).toLocaleString()}đ
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100 mb-6">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Tạm tính:</span>
                <span className="text-gray-900">
                  {itemsPrice.toLocaleString()} đ
                </span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Phí giao hàng:</span>
                <span
                  className={
                    shippingPrice === 0
                      ? "text-green-600 font-bold uppercase text-xs"
                      : "text-gray-900"
                  }
                >
                  {shippingPrice === 0
                    ? "Miễn phí"
                    : `${shippingPrice.toLocaleString()} đ`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end text-xl font-black italic pt-6 border-t border-gray-100">
              <span className="text-gray-900 uppercase">Tổng cộng:</span>
              <span className="text-predator text-3xl">
                {totalPrice.toLocaleString()}{" "}
                <span className="text-sm text-gray-500">đ</span>
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-6 text-center italic">
              Thanh toán khi nhận hàng (COD). Vui lòng kiểm tra kỹ thông tin
              trước khi đặt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;