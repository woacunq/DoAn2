import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động đính kèm Token vào Header nếu có (Dùng cho các API Admin/User)
axiosClient.interceptors.request.use((config) => {
  // Đồng bộ hoàn toàn với AuthContext: Lấy trực tiếp "predator_token"
  const token = localStorage.getItem("predator_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
