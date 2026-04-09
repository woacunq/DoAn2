import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { CheckCircle, XCircle, Loader, ShoppingBag } from "lucide-react";
// THÊM MỚI: Import useCart để xóa giỏ hàng
import { useCart } from "../context/CartContext";

const PaymentResult = () => {
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");
  const location = useLocation();
  const navigate = useNavigate();

  // THÊM MỚI: Lấy hàm clearCart từ Context
  const { clearCart } = useCart();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Gọi API xác thực của Backend kèm theo toàn bộ query params của VNPay
        const { data } = await axiosClient.get(
          `/orders/vnpay_return${location.search}`,
        );

        if (data.success) {
          setStatus("success");
          setMessage(
            "Thanh toán thành công! Đơn hàng của bạn đang được xử lý.",
          );

          // THÊM MỚI: Xóa giỏ hàng ở Frontend sau khi thanh toán thành công
          clearCart();
        } else {
          setStatus("error");
          setMessage("Thanh toán thất bại hoặc đã bị hủy.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi xác thực thanh toán.",
        );
      }
    };

    if (location.search) {
      verifyPayment();
    } else {
      setStatus("error");
      setMessage("Không tìm thấy thông tin thanh toán hợp lệ.");
    }
  }, [location, clearCart]); // Thêm clearCart vào dependency array

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in zoom-in duration-500">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
        {/* TRẠNG THÁI LOADING */}
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader className="animate-spin text-predator mb-4" size={60} />
            <h2 className="text-xl font-black italic text-gray-900 uppercase">
              Đang xử lý...
            </h2>
            <p className="text-gray-500 mt-2">{message}</p>
          </div>
        )}

        {/* TRẠNG THÁI THÀNH CÔNG */}
        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle
              className="text-green-500 mb-4 animate-bounce"
              size={80}
            />
            <h2 className="text-2xl font-black italic text-gray-900 uppercase text-green-600">
              Tuyệt vời!
            </h2>
            <p className="text-gray-600 mt-2 mb-8">{message}</p>
            <Link
              to="/profile"
              className="w-full bg-predator text-black font-black uppercase tracking-widest py-4 rounded-xl hover:brightness-105 transition-all"
            >
              Xem đơn hàng
            </Link>
          </div>
        )}

        {/* TRẠNG THÁI LỖI / HỦY */}
        {status === "error" && (
          <div className="flex flex-col items-center">
            <XCircle className="text-red-500 mb-4" size={80} />
            <h2 className="text-2xl font-black italic text-gray-900 uppercase text-red-600">
              Thất bại
            </h2>
            <p className="text-gray-600 mt-2 mb-8">{message}</p>
            <Link
              to="/cart"
              className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-predator hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} /> Quay lại giỏ hàng
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
