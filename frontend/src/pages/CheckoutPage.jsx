import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import {
  MapPin,
  Phone,
  User,
  CheckCircle,
  ArrowLeft,
  Map,
  Truck,
  CreditCard,
} from "lucide-react";

const CheckoutPage = () => {

  const { cartItems, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // BẮT DỮ LIỆU TỪ TRANG GIỎ HÀNG
  const location = useLocation();
  const selectedItemKeys = location.state?.selectedItems || [];

  // LỌC DANH SÁCH: Chỉ lấy những món đã được tích chọn (Nếu không có, fallback về toàn bộ giỏ)
  const checkoutItems =
    selectedItemKeys.length > 0
      ? cartItems.filter((item) =>
          selectedItemKeys.includes(`${item._id}-${item.size}`),
        )
      : cartItems;

  // 1. States
  const [shippingAddress, setShippingAddress] = useState(() => {
    const savedAddress = localStorage.getItem("predator_shipping_info");
    if (savedAddress) return JSON.parse(savedAddress);
    return {
      fullName: user?.name || "",
      phone: "",
      address: "",
      city: "",
    };
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TÍNH TIỀN: Dựa trên những món đã chọn (checkoutItems)
  const itemsPrice = checkoutItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const shippingPrice = itemsPrice > 2000000 ? 0 : 30000;
  const totalPrice = itemsPrice + shippingPrice;

  // 2. Effects
  useEffect(() => {
    localStorage.setItem(
      "predator_shipping_info",
      JSON.stringify(shippingAddress),
    );
  }, [shippingAddress]);

  useEffect(() => {
    const checkAuthTimer = setTimeout(() => {
      const hasSavedUser =
        localStorage.getItem("userInfo") || localStorage.getItem("token");

      if (!user && !hasSavedUser) {
        alert("Vui lòng đăng nhập để tiến hành thanh toán!");
        navigate("/login");
      } else if (user && checkoutItems.length === 0) {
        navigate("/cart");
      }
    }, 300);

    return () => clearTimeout(checkAuthTimer);
  }, [user, checkoutItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  // 3. Logic Submit Đơn Hàng
  const placeOrderHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // Gom data từ những món ĐÃ CHỌN
      const formattedOrderItems = checkoutItems.map((item) => ({
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
        shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      if (paymentMethod === "VNPAY" || paymentMethod === "MOMO") {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          setError("Lỗi: Không nhận được đường dẫn thanh toán từ hệ thống.");
        }
      } else {
        alert(
          "🎉 Đặt hàng thành công! Mã đơn hàng của bạn là: " +
            (data?.data?._id || data?._id),
        );

        // CHỈ XÓA NHỮNG MÓN ĐÃ MUA KHỎI GIỎ HÀNG THAY VÌ XÓA SẠCH
        if (selectedItemKeys.length > 0) {
          checkoutItems.forEach((item) => removeFromCart(item._id, item.size));
        } else {
          clearCart();
        }

        navigate("/profile");
      }
    } catch (err) {
      console.error("Lỗi đặt hàng:", err.response?.data);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi đặt hàng.");
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        <div className="lg:col-span-3">
          <form
            onSubmit={placeOrderHandler}
            className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm"
          >
            <h2 className="text-xl font-black uppercase mb-6 italic text-gray-900 border-b border-gray-100 pb-4">
              Thông tin nhận hàng
            </h2>
            <div className="space-y-6 mb-10">
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
            </div>

            <h2 className="text-xl font-black uppercase mb-6 italic text-gray-900 border-b border-gray-100 pb-4 mt-8">
              Phương thức thanh toán
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  paymentMethod === "COD"
                    ? "border-predator bg-predator/5 shadow-md"
                    : "border-gray-100 hover:border-predator/50 bg-gray-50"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${paymentMethod === "COD" ? "bg-predator text-black" : "bg-gray-200 text-gray-500"}`}
                >
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase text-sm">
                    Thanh toán COD
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Thanh toán bằng tiền mặt khi nhận hàng
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("VNPAY")}
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  paymentMethod === "VNPAY"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-100 hover:border-blue-300 bg-gray-50"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${paymentMethod === "VNPAY" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  <CreditCard size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 uppercase text-sm">
                    Cổng VNPay
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Thẻ ATM nội địa, Visa, QR Code
                  </p>
                </div>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || checkoutItems.length === 0}
              className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest mt-10 shadow-md 
                ${
                  paymentMethod === "VNPAY"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-predator hover:brightness-105 text-black"
                } 
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading
                ? "Đang xử lý..."
                : paymentMethod === "VNPAY"
                  ? "Thanh toán qua VNPay"
                  : "Xác nhận đặt hàng"}
              <CheckCircle size={20} />
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm sticky top-24">
            <h2 className="text-xl font-black uppercase mb-6 italic text-gray-900 border-b border-gray-100 pb-4">
              Đơn hàng của bạn
            </h2>

            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {/* RENDER DỰA TRÊN checkoutItems */}
              {checkoutItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-gray-50 rounded-lg border border-gray-100 p-1"
                  />
                  <div className="flex-1">
                    <h4
                      className="text-sm font-bold text-gray-900 truncate uppercase"
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Size:{" "}
                      <span className="font-bold text-gray-700">
                        {item.size}
                      </span>{" "}
                      x {item.qty}
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
                      ? "text-green-600 font-bold uppercase text-xs tracking-widest"
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

            {shippingPrice === 0 && (
              <p className="text-center text-[10px] uppercase font-bold text-green-600 mt-4 tracking-widest bg-green-50 py-2 rounded-lg border border-green-100">
                🎉 Đơn hàng của bạn đủ điều kiện Freeship
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
