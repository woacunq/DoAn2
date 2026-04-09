import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, Trophy } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 animate-in fade-in duration-700">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-gray-200 shadow-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-predator rounded-2xl mb-4 shadow-lg">
            <Trophy size={32} className="text-black" />
          </div>
          <h2 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter">
            Đăng nhập <span className="text-predator">Predator</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-widest">
            Sẵn sàng ra sân
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 border border-red-100 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="email"
              required
              placeholder="Email của bạn"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-predator transition-all text-gray-900 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="password"
              required
              placeholder="Mật khẩu"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-predator transition-all text-gray-900 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* NÚT QUÊN MẬT KHẨU ĐƯỢC THÊM VÀO ĐÂY */}
          <div className="flex justify-end !mt-3">
            <Link
              to="/forgot-password"
              className="text-sm font-bold text-gray-500 hover:text-predator transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-predator text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:brightness-105 shadow-md active:scale-[0.98] transition-all uppercase tracking-[0.2em]"
          >
            Vào sân ngay <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-medium">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-predator font-bold hover:underline"
            >
              Đăng ký thành viên
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
