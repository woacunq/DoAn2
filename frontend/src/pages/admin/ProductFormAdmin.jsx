import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { Save, ArrowLeft, Image as ImageIcon, Plus, Trash2 } from "lucide-react";

const ProductFormAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 1. Cập nhật State: Đổi 'image' thành mảng 'images'
  const [formData, setFormData] = useState({
    name: "",
    brand: "PREDATOR",
    basePrice: 0,
    description: "",
    images: [""], // Bắt đầu với 1 ô nhập ảnh trống
    variants: [{ size: "", stock: 0 }],
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const { data } = await axiosClient.get(`/products/${id}`);
          const p = data.data || data;
          
          // Xử lý logic gộp ảnh cũ vào mảng mới cho đúng cấu trúc
          let fetchedImages = [""];
          if (p.images && p.images.length > 0) {
            fetchedImages = p.images;
          } else if (p.image) {
            fetchedImages = [p.image]; // Fallback nếu database cũ chỉ có 1 ảnh
          }

          setFormData({
            name: p.name || "",
            brand: p.brand || "PREDATOR",
            basePrice: p.basePrice || 0,
            description: p.description || "",
            images: fetchedImages,
            variants: p.variants?.length > 0 ? p.variants : [{ size: "", stock: 0 }],
          });
        } catch (err) {
          setError("Không thể lấy thông tin sản phẩm");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ==========================================
  // XỬ LÝ NHIỀU HÌNH ẢNH (IMAGES ARRAY)
  // ==========================================
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  // ==========================================
  // XỬ LÝ BIẾN THỂ (SIZE/STOCK)
  // ==========================================
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = field === "stock" ? Number(value) : value;
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: "", stock: 0 }],
    });
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Làm sạch mảng hình ảnh (Xóa các ô trống trước khi gửi lên server)
      const cleanedImages = formData.images.filter(img => img.trim() !== "");
      
      // Copy data để chuẩn bị gửi đi, gán image chính là ảnh đầu tiên trong mảng
      const dataToSubmit = {
        ...formData,
        images: cleanedImages,
        image: cleanedImages.length > 0 ? cleanedImages[0] : "", // Giữ lại trường image chính để không lỗi code cũ
      };

      if (isEditMode) {
        await axiosClient.put(`/products/${id}`, dataToSubmit);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await axiosClient.post("/products", dataToSubmit);
        alert("Thêm sản phẩm mới thành công!");
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi lưu sản phẩm");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 animate-pulse">Đang tải dữ liệu sản phẩm...</div>;

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl pb-20">
      <Link to="/admin/products" className="flex items-center gap-2 text-gray-500 hover:text-predator mb-6 font-medium w-fit">
        <ArrowLeft size={20} /> Quay lại danh sách
      </Link>

      <h1 className="text-2xl font-black uppercase italic border-l-4 border-predator pl-4 mb-8 text-gray-900">
        {isEditMode ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}
      </h1>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 font-bold">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ================================================= */}
          {/* CỘT TRÁI: THÔNG TIN CƠ BẢN */}
          {/* ================================================= */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black uppercase text-gray-700 mb-2">Tên sản phẩm *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-predator transition-all font-bold text-gray-900" placeholder="VD: Giày Adidas Predator 2024" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black uppercase text-gray-700 mb-2">Thương hiệu</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-predator transition-all font-bold text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-black uppercase text-gray-700 mb-2">Giá bán (VND) *</label>
                <input type="number" name="basePrice" required min="0" value={formData.basePrice} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-predator transition-all font-black text-predator" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black uppercase text-gray-700 mb-2">Mô tả sản phẩm</label>
              <textarea name="description" rows="5" value={formData.description} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-predator transition-all resize-none text-gray-600" placeholder="Nhập mô tả chi tiết..." />
            </div>
          </div>

          {/* ================================================= */}
          {/* CỘT PHẢI: HÌNH ẢNH & BIẾN THỂ (SIZE/STOCK) */}
          {/* ================================================= */}
          <div className="space-y-6">
            
            {/* KHU VỰC NHẬP HÌNH ẢNH */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-black uppercase text-gray-700">Hình Ảnh Sản Phẩm</label>
                <button type="button" onClick={addImageField} className="text-predator hover:text-black font-bold flex items-center gap-1 text-sm bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm transition-all">
                  <Plus size={16}/> Thêm Ảnh
                </button>
              </div>

              {/* Danh sách ô nhập Link Ảnh */}
              <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {formData.images.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={`Link hình ảnh ${index + 1}`} 
                      value={img} 
                      onChange={(e) => handleImageChange(index, e.target.value)} 
                      className="flex-1 bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:border-predator text-sm" 
                      required={index === 0} // Ảnh đầu tiên là bắt buộc
                    />
                    <button type="button" onClick={() => removeImageField(index)} disabled={formData.images.length === 1} className="w-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Box Preview Ảnh (Hiển thị tất cả ảnh đang có) */}
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {formData.images.filter(img => img.trim() !== "").length > 0 ? (
                  formData.images.map((img, idx) => (
                    img.trim() !== "" && (
                      <div key={idx} className="w-20 h-20 shrink-0 bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden p-1">
                        <img src={img} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" onError={(e) => e.target.src = 'https://placehold.co/100x100?text=Lỗi'} />
                      </div>
                    )
                  ))
                ) : (
                  <div className="w-full h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 text-xs">
                    <ImageIcon size={24} className="mb-1" />
                    Chưa có ảnh
                  </div>
                )}
              </div>
            </div>

            {/* KHU VỰC QUẢN LÝ BIẾN THỂ (SIZE) */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-black uppercase text-gray-700">Phân loại Size & Tồn kho</label>
                <button type="button" onClick={addVariant} className="text-predator hover:text-black font-bold flex items-center gap-1 text-sm bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm transition-all">
                  <Plus size={16}/> Thêm Size
                </button>
              </div>
              
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="flex gap-3 items-center bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                    <input type="text" placeholder="Size (VD: M, 42)" value={variant.size} onChange={(e) => handleVariantChange(index, "size", e.target.value)} className="w-1/2 bg-gray-50 border border-gray-100 rounded-lg py-2 px-3 focus:outline-none focus:border-predator text-sm font-bold uppercase" required />
                    <input type="number" placeholder="Tồn kho" min="0" value={variant.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} className="w-1/3 bg-gray-50 border border-gray-100 rounded-lg py-2 px-3 focus:outline-none focus:border-predator text-sm" required />
                    <button type="button" onClick={() => removeVariant(index)} disabled={formData.variants.length === 1} className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* NÚT LƯU */}
        <button type="submit" disabled={submitting} className="w-full bg-predator text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:brightness-105 shadow-md active:scale-[0.98] transition-all uppercase tracking-widest disabled:opacity-50 text-lg">
          <Save size={24} /> {submitting ? "Đang lưu dữ liệu..." : (isEditMode ? "Lưu thay đổi" : "Tạo sản phẩm mới")}
        </button>
      </form>
    </div>
  );
};

export default ProductFormAdmin;