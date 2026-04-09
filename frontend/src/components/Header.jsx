import { ShoppingCart, User, Search, Trophy, LogOut, LayoutGrid, Ruler } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation(); // Dùng để highlight trang đang đứng
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Style cho các link điều hướng
  const navLinkStyle = (path) => `
    relative font-black uppercase tracking-widest text-xs transition-all duration-300
    ${location.pathname === path 
      ? "text-predator" 
      : "text-gray-600 hover:text-predator"}
    before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 
    before:bg-predator before:transition-all before:duration-300
    hover:before:w-full
    ${location.pathname === path ? "before:w-full" : ""}
  `;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* 1. LOGO */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer shrink-0">
          <div className="w-10 h-10 bg-predator rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">
            <Trophy size={24} className="text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic">
            PREDATOR<span className="text-predator font-black">STORE</span>
          </span>
        </Link>

        {/* 2. MENU ĐIỀU HƯỚNG (Thay thế cho Thanh tìm kiếm) */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/" className={navLinkStyle("/")}>
            Trang chủ
          </Link>
          <Link to="/products" className={navLinkStyle("/products")}>
            Sản phẩm
          </Link>
          <Link to="/size-guide" className={navLinkStyle("/size-guide")}>
            <span className="flex items-center gap-1">
               <Ruler size={14} /> Bảng Size
            </span>
          </Link>
          {/* Bạn có thể thêm các trang khác như "Tin tức" hoặc "Liên hệ" tại đây */}
        </nav>

        {/* 3. NHÓM HÀNH ĐỘNG */}
        <div className="flex items-center gap-6 shrink-0">
          
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
          </Link>

          {/* KHU VỰC TÀI KHOẢN */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-900 font-bold uppercase tracking-wider text-sm hover:text-predator transition-colors cursor-pointer"
                title="Quản lý tài khoản"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 text-predator">
                  <User size={16} />
                </div>
                <span className="hidden lg:inline">
                  Chào, {user.name?.split(" ")[0] || "Bạn"}
                </span>
              </Link>

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
              <span className="text-[10px] hidden sm:inline uppercase tracking-widest">
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