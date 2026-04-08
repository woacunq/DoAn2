import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import { User, Mail, Package, Calendar, Clock, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        // Gọi API lấy lịch sử đơn hàng
        const { data } = await axiosClient.get("/orders/myorders");
        // Sắp xếp đơn hàng mới nhất lên đầu
        const sortedOrders = data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setOrders(sortedOrders);
      } catch (err) {
        setError("Không thể tải lịch sử đơn hàng.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  // Hàm format ngày giờ đẹp mắt
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  if (!user)
    return <div className="text-center py-20">Vui lòng đăng nhập...</div>;

  return (
    <div className="container mx-auto px-4 py-10 animate-in fade-in duration-500 min-h-[80vh]">
      <h1 className="text-3xl font-black italic uppercase mb-10 border-l-4 border-predator pl-4 text-gray-900">
        Tài khoản của tôi
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm sticky top-24">
            <div className="flex flex-col items-center text-center border-b border-gray-100 pb-6 mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-md text-predator mb-4">
                <User size={48} />
              </div>
              <h2 className="text-xl font-black uppercase text-gray-900">
                {user.name}
              </h2>
              <p className="text-gray-500 text-sm font-medium flex items-center gap-2 mt-2">
                <Mail size={14} /> {user.email}
              </p>
              {user.isAdmin && (
                <span className="mt-3 bg-black text-predator text-xs font-black uppercase px-3 py-1 rounded-full tracking-widest">
                  Admin
                </span>
              )}
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-3 rounded-xl font-bold transition-all"
            >
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: LỊCH SỬ ĐƠN HÀNG */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-black uppercase mb-6 italic text-gray-900 flex items-center gap-2">
              <Package className="text-predator" /> Lịch sử đơn hàng
            </h2>

            {loading ? (
              <p className="text-gray-500 animate-pulse">
                Đang tải lịch sử mua hàng...
              </p>
            ) : error ? (
              <p className="text-red-500 font-bold">{error}</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">
                  Bạn chưa có đơn hàng nào.
                </p>
                <Link
                  to="/"
                  className="inline-block mt-4 text-predator font-bold hover:underline"
                >
                  Mua sắm ngay
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-2xl p-5 hover:border-predator transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                          Mã đơn:{" "}
                          <span className="text-gray-900 font-bold">
                            #{order._id.substring(18, 24)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Calendar size={14} /> {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.isDelivered
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.isDelivered ? "Đã giao hàng" : "Đang xử lý"}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700 flex items-center gap-1">
                          <Clock size={12} /> COD
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-contain bg-gray-50 rounded border border-gray-100"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Size: {item.size} | SL: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {(item.price * item.quantity).toLocaleString()}đ
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium uppercase">
                        Tổng tiền
                      </span>
                      <span className="text-xl font-black text-predator">
                        {order.totalPrice.toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
