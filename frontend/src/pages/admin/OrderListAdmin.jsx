import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Package, Eye, CheckCircle, Clock, User, DollarSign } from "lucide-react";

const OrderListAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Lấy toàn bộ đơn hàng
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/orders");
      setOrders(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể lấy danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Xử lý cập nhật trạng thái "Đã giao hàng"
  const deliverHandler = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn xác nhận đã giao đơn hàng này?")) {
      try {
        await axiosClient.put(`/orders/${orderId}/deliver`);
        alert("Cập nhật trạng thái thành công!");
        fetchOrders(); // Tải lại danh sách
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || "Không thể cập nhật"));
      }
    }
  };

  if (loading) return <div className="animate-pulse p-10">Đang tải danh sách đơn hàng...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black uppercase italic border-l-4 border-predator pl-4">
          Quản lý đơn hàng
        </h1>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
            <Package className="text-predator" size={20} />
            <span className="font-bold">{orders.length} Đơn hàng</span>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">{error}</div>}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">Mã Đơn</th>
              <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">Khách Hàng</th>
              <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">Ngày Đặt</th>
              <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">Tổng Tiền</th>
              <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">Trạng Thái</th>
              <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-5 font-bold text-sm text-gray-900">#{order._id.substring(18, 24).toUpperCase()}</td>
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900">{order.user?.name || "N/A"}</span>
                    <span className="text-xs text-gray-500">{order.user?.email}</span>
                  </div>
                </td>
                <td className="p-5 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-5 font-black text-gray-900">
                  {order.totalPrice.toLocaleString()} đ
                </td>
                <td className="p-5">
                  {order.isDelivered ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-fit">
                      <CheckCircle size={12} /> Đã giao
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-fit">
                      <Clock size={12} /> Đang xử lý
                    </span>
                  )}
                </td>
                <td className="p-5 text-right space-x-2">
                  {!order.isDelivered && (
                    <button
                      onClick={() => deliverHandler(order._id)}
                      className="bg-black text-predator p-2 rounded-lg hover:brightness-125 transition-all shadow-sm"
                      title="Xác nhận giao hàng"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-all">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListAdmin;