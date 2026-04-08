import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Khởi tạo giỏ hàng từ localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("predator_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Đồng bộ với localStorage
  useEffect(() => {
    localStorage.setItem("predator_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Hàm thêm vào giỏ hàng (Đã có)
  const addToCart = (product, size, qty) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find(
        (x) => x._id === product._id && x.size === size,
      );
      if (existItem) {
        return prevItems.map((x) =>
          x._id === product._id && x.size === size
            ? { ...existItem, qty: existItem.qty + qty }
            : x,
        );
      }
      return [
        ...prevItems,
        {
          _id: product._id,
          name: product.name,
          image: product.image,
          price: product.basePrice,
          size,
          qty,
        },
      ];
    });
    alert("Đã thêm áo đấu vào giỏ hàng thành công!");
  };

  // 2. HÀM CẬP NHẬT SỐ LƯỢNG (QUAN TRỌNG - BẠN ĐANG THIẾU CÁI NÀY)
  const updateQty = (id, size, newQty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id && item.size === size
          ? { ...item, qty: Math.max(1, newQty) } // Chặn không cho số lượng nhỏ hơn 1
          : item,
      ),
    );
  };

  // 3. Hàm xóa sản phẩm
  const removeFromCart = (id, size) => {
    setCartItems(cartItems.filter((x) => !(x._id === id && x.size === size)));
  };
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("predator_cart");
  };
  return (
    // PHẢI THÊM updateQty VÀO VALUE Ở ĐÂY THÌ TRANG CART MỚI DÙNG ĐƯỢC
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải được dùng trong CartProvider");
  return context;
};
