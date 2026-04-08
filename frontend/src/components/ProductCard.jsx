import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden group hover:border-predator transition-all duration-300 shadow-sm hover:shadow-2xl">
      {/* ẢNH SẢN PHẨM */}
      {/* Đổi nền vùng chứa ảnh thành màu xám nhạt (bg-gray-50) để làm nổi bật sản phẩm */}
      <Link to={`/product/${product._id}`} className="block h-64 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
          onError={(e) => { e.target.src = 'https://placehold.co/600x400/eeeeee/00ccff?text=PREDATOR'; }}
        />
      </Link>

      {/* THÔNG TIN SẢN PHẨM */}
      <div className="p-5">
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1 font-semibold">
          {product.category || "Thể thao"}
        </p>
        
        <Link to={`/product/${product._id}`}>
          {/* Đổi màu chữ tên sản phẩm thành text-gray-900 (Đen/Xám đậm) */}
          <h3 className="text-lg font-black text-gray-900 truncate group-hover:text-predator transition-colors italic uppercase">
            {product.name}
          </h3>
        </Link>

        <div className="mt-4 flex items-center justify-between">
          {/* Đổi màu giá tiền thành đen đậm */}
          <p className="text-xl font-black text-gray-900 italic">
            {product.basePrice?.toLocaleString()} <span className="text-xs text-gray-500 font-normal">đ</span>
          </p>
          
          <Link 
            to={`/product/${product._id}`}
            className="bg-predator text-black text-[10px] font-black px-4 py-2 rounded-lg hover:brightness-110 transition-all shadow-md active:scale-95"
          >
            MUA NGAY
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;