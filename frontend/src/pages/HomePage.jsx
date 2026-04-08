import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { ArrowRight, Zap, ShieldCheck, Star } from "lucide-react";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách sản phẩm từ Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosClient.get("/products");
        // Chỉ lấy 8 sản phẩm mới nhất để hiển thị ra trang chủ cho đẹp
        setProducts(data.data?.slice(0, 8) || data?.slice(0, 8) || []);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      {/* ========================================= */}
      {/* 1. HERO BANNER (BANNER CHÍNH TỔNG QUAN) */}
      {/* ========================================= */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-black rounded-[2rem] overflow-hidden mb-12 shadow-2xl group">
        {/* Ảnh nền */}
        <img
          src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop"
          alt="Predator Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000"
        />
        {/* Lớp phủ gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>

        {/* Nội dung Banner */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 w-full md:w-2/3">
          <span className="text-predator font-black tracking-[0.3em] uppercase text-sm mb-4 flex items-center gap-2">
            <Zap size={16} fill="currentColor" /> Bộ sưu tập 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black italic text-white uppercase leading-tight mb-6">
            Bứt phá giới hạn <br />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-predator to-blue-400">
              cùng Predator
            </span>
          </h1>
          <p className="text-gray-300 mb-8 max-w-md font-medium">
            Trang bị những vũ khí tối tân nhất cho đôi chân của bạn. Thống trị
            sân cỏ với công nghệ độc quyền.
          </p>
          <Link
            to="/products"
            className="bg-predator text-black w-fit px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,204,255,0.4)] hover:shadow-[0_0_30px_rgba(0,204,255,0.6)]"
          >
            Mua sắm ngay <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. BANNER DANH MỤC (CATEGORIES) ĐÃ NỐI BỘ LỌC */}
      {/* ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {/* Banner 1: Giày */}
        <Link
          to="/products?category=Shoes"
          className="relative h-[250px] bg-gray-100 rounded-3xl overflow-hidden group"
        >
          <img
            src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop"
            alt="Giày bóng đá"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <span className="bg-white text-black text-[10px] font-black uppercase px-2 py-1 rounded mb-2 inline-block tracking-widest">
              Danh mục
            </span>
            <h3 className="text-2xl font-black text-white uppercase italic flex items-center justify-between">
              Giày Bóng Đá{" "}
              <ArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-predator" />
            </h3>
          </div>
        </Link>

        {/* Banner 2: Áo đấu */}
        <Link
          to="/products?category=Shirt"
          className="relative h-[250px] bg-predator rounded-3xl overflow-hidden group"
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=600&auto=format&fit=crop"
            alt="Áo đấu"
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 p-6 w-full z-20">
            <span className="bg-black text-predator text-[10px] font-black uppercase px-2 py-1 rounded mb-2 inline-block tracking-widest">
              Danh mục
            </span>
            <h3 className="text-2xl font-black text-black uppercase italic flex items-center justify-between">
              Áo Đấu Chính Hãng{" "}
              <ArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-black" />
            </h3>
          </div>
        </Link>

        {/* Banner 3: Phụ kiện */}
        <Link
          to="/products?category=Accessories"
          className="relative h-[250px] bg-gray-900 rounded-3xl overflow-hidden group"
        >
          <img
            src="https://images.unsplash.com/photo-1552066344-2464c1135c32?q=80&w=600&auto=format&fit=crop"
            alt="Phụ kiện"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <span className="bg-predator text-black text-[10px] font-black uppercase px-2 py-1 rounded mb-2 inline-block tracking-widest">
              Danh mục
            </span>
            <h3 className="text-2xl font-black text-white uppercase italic flex items-center justify-between">
              Trang Thiết Bị{" "}
              <ArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-predator" />
            </h3>
          </div>
        </Link>
      </div>

      {/* ========================================= */}
      {/* 3. KHU VỰC SẢN PHẨM NỔI BẬT */}
      {/* ========================================= */}
      <div className="mb-10 flex items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <span className="text-predator font-bold tracking-[0.2em] uppercase text-xs flex items-center gap-2 mb-1">
            <Star size={14} fill="currentColor" /> Mới lên kệ
          </span>
          <h2 className="text-3xl font-black italic uppercase text-gray-900">
            Sản phẩm nổi bật
          </h2>
        </div>
        <Link
          to="/products"
          className="text-gray-500 hover:text-predator font-bold text-sm uppercase tracking-wider hidden sm:block transition-colors"
        >
          Xem tất cả
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-gray-100 h-80 rounded-3xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
          <ShieldCheck size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold">
            Chưa có sản phẩm nào trong cửa hàng.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
            >
              {/* Box Ảnh */}
              <div className="relative bg-gray-50 rounded-2xl aspect-square mb-4 overflow-hidden flex items-center justify-center p-4">
                {product.stock === 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-full z-10">
                    Hết hàng
                  </span>
                )}
                {product.isCustomizable && (
                  <span className="absolute top-3 right-3 bg-black text-predator text-[10px] font-black uppercase px-2 py-1 rounded-full z-10">
                    Premium
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x400/eeeeee/00ccff?text=P";
                  }}
                />
              </div>

              {/* Thông tin */}
              <div className="flex flex-col flex-grow">
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  {product.brand || "PREDATOR"}
                </span>
                <h3 className="text-gray-900 font-bold uppercase line-clamp-2 leading-tight mb-2 group-hover:text-predator transition-colors">
                  {product.name}
                </h3>
                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-end">
                  <span className="text-lg font-black italic text-gray-900">
                    {product.basePrice?.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-gray-500">đ</span>
                  </span>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-predator group-hover:text-black transition-colors text-gray-400">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ========================================= */}
      {/* 4. BRAND BANNERS (THƯƠNG HIỆU ĐỐI TÁC) */}
      {/* ========================================= */}
      <div className="mt-10">
        <div className="mb-8 text-center">
          <span className="text-predator font-bold tracking-[0.2em] uppercase text-xs mb-2 block">
            Đối tác chính thức
          </span>
          <h2 className="text-3xl font-black italic uppercase text-gray-900">
            Thương hiệu hàng đầu
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Brand 1: Predator (Thương hiệu riêng) */}
          <Link
            to="/products?brand=PREDATOR"
            className="bg-black h-32 rounded-3xl flex items-center justify-center group hover:-translate-y-2 transition-all duration-300 shadow-lg"
          >
            <span className="text-predator font-black text-2xl italic tracking-widest group-hover:scale-110 transition-transform">
              PREDATOR
            </span>
          </Link>

          {/* Brand 2: Adidas */}
          <Link
            to="/products?brand=Adidas"
            className="bg-gray-100 h-32 rounded-3xl flex items-center justify-center group hover:-translate-y-2 transition-all duration-300 border border-gray-200"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg"
              alt="Adidas"
              className="h-12 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all mix-blend-multiply"
            />
          </Link>

          {/* Brand 3: Nike */}
          <Link
            to="/products?brand=Nike"
            className="bg-gray-100 h-32 rounded-3xl flex items-center justify-center group hover:-translate-y-2 transition-all duration-300 border border-gray-200"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
              alt="Nike"
              className="h-8 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all mix-blend-multiply"
            />
          </Link>

          {/* Brand 4: Puma */}
          <Link
            to="/products?brand=Puma"
            className="bg-gray-100 h-32 rounded-3xl flex items-center justify-center group hover:-translate-y-2 transition-all duration-300 border border-gray-200"
          >
            <img
              src="https://commons.wikimedia.org/wiki/Special:FilePath/Puma-logo-%28text%29.svg"
              alt="Puma"
              className="h-10 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all mix-blend-multiply"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
