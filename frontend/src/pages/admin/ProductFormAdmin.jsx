import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Tag,
  DollarSign,
  FileText,
  Plus,
  Trash2,
  UploadCloud,
  Loader2,
  ListOrdered,
} from "lucide-react";

const ProductFormAdmin = () => {
  const navigate = useNavigate();
  // 1. LẤY ID TỪ URL (Nếu có id -> Chế độ Edit, nếu không -> Chế độ Add)
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialFetching, setInitialFetching] = useState(isEditMode);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Giày Bóng Đá",
    brand: "Adidas",
    description: "",
  });

  const [images, setImages] = useState([""]);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [variants, setVariants] = useState([{ size: "", stock: "" }]);

  // ========================================================
  // 2. EFFECT: TẢI DỮ LIỆU CŨ NẾU LÀ CHẾ ĐỘ "CHỈNH SỬA"
  // ========================================================
  useEffect(() => {
    if (isEditMode) {
      const fetchProductData = async () => {
        try {
          const { data } = await axiosClient.get(`/products/${id}`);
          const p = data.data || data;

          // Dịch Category từ Tiếng Anh (MongoDB) sang Tiếng Việt (UI)
          let uiCategory = "Phụ Kiện";
          if (p.category === "Shoes") uiCategory = "Giày Bóng Đá";
          if (p.category === "Shirt") uiCategory = "Áo Đấu";

          setFormData({
            name: p.name,
            price: p.basePrice || "",
            category: uiCategory,
            brand: p.brand,
            description: p.description || "",
          });

          // Gộp ảnh chính và mảng ảnh phụ (Lọc trùng lặp nếu có)
          const combinedImages = Array.from(
            new Set([p.image, ...(p.images || [])]),
          );
          setImages(combinedImages.length > 0 ? combinedImages : [""]);

          if (p.variants && p.variants.length > 0) {
            setVariants(
              p.variants.map((v) => ({ size: v.size, stock: v.stock })),
            );
          }
        } catch (err) {
          setError("Không thể tải thông tin sản phẩm để chỉnh sửa.");
        } finally {
          setInitialFetching(false);
        }
      };
      fetchProductData();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* --- LOGIC QUẢN LÝ ẢNH --- */
  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };
  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (index) =>
    setImages(images.filter((_, i) => i !== index));

  const uploadFileHandler = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploadingIndex(index);
      const { data } = await axiosClient.post("/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = data.url || data.imageUrl || data;
      handleImageChange(index, imageUrl);
    } catch (err) {
      alert("Tải ảnh lên thất bại. Vui lòng thử lại!");
    } finally {
      setUploadingIndex(null);
    }
  };

  /* --- LOGIC QUẢN LÝ SIZE --- */
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };
  const addVariantField = () =>
    setVariants([...variants, { size: "", stock: "" }]);
  const removeVariantField = (index) =>
    setVariants(variants.filter((_, i) => i !== index));

  /* --- XỬ LÝ SUBMIT (DÙNG CHUNG CHO THÊM & SỬA) --- */
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const validImages = images.filter((url) => url.trim() !== "");
      if (validImages.length === 0) {
        setError("Vui lòng thêm ít nhất 1 hình ảnh cho sản phẩm.");
        setLoading(false);
        return;
      }

      const hasEmptyVariant = variants.some(
        (v) => v.size.trim() === "" || v.stock === "",
      );
      if (hasEmptyVariant) {
        setError("Vui lòng điền đầy đủ Tên Size và Số lượng tồn kho.");
        setLoading(false);
        return;
      }

      let mappedCategory = "Accessories";
      if (formData.category === "Giày Bóng Đá") mappedCategory = "Shoes";
      if (formData.category === "Áo Đấu") mappedCategory = "Shirt";

      const payload = {
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        category: mappedCategory,
        basePrice: Number(formData.price),
        image: validImages[0],
        images: validImages,
        variants: variants.map((v) => ({
          size: v.size.toUpperCase(),
          stock: Number(v.stock),
        })),
      };

      // 3. XÁC ĐỊNH PHƯƠNG THỨC GỌI API (POST hay PUT)
      if (isEditMode) {
        await axiosClient.put(`/products/${id}`, payload);
        alert("🎉 Cập nhật sản phẩm thành công!");
      } else {
        await axiosClient.post("/products", payload);
        alert("🎉 Thêm sản phẩm mới thành công!");
      }

      navigate("/admin/products");
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra khi lưu sản phẩm.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  // Nếu đang tải dữ liệu cũ thì hiện Loading
  if (initialFetching) {
    return (
      <div className="text-center p-20 font-bold text-gray-500 animate-pulse">
        Đang tải thông tin sản phẩm...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/admin/products"
            className="flex items-center gap-2 text-gray-500 hover:text-predator transition-all font-medium w-fit mb-2"
          >
            <ArrowLeft size={20} /> Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-black italic uppercase border-l-4 border-predator pl-4 text-gray-900">
            {isEditMode ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm Mới"}
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 border border-red-100 font-bold">
          {error}
        </div>
      )}

      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                Tên sản phẩm
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="VD: Giày đá bóng Predator..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-predator transition-all font-medium"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                Giá bán (VNĐ)
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="number"
                  name="price"
                  min="0"
                  required
                  placeholder="VD: 1500000"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-predator transition-all font-medium"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                  Danh mục
                </label>
                <select
                  name="category"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:border-predator transition-all font-medium cursor-pointer"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Giày Bóng Đá">Giày Bóng Đá</option>
                  <option value="Áo Đấu">Áo Đấu</option>
                  <option value="Găng Tay Thủ Môn">Găng Tay Thủ Môn</option>
                  <option value="Phụ Kiện">Phụ Kiện</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                  Thương hiệu
                </label>
                <select
                  name="brand"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:border-predator transition-all font-medium cursor-pointer"
                  value={formData.brand}
                  onChange={handleChange}
                >
                  <option value="Adidas">Adidas</option>
                  <option value="Nike">Nike</option>
                  <option value="Puma">Puma</option>
                  <option value="Mizuno">Mizuno</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-bold text-gray-700 uppercase">
                  Phân loại Size & Tồn kho
                </label>
                <button
                  type="button"
                  onClick={addVariantField}
                  className="text-predator hover:brightness-90 text-sm font-bold flex items-center gap-1 transition-all"
                >
                  <Plus size={16} strokeWidth={3} /> Thêm Size
                </button>
              </div>

              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100"
                  >
                    <div className="flex-1 relative">
                      <ListOrdered
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Size (S, 40,...)"
                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 focus:outline-none focus:border-predator transition-all font-medium text-sm"
                        value={variant.size}
                        onChange={(e) =>
                          handleVariantChange(index, "size", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        min="0"
                        placeholder="Số lượng"
                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-predator transition-all font-medium text-sm"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(index, "stock", e.target.value)
                        }
                        required
                      />
                    </div>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariantField(index)}
                        className="p-2.5 text-gray-400 hover:text-red-500 bg-white border border-gray-200 hover:border-red-100 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700 uppercase">
                  Hình ảnh (URL hoặc File)
                </label>
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-predator hover:brightness-90 text-sm font-bold flex items-center gap-1 transition-all"
                >
                  <Plus size={16} strokeWidth={3} /> Thêm ảnh
                </button>
              </div>

              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {images.map((url, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 p-3 bg-gray-50 border border-gray-100 rounded-2xl"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <ImageIcon
                          className="absolute left-4 top-3.5 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder={`Link ảnh ${index === 0 ? "(Chính)" : "(Phụ)"}`}
                          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-predator transition-all font-medium text-sm"
                          value={url}
                          onChange={(e) =>
                            handleImageChange(index, e.target.value)
                          }
                        />
                      </div>

                      <label className="flex-shrink-0 cursor-pointer bg-gray-900 text-white p-3 rounded-xl hover:bg-predator hover:text-black transition-all flex items-center justify-center">
                        {uploadingIndex === index ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <UploadCloud size={20} />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => uploadFileHandler(e, index)}
                          disabled={uploadingIndex !== null}
                        />
                      </label>

                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="p-3 text-gray-400 hover:text-red-500 bg-white border border-gray-200 hover:border-red-100 rounded-xl transition-all flex-shrink-0"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {images.some((url) => url.trim() !== "") && (
                <div className="mt-4 grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  {images.map(
                    (url, index) =>
                      url.trim() !== "" && (
                        <div
                          key={index}
                          className="relative h-24 bg-white rounded-xl border border-gray-200 p-1 flex items-center justify-center overflow-hidden shadow-sm"
                        >
                          <img
                            src={url}
                            alt="Preview"
                            className="h-full object-contain mix-blend-multiply"
                          />
                          {index === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 bg-predator text-black text-[10px] font-black text-center uppercase tracking-widest py-1">
                              Ảnh chính
                            </span>
                          )}
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                Mô tả sản phẩm
              </label>
              <div className="relative">
                <FileText
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <textarea
                  name="description"
                  rows="5"
                  required
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-predator transition-all font-medium custom-scrollbar resize-none"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-predator text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:brightness-105 shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading
              ? "Đang lưu..."
              : isEditMode
                ? "Cập Nhật Sản Phẩm"
                : "Lưu Sản Phẩm"}{" "}
            <Save size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormAdmin;
