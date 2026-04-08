import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import {
  ShoppingBag,
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProductListAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/products");
      setProducts(data.data || data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể lấy danh sách sản phẩm",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Hàm Xóa sản phẩm (Xóa mềm - Soft Delete)
  const deleteHandler = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn ngừng bán (ẩn) sản phẩm này? Nó sẽ không bị xóa vĩnh viễn để bảo vệ dữ liệu đơn hàng cũ.",
      )
    ) {
      try {
        // Mở khóa gọi API xóa xuống Backend
        await axiosClient.delete(`/products/${id}`);

        // 🚨 TỐI ƯU UI: Lọc sản phẩm ra khỏi danh sách hiện tại để biến mất ngay lập tức
        setProducts(products.filter((p) => p._id !== id));

        alert("Đã ẩn sản phẩm thành công!");
      } catch (err) {
        alert(
          "Lỗi: " + (err.response?.data?.message || "Không thể ẩn sản phẩm."),
        );
      }
    }
  };

  if (loading)
    return (
      <div className="animate-pulse p-10">Đang tải danh mục sản phẩm...</div>
    );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-black uppercase italic border-l-4 border-predator pl-4">
          Quản lý Sản phẩm
        </h1>

        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
            <ShoppingBag className="text-gray-400" size={20} />
            <span className="font-bold">{products.length} Mẫu</span>
          </div>

          {/* 🚨 ĐÃ SỬA: Đổi button thành thẻ Link để chuyển sang trang Thêm mới */}
          <Link
            to="/admin/products/new"
            className="bg-predator text-black px-6 py-2 rounded-xl font-black uppercase flex items-center gap-2 hover:brightness-105 transition-all shadow-md"
          >
            <Plus size={20} /> Thêm mới
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500 w-24">
                  Hình ảnh
                </th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">
                  Tên Sản Phẩm
                </th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">
                  Thương hiệu
                </th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">
                  Giá (VND)
                </th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500">
                  Tồn kho
                </th>
                <th className="p-5 text-xs font-black uppercase tracking-wider text-gray-500 text-right">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="p-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center p-1">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <ImageIcon className="text-gray-300" size={24} />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/product/${product._id}`}
                      className="font-bold text-sm text-gray-900 hover:text-predator transition-colors uppercase line-clamp-2"
                      target="_blank"
                    >
                      {product.name}
                    </Link>
                    <span className="text-xs text-gray-400 mt-1 block">
                      ID: {product._id.substring(18, 24)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {product.brand || "PREDATOR"}
                    </span>
                  </td>
                  <td className="p-4 font-black text-gray-900">
                    {product.basePrice
                      ? product.basePrice.toLocaleString()
                      : "0"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`font-bold ${
                        product.stock > 0 ||
                        (product.variants &&
                          product.variants.some((v) => v.stock > 0))
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {product.variants
                        ? product.variants.reduce((acc, v) => acc + v.stock, 0)
                        : product.stock || 0}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-100 transition-all shadow-sm inline-flex"
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => deleteHandler(product._id)}
                      className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-100 transition-all shadow-sm"
                      title="Xóa sản phẩm"
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

export default ProductListAdmin;
