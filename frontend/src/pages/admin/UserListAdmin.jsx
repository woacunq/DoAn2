import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Users, ShieldCheck, User, Trash2, Mail, Calendar } from "lucide-react";

const UserListAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch danh sách người dùng
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/users");
      setUsers(data.data || data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể lấy danh sách người dùng.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Hàm Xóa người dùng
  const deleteHandler = async (id, isAdmin) => {
    if (isAdmin) {
      alert("CẢNH BÁO: Không thể xóa tài khoản Quản trị viên (Admin)!");
      return;
    }

    if (
      window.confirm("Bạn có chắc chắn muốn xóa khách hàng này khỏi hệ thống?")
    ) {
      try {
        await axiosClient.delete(`/users/${id}`);
        setUsers(users.filter((u) => u._id !== id)); // Cập nhật UI ngay lập tức
        alert("Đã xóa người dùng thành công!");
      } catch (err) {
        alert(
          "Lỗi: " +
            (err.response?.data?.message || "Không thể xóa người dùng."),
        );
      }
    }
  };

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="animate-pulse p-10">Đang tải danh sách người dùng...</div>
    );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-black uppercase italic border-l-4 border-predator pl-4 text-gray-900">
          Quản lý Khách hàng
        </h1>

        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
            <Users className="text-predator" size={20} />
            <span className="font-bold text-gray-800">
              {users.length} Người dùng
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 font-bold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500 w-16">
                  ID
                </th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">
                  Khách Hàng
                </th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">
                  Liên Hệ
                </th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">
                  Vai Trò
                </th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">
                  Ngày Đăng Ký
                </th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500 text-right">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-5 text-xs text-gray-400 font-bold">
                    #{user._id.substring(18, 24).toUpperCase()}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${user.isAdmin ? "bg-black border-predator text-predator" : "bg-gray-100 border-gray-200 text-gray-500"}`}
                      >
                        {user.isAdmin ? (
                          <ShieldCheck size={20} />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <span className="font-bold text-sm text-gray-900 uppercase">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Mail size={14} className="text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="p-5">
                    {user.isAdmin ? (
                      <span className="bg-black text-predator px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-1 w-fit shadow-sm">
                        <ShieldCheck size={14} /> Admin
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-1 w-fit border border-gray-200">
                        <User size={14} /> Khách
                      </span>
                    )}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => deleteHandler(user._id, user.isAdmin)}
                      disabled={user.isAdmin} // Không cho tự xóa Admin
                      className={`p-2.5 rounded-xl transition-all shadow-sm ${
                        user.isAdmin
                          ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                      title={
                        user.isAdmin ? "Không thể xóa Admin" : "Xóa người dùng"
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListAdmin;
