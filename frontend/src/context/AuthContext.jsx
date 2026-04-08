import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Kiểm tra token khi khởi chạy ứng dụng (Khi bấm F5)
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("predator_token");
      if (token) {
        try {
          // Đảm bảo route này tồn tại ở Backend
          const { data } = await axiosClient.get("/users/profile");

          // Lấy dữ liệu linh hoạt (Hỗ trợ nhiều cấu trúc Backend khác nhau)
          const userInfo = data.user || data.data || data;
          setUser(userInfo);
        } catch (error) {
          console.error(
            "Lỗi khi tải Profile lúc F5:",
            error.response?.data || error,
          );
          localStorage.removeItem("predator_token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  // 2. Hàm đăng nhập
  const login = async (email, password) => {
    try {
      const { data } = await axiosClient.post("/users/login", {
        email,
        password,
      });

      console.log("👉 Dữ liệu Backend trả về khi Login:", data);

      // SỬA LỖI TẠI ĐÂY: Bắt đúng object user thay vì bị undefined
      const userInfo = data.user || data;
      const token = data.token || data.accessToken;

      setUser(userInfo);
      localStorage.setItem("predator_token", token);

      return { success: true };
    } catch (error) {
      console.error("❌ Lỗi API Login:", error.response?.data || error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại.",
      };
    }
  };

  // 3. Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("predator_token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth phải được bọc trong AuthProvider (Kiểm tra lại file App.jsx)",
    );
  }
  return context;
};
