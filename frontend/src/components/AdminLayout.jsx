import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  // Danh sách các menu bên trái
  const menuItems = [
    { name: "Tổng quan", path: "/admin", icon: <LayoutDashboard size={20} /> },
    {
      name: "Quản lý Đơn hàng",
      path: "/admin/orders",
      icon: <Package size={20} />,
    },
    {
      name: "Quản lý Sản phẩm",
      path: "/admin/products",
      icon: <ShoppingBag size={20} />,
    },
    {
      name: "Quản lý Người dùng",
      path: "/admin/users",
      icon: <Users size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* SIDEBAR BÊN TRÁI */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm hidden md:flex">
        {/* Logo Admin */}
        <div className="p-6 border-b border-gray-100 flex flex-col items-center">
          <div className="bg-black text-predator font-black italic text-xl px-4 py-2 rounded-lg mb-2 uppercase tracking-widest w-full text-center">
            PREDATOR
          </div>
          <span className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">
            Control Panel
          </span>
        </div>

        {/* Menu Điều hướng */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-predator text-black shadow-md"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-xl font-bold transition-all text-sm"
          >
            <ArrowLeft size={18} /> Về trang web
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all text-sm"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* NỘI DUNG CHÍNH BÊN PHẢI */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header nhỏ của Admin */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <h2 className="text-lg font-black uppercase italic text-gray-800">
            {menuItems.find((item) => item.path === location.pathname)?.name ||
              "Bảng điều khiển"}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-600">
              Admin: <span className="text-black uppercase">{user?.name}</span>
            </span>
            <div className="w-8 h-8 bg-predator rounded-full border-2 border-black"></div>
          </div>
        </header>

        {/* Khu vực hiển thị các trang con (Outlet) */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
