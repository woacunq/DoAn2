import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Mail, Lock, User as UserIcon, ArrowRight, Trophy } from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu khớp nhau
    if (password !== confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp!");
    }

    try {
      setLoading(true);
      // Gọi API đăng ký (Hãy đảm bảo route này khớp với Backend của bạn)
      await axiosClient.post("/users/register", { name, email, password });

      alert("Đăng ký thành viên PREDATOR thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Đăng ký thất bại. Email có thể đã tồn tại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 animate-in fade-in duration-700">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-gray-200 shadow-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-predator rounded-2xl mb-4 shadow-sm">
            <Trophy size={32} className="text-black" />
          </div>
          <h2 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter">
            Gia nhập <span className="text-predator">Predator</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-widest">
            Tạo tài khoản thành viên
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 border border-red-100 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <UserIcon
              className="absolute left-4 top-4 text-gray-400"
              size={20}
            />
            <input
              type="text"
              required
              placeholder="Họ và tên"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-predator transition-all text-gray-900 font-medium"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              minLength="6"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-predator transition-all text-gray-900 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="password"
              required
              placeholder="Xác nhận mật khẩu"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-predator transition-all text-gray-900 font-medium"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-predator text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:brightness-105 shadow-md active:scale-[0.98] transition-all uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Đăng ký ngay"}{" "}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-medium">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-predator font-bold hover:underline"
            >
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
