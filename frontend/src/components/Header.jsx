import { ShoppingCart, User, Search, Trophy, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-predator rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">
            <Trophy size={24} className="text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic">
            PREDATOR<span className="text-predator font-black">STORE</span>
          </span>
        </Link>

        {/* THANH TÌM KIẾM */}
        <div className="hidden md:flex flex-1 max-w-md mx-10 relative group">
          <input
            type="text"
            placeholder="Tìm áo đấu, giày, phụ kiện..."
            className="w-full bg-gray-100 border border-gray-200 rounded-full py-2.5 px-10 focus:outline-none focus:border-predator focus:ring-1 focus:ring-predator/30 transition-all text-sm text-gray-900 placeholder-gray-500"
          />
          <Search
            className="absolute left-3 top-3 text-gray-400 group-focus-within:text-predator transition-colors"
            size={18}
          />
        </div>

        {/* NHÓM HÀNH ĐỘNG */}
        <div className="flex items-center gap-6">
          {/* GIỎ HÀNG */}
          <Link
            to="/cart"
            className="relative cursor-pointer text-gray-700 hover:text-predator transition-all duration-300 group"
          >
            <ShoppingCart size={24} strokeWidth={2} />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-predator text-black text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-in zoom-in duration-300">
                {totalItems}
              </span>
            )}

            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
              Giỏ hàng
            </span>
          </Link>

          {/* KHU VỰC TÀI KHOẢN */}
          {user ? (
            <div className="flex items-center gap-4">
              {/* 🚨 ĐÃ SỬA: Đổi <div> thành <Link to="/profile"> và thêm hiệu ứng hover */}
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-900 font-bold uppercase tracking-wider text-sm hover:text-predator transition-colors cursor-pointer"
                title="Quản lý tài khoản và đơn hàng"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 text-predator">
                  <User size={16} />
                </div>
                <span className="hidden sm:inline">
                  Chào, {user.name?.split(" ")[0] || "Bạn"}
                </span>
              </Link>

              {/* Nút Đăng xuất giữ nguyên */}
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-gray-100 hover:bg-predator hover:text-black hover:border-predator text-gray-700 px-4 py-2 rounded-xl transition-all duration-300 border border-gray-200 font-bold group"
            >
              <User
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-xs hidden sm:inline uppercase tracking-widest">
                Đăng nhập
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
