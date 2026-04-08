import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
  Filter,
  Search,
  SlidersHorizontal,
  ArrowRight,
  X,
  Tag,
} from "lucide-react";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Lấy các tham số từ URL
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentSort = searchParams.get("sort") || "newest"; // Mặc định sắp xếp mới nhất

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 2. Fetch và Xử lý dữ liệu
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryString = searchParams.toString();
        const { data } = await axiosClient.get(`/products?${queryString}`);

        let fetchedProducts = data.data || [];

        // LỌC THEO THƯƠNG HIỆU (Frontend)
        if (currentBrand) {
          fetchedProducts = fetchedProducts.filter(
            (p) => p.brand?.toLowerCase() === currentBrand.toLowerCase(),
          );
        }

        // SẮP XẾP SẢN PHẨM (Frontend)
        if (currentSort === "price_asc") {
          fetchedProducts.sort((a, b) => a.basePrice - b.basePrice);
        } else if (currentSort === "price_desc") {
          fetchedProducts.sort((a, b) => b.basePrice - a.basePrice);
        } else {
          // "newest" - Thường Backend đã sắp xếp sẵn theo createdAt giảm dần,
          // nhưng có thể sort lại bằng Javascript cho chắc chắn
          fetchedProducts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams, currentBrand, currentSort]); // Chạy lại khi Params thay đổi

  // ==========================================
  // CÁC HÀM XỬ LÝ SỰ KIỆN LỌC & SẮP XẾP
  // ==========================================
  const handleCategoryChange = (category) => {
    if (category === "") searchParams.delete("category");
    else searchParams.set("category", category);
    setSearchParams(searchParams);
    setShowMobileFilters(false);
  };

  const handleBrandChange = (brand) => {
    if (brand === "") searchParams.delete("brand");
    else searchParams.set("brand", brand);
    setSearchParams(searchParams);
    setShowMobileFilters(false);
  };

  const handleSortChange = (e) => {
    searchParams.set("sort", e.target.value);
    setSearchParams(searchParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value;
    if (searchTerm) searchParams.set("search", searchTerm);
    else searchParams.delete("search");
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setShowMobileFilters(false);
  };

  // Dữ liệu Danh mục và Thương hiệu (Có thể tùy chỉnh)
  const categories = [
    { id: "", name: "Tất cả sản phẩm" },
    { id: "Shoes", name: "Giày Bóng Đá" },
    { id: "Shirt", name: "Áo Đấu" },
    { id: "Accessories", name: "Phụ Kiện" },
  ];

  const brands = [
    { id: "", name: "Tất cả thương hiệu" },
    { id: "PREDATOR", name: "PREDATOR" },
    { id: "Adidas", name: "Adidas" },
    { id: "Nike", name: "Nike" },
    { id: "Puma", name: "Puma" },
  ];

  return (
    <div className="py-8 animate-in fade-in duration-500">
      {/* HEADER DANH MỤC CẤP CAO */}
      <div className="bg-black text-white rounded-3xl p-10 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-predator/20 to-transparent mix-blend-overlay"></div>
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">
            {currentSearch
              ? `Kết quả cho "${currentSearch}"`
              : categories.find((c) => c.id === currentCategory)?.name ||
                "Bộ sưu tập Predator"}
          </h1>
          <p className="text-gray-400 font-medium max-w-lg">
            Khám phá những sản phẩm đỉnh cao được thiết kế để nâng tầm màn trình
            diễn của bạn trên sân cỏ.
          </p>
        </div>

        <button
          onClick={() => setShowMobileFilters(true)}
          className="md:hidden relative z-10 flex items-center gap-2 bg-white/10 px-6 py-3 rounded-xl backdrop-blur-md font-bold uppercase tracking-widest text-sm hover:bg-white/20 transition-all"
        >
          <SlidersHorizontal size={18} /> Bộ lọc
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR BỘ LỌC */}
        <div
          className={`
          fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-300 md:static md:bg-transparent md:z-0 md:block md:w-1/4 lg:w-1/5
          ${showMobileFilters ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"}
        `}
        >
          <div
            className={`
            absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white p-6 shadow-2xl transition-transform duration-300 md:static md:w-full md:h-auto md:bg-transparent md:p-0 md:shadow-none md:translate-x-0 overflow-y-auto
            ${showMobileFilters ? "translate-x-0" : "translate-x-full"}
          `}
          >
            <div className="flex items-center justify-between mb-8 md:hidden">
              <h2 className="text-xl font-black uppercase italic">Bộ Lọc</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 bg-gray-100 rounded-full text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Ô TÌM KIẾM */}
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                <Search size={16} /> Tìm kiếm
              </h3>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={currentSearch}
                  placeholder="Tên sản phẩm..."
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:border-predator transition-all shadow-sm text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-3 text-gray-400 hover:text-predator transition-colors"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* BỘ LỌC DANH MỤC */}
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                <Filter size={16} /> Danh Mục
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-between group ${
                      currentCategory === cat.id
                        ? "bg-black text-predator shadow-md"
                        : "bg-white border border-gray-100 text-gray-600 hover:border-predator hover:text-predator"
                    }`}
                  >
                    {cat.name}
                    {currentCategory === cat.id && (
                      <ArrowRight size={16} className="animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* BỘ LỌC THƯƠNG HIỆU (MỚI THÊM) */}
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                <Tag size={16} /> Thương Hiệu
              </h3>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandChange(brand.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      currentBrand === brand.id
                        ? "bg-predator text-black shadow-md border border-predator"
                        : "bg-gray-50 border border-gray-200 text-gray-500 hover:border-predator hover:text-predator"
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Nút Xóa Bộ Lọc */}
            {(currentCategory ||
              currentSearch ||
              currentBrand ||
              currentSort !== "newest") && (
              <button
                onClick={clearFilters}
                className="w-full bg-red-50 text-red-500 font-bold uppercase py-3 rounded-xl border border-red-100 hover:bg-red-100 transition-colors text-sm"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* DANH SÁCH SẢN PHẨM (LƯỚI) */}
        <div className="md:w-3/4 lg:w-4/5">
          {/* Thanh Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
            <p className="text-gray-500 font-medium">
              Hiển thị{" "}
              <span className="font-black text-black">{products.length}</span>{" "}
              sản phẩm
            </p>

            {/* DROPDOWN SẮP XẾP (ĐÃ KÍCH HOẠT) */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Sắp xếp:
              </span>
              <select
                value={currentSort}
                onChange={handleSortChange}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-lg focus:ring-predator focus:border-predator block p-2.5 outline-none cursor-pointer hover:border-predator transition-colors"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-gray-100 h-80 rounded-3xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-black uppercase italic mb-2 text-gray-900">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-500 font-medium mb-6">
                Thử thay đổi từ khóa hoặc bộ lọc danh mục xem sao.
              </p>
              <button
                onClick={clearFilters}
                className="bg-predator text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:brightness-105 transition-all"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative"
                >
                  <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                    {product.stock === 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-full shadow-sm">
                        Hết hàng
                      </span>
                    )}
                    {product.isCustomizable && (
                      <span className="bg-black text-predator text-[10px] font-black uppercase px-2 py-1 rounded-full shadow-sm">
                        Premium
                      </span>
                    )}
                  </div>

                  <div className="relative bg-gray-50 rounded-2xl aspect-square mb-4 overflow-hidden flex items-center justify-center p-4">
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
                        <span className="text-sm font-normal text-gray-500">
                          đ
                        </span>
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
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
