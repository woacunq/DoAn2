import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Components & Pages Khách hàng
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import OrderListAdmin from "./pages/admin/OrderListAdmin";
import ProductListAdmin from "./pages/admin/ProductListAdmin";
import ProductFormAdmin from "./pages/admin/ProductFormAdmin";
import UserListAdmin from "./pages/admin/UserListAdmin";
import SizeGuide from "./pages/SizeGuide";
import PaymentResult from "./pages/PaymentResult";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* VÙNG 1: GIAO DIỆN KHÁCH HÀNG */}
            <Route
              element={
                <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-predator selection:text-black font-sans flex flex-col">
                  <Header />
                  <main className="container mx-auto px-4 flex-grow py-8">
                    <Outlet /> {/* Các trang con sẽ được render vào đây */}
                  </main>
                  <Footer />
                </div>
              }
            >
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/size-guide" element={<SizeGuide />} />
              <Route path="/payment-result" element={<PaymentResult />} />

              {/* Trang 404 cho giao diện khách */}
              <Route
                path="*"
                element={
                  <div className="text-center py-20 uppercase font-black italic text-gray-500">
                    404 - Trang bạn tìm kiếm không tồn tại
                  </div>
                }
              />
            </Route>

            {/* VÙNG 2: GIAO DIỆN QUẢN TRỊ VIÊN (Admin Dashboard) */}

            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                {/* Trang chủ Admin Dashboard */}
                <Route path="orders" element={<OrderListAdmin />} />
                <Route path="products" element={<ProductListAdmin />} />
                <Route path="users" element={<UserListAdmin />} />
                <Route path="products/new" element={<ProductFormAdmin />} />
                <Route
                  path="products/edit/:id"
                  element={<ProductFormAdmin />}
                />
                <Route
                  index
                  element={
                    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm animate-in fade-in duration-500">
                      <h1 className="text-2xl font-black uppercase italic text-gray-900">
                        Chào mừng trở lại!
                      </h1>
                      <p className="mt-4 text-gray-500 font-medium">
                        Hãy chọn các chức năng bên menu trái để bắt đầu quản lý
                        hệ thống PREDATOR STORE.
                      </p>
                    </div>
                  }
                />

                {/* <Route path="orders" element={<OrderListAdmin />} /> */}
                {/* <Route path="products" element={<ProductListAdmin />} /> */}
                {/* <Route path="users" element={<UserListAdmin />} /> */}
              </Route>
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
