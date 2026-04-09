import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();

  // STATE: Chứa danh sách các key (id-size) của sản phẩm được tích chọn
  const [selectedItems, setSelectedItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Tự động chọn tất cả sản phẩm khi mới load giỏ hàng lần đầu
  useEffect(() => {
    if (cartItems.length > 0 && !isInitialized) {
      setSelectedItems(cartItems.map((item) => `${item._id}-${item.size}`));
      setIsInitialized(true);
    }
  }, [cartItems, isInitialized]);

  // Xử lý khi tích chọn 1 sản phẩm
  const handleSelectItem = (id, size) => {
    const itemKey = `${id}-${size}`;
    if (selectedItems.includes(itemKey)) {
      setSelectedItems(selectedItems.filter((key) => key !== itemKey)); // Bỏ chọn
    } else {
      setSelectedItems([...selectedItems, itemKey]); // Chọn thêm
    }
  };

  // Xử lý khi tích nút "Chọn tất cả"
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]); // Nếu đang chọn hết thì bỏ chọn hết
    } else {
      setSelectedItems(cartItems.map((item) => `${item._id}-${item.size}`)); // Chọn hết
    }
  };

  // LỌC RA CÁC SẢN PHẨM ĐÃ CHỌN ĐỂ TÍNH TIỀN
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(`${item._id}-${item.size}`)
  );

  const totalPrice = selectedCartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Hàm xác nhận trước khi xóa
  const handleDelete = (id, size, name) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa mẫu ${name} (Size ${size}) khỏi giỏ hàng?`
    );
    if (isConfirmed) {
      removeFromCart(id, size);
      // Xóa luôn khỏi danh sách đang chọn (tránh lỗi ngầm)
      setSelectedItems((prev) => prev.filter((key) => key !== `${id}-${size}`));
    }
  };

  // Xử lý khi bấm nút Thanh toán
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!");
      return;
    }
    // Chuyển hướng và truyền danh sách các món ĐÃ CHỌN sang trang Checkout
    navigate("/checkout", { state: { selectedItems } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-200">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-black uppercase italic mb-2 text-gray-900">
          Giỏ hàng trống
        </h2>
        <p className="text-gray-500 mb-8 font-medium">
          Bạn chưa chọn mẫu trang phục nào.
        </p>
        <Link
          to="/"
          className="bg-predator text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:brightness-105 shadow-md transition-all"
        >
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black italic uppercase mb-10 border-l-4 border-predator pl-4 text-gray-900">
        Giỏ hàng
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* DANH SÁCH SẢN PHẨM */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* NÚT CHỌN TẤT CẢ */}
          <div className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-gray-200 shadow-sm mb-4">
            <input
              type="checkbox"
              className="w-5 h-5 accent-predator cursor-pointer rounded"
              checked={cartItems.length > 0 && selectedItems.length === cartItems.length}
              onChange={handleSelectAll}
            />
            <span className="font-bold text-gray-900 uppercase">
              Chọn tất cả ({cartItems.length} sản phẩm)
            </span>
          </div>

          {cartItems.map((item) => (
            <div
              key={`${item._id}-${item.size}`}
              className="bg-white p-5 rounded-2xl flex items-center gap-4 border border-gray-200 shadow-sm hover:border-predator/50 transition-colors"
            >
              {/* CHECKBOX TỪNG SẢN PHẨM */}
              <input
                type="checkbox"
                className="w-5 h-5 accent-predator cursor-pointer rounded flex-shrink-0"
                checked={selectedItems.includes(`${item._id}-${item.size}`)}
                onChange={() => handleSelectItem(item._id, item.size)}
              />

              <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-2 ml-2">
                <img
                  src={item.image}
                  className="w-full h-full object-contain mix-blend-multiply hover:scale-110 transition-transform"
                  alt={item.name}
                />
              </div>

              <div className="flex-1">
                <Link to={`/product/${item._id}`}>
                  <h3 className="font-bold text-gray-900 uppercase italic hover:text-predator transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-predator text-xs font-bold uppercase mt-1">
                  Size: {item.size}
                </p>
                <p className="text-gray-600 font-bold mt-2">
                  {item.price?.toLocaleString()} đ
                </p>
              </div>

              <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm h-10">
                <button
                  onClick={() => updateQty(item._id, item.size, item.qty - 1)}
                  disabled={item.qty <= 1}
                  className={`px-3 h-full transition-colors ${item.qty <= 1 ? "text-gray-300 bg-gray-50 cursor-not-allowed" : "text-gray-500 hover:text-predator hover:bg-gray-50"}`}
                >
                  <Minus size={16} strokeWidth={3} />
                </button>

                <span className="w-10 text-center font-black text-gray-900">
                  {item.qty}
                </span>

                <button
                  onClick={() => updateQty(item._id, item.size, item.qty + 1)}
                  className="px-3 h-full text-gray-500 hover:text-predator hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>

              <button
                onClick={() => handleDelete(item._id, item.size, item.name)}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Xóa sản phẩm"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* TỔNG TIỀN */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-200 h-fit shadow-sm sticky top-24">
            <h2 className="text-xl font-black uppercase mb-6 italic text-gray-900 border-b border-gray-100 pb-4">
              Tạm tính
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Đã chọn:</span>
                <span className="text-gray-900 font-bold">
                  {selectedItems.length} sản phẩm
                </span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Tạm tính:</span>
                <span className="text-gray-900">
                  {totalPrice.toLocaleString()} đ
                </span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Giao hàng:</span>
                <span className="text-green-600 font-bold text-xs uppercase tracking-widest">
                  Miễn phí
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end text-2xl font-black italic mb-8 pt-6 border-t border-gray-100">
              <span className="text-gray-900 text-lg uppercase">Tổng:</span>
              <span className="text-predator text-3xl">
                {totalPrice.toLocaleString()} <span className="text-sm text-gray-500">đ</span>
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className="w-full bg-predator text-black font-black py-4 rounded-2xl hover:brightness-105 shadow-md active:scale-[0.98] transition-all uppercase italic tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thanh toán ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;