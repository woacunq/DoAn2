import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useCart } from "../context/CartContext";
import {
  ChevronLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  X,
} from "lucide-react";

import { sizeData } from "../utils/sizeData";
import ProductCard from "../components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // --- States ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // --- Fetch Data ---
  useEffect(() => {
    window.scrollTo(0, 0); // Luôn cuộn lên đầu trang khi đổi sản phẩm
    setSelectedSize("");   // Reset size khi đổi sản phẩm
    setQty(1);             // Reset số lượng

    const fetchProductAndRelated = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/products/${id}`);
        const fetchedProduct = data.data || data;
        setProduct(fetchedProduct);
        
        // Ưu tiên ảnh chính, nếu không có lấy ảnh của variant đầu tiên
        setMainImage(
          fetchedProduct.image || (fetchedProduct.variants && fetchedProduct.variants[0]?.image)
        );

        // Fetch gợi ý (Cùng category, trừ sản phẩm hiện tại)
        const relatedRes = await axiosClient.get(`/products`);
        const allProducts = relatedRes.data.data || relatedRes.data;

        const filteredRelated = allProducts
          .filter(
            (p) =>
              p.category === fetchedProduct.category &&
              p._id !== fetchedProduct._id,
          )
          .slice(0, 4);

        setRelatedProducts(filteredRelated);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi fetch sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [id]);

  // --- Logic biến số ---
  const currentVariant = product?.variants?.find((v) => v.size === selectedSize);
  const maxStock = currentVariant ? currentVariant.stock : 0;

  // Lấy bảng size (nếu không có category khớp thì dùng Default)
  const currentSizeGuide = product 
    ? (sizeData[product.category] || sizeData["Default"]) 
    : null;

  // --- Handlers ---
  const updateQty = (type) => {
    if (!selectedSize) {
      alert("Vui lòng chọn Size trước!");
      return;
    }
    if (type === "plus" && qty < maxStock) setQty((prev) => prev + 1);
    if (type === "minus" && qty > 1) setQty((prev) => prev - 1);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQty(1);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Vui lòng chọn kích cỡ trước khi thêm vào giỏ!");
      return;
    }
    addToCart(product, selectedSize, qty);
  };

  // --- Render Loading/Error ---
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 text-predator animate-pulse">
      <div className="w-12 h-12 border-4 border-predator border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black tracking-widest uppercase text-gray-900">Đang tải chi tiết sản phẩm...</p>
    </div>
  );

  if (!product) return <div className="text-center py-20 text-gray-900 font-bold">Không tìm thấy sản phẩm!</div>;

  const productImages = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="py-10 animate-in fade-in duration-700">
      {/* Nút quay lại */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-predator mb-8 transition-all group font-medium">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Quay lại
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* BÊN TRÁI: KHUNG ẢNH */}
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square flex items-center justify-center p-4 shadow-sm">
            <img src={mainImage} className="w-full h-full object-contain mix-blend-multiply transition-all duration-500" alt={product.name}
              onError={(e) => { e.target.src = "https://placehold.co/600x600/eeeeee/00ccff?text=PREDATOR"; }} />
          </div>
          {productImages.length > 1 && (
            <div className="grid grid-cols-5 gap-4">
              {productImages.map((imgUrl, index) => (
                <button key={index} onClick={() => setMainImage(imgUrl)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 flex items-center justify-center p-1 transition-all ${mainImage === imgUrl ? "border-predator shadow-md scale-105" : "border-gray-200 hover:border-predator"}`}>
                  <img src={imgUrl} alt="thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BÊN PHẢI: THÔNG TIN */}
        <div className="flex flex-col">
          <span className="text-predator font-bold tracking-[0.3em] uppercase text-xs mb-2">{product.brand || "PREDATOR EXCLUSIVE"}</span>
          <h1 className="text-4xl md:text-5xl font-black italic mt-2 mb-6 leading-tight text-gray-900 uppercase tracking-tighter">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-black text-gray-900 italic">{product.basePrice?.toLocaleString()} đ</span>
            {product.isCustomizable && <span className="bg-green-50 text-green-600 text-[10px] px-3 py-1 rounded-full border border-green-200 uppercase font-bold tracking-widest">Premium Quality</span>}
          </div>
          <p className="text-gray-600 leading-relaxed mb-8 text-lg font-light italic">"{product.description || "Dòng sản phẩm thể thao cao cấp 2026."}"</p>

          {/* CHỌN SIZE */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold uppercase text-gray-700">Kích thước: <span className="font-normal normal-case ml-1 text-gray-500">{selectedSize ? `Đã chọn ${selectedSize}` : "Vui lòng chọn"}</span></h4>
              {currentSizeGuide && (
                <button onClick={() => setShowSizeModal(true)} className="text-predator text-sm font-medium hover:underline flex items-center gap-1 transition-all">
                  📏 {sizeData[product.category] ? "Hướng dẫn chọn size" : "Thông tin kích thước"}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              {product.variants?.map((v) => (
                <button key={v.size} disabled={v.stock === 0} onClick={() => handleSizeSelect(v.size)}
                  className={`min-w-[70px] h-[55px] rounded-xl border-2 font-black transition-all duration-300 relative ${selectedSize === v.size ? "border-predator bg-predator text-black shadow-md scale-110" : "border-gray-200 bg-white text-gray-600 hover:border-predator hover:text-predator"} ${v.stock === 0 ? "opacity-40 cursor-not-allowed bg-gray-100" : ""}`}>
                  {v.size}
                  {v.stock > 0 && v.stock < 5 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-md animate-bounce">Sắp hết</span>}
                </button>
              ))}
            </div>
          </div>

          {/* SỐ LƯỢNG */}
          <div className="mb-10">
            <h4 className="text-sm font-bold uppercase mb-4 text-gray-700">Số lượng:</h4>
            <div className="flex items-center gap-6">
              <div className="flex items-center border-2 border-gray-200 rounded-2xl bg-white h-[60px] overflow-hidden">
                <button onClick={() => updateQty("minus")} className="w-14 h-full flex items-center justify-center hover:bg-gray-50 border-r border-gray-200"><Minus size={18} strokeWidth={3} /></button>
                <span className="w-16 text-center text-xl font-black text-gray-900">{qty}</span>
                <button onClick={() => updateQty("plus")} className="w-14 h-full flex items-center justify-center hover:bg-gray-50 border-l border-gray-200"><Plus size={18} strokeWidth={3} /></button>
              </div>
              {selectedSize && <div className="text-gray-500 text-sm"><p className="font-bold">Kho: <span className="text-gray-900">{maxStock}</span></p></div>}
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button onClick={handleAddToCart} disabled={!selectedSize || maxStock === 0}
            className={`w-full font-black py-5 rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 uppercase tracking-widest ${selectedSize && maxStock > 0 ? "bg-predator text-black hover:brightness-105 shadow-md active:scale-[0.98]" : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"}`}>
            <ShoppingBag size={22} strokeWidth={2.5} />
            {maxStock === 0 && selectedSize ? "HẾT HÀNG" : "THÊM VÀO GIỎ HÀNG"}
          </button>
        </div>
      </div>

      {/* SẢN PHẨM GỢI Ý */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 pt-16 border-t border-gray-200">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 mb-8">Có thể bạn sẽ thích</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => <ProductCard key={item._id} product={item} />)}
          </div>
        </div>
      )}

      {/* MODAL BẢNG SIZE */}
      {showSizeModal && currentSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-50">
              <h3 className="font-black italic text-xl uppercase tracking-wider text-gray-900">{currentSizeGuide.title}</h3>
              <button onClick={() => setShowSizeModal(false)} className="text-gray-400 hover:text-red-500 bg-white p-2 rounded-full border border-gray-200"><X size={20} strokeWidth={3} /></button>
            </div>
            <div className="p-6 overflow-x-auto bg-white">
              <table className="w-full text-sm text-center">
                <thead className="text-xs text-black uppercase bg-gray-100">
                  <tr>{currentSizeGuide.headers.map((h, i) => <th key={i} className="px-4 py-4 font-black">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {currentSizeGuide.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      {row.map((cell, ci) => <td key={ci} className={`px-4 py-3 ${ci === 0 ? "font-bold text-predator text-base" : "font-medium"}`}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setShowSizeModal(false)} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-predator hover:text-black transition-all">Đã hiểu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;