import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Key, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import axiosClient from "../api/axiosClient";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Nhập email, Step 2: Nhập OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Gửi yêu cầu lấy OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await axiosClient.post("/users/forgot-password", {
        email,
      });
      setSuccessMsg(data.message);
      setStep(2); // Chuyển sang bước 2
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  // Xác nhận OTP và đổi mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await axiosClient.post("/users/reset-password", {
        email,
        otp,
        newPassword,
      });
      alert("🎉 " + data.message);
      navigate("/login"); // Về trang đăng nhập
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <Link
          to="/login"
          className="flex items-center gap-2 text-gray-500 hover:text-predator transition-all font-medium mb-6 w-fit"
        >
          <ArrowLeft size={18} /> Quay lại
        </Link>

        <h2 className="text-3xl font-black uppercase italic mb-2 text-gray-900 border-l-4 border-predator pl-4">
          Khôi phục mật khẩu
        </h2>
        <p className="text-gray-500 mb-8 text-sm">
          {step === 1
            ? "Nhập email của bạn để nhận mã xác nhận OTP."
            : "Vui lòng kiểm tra hộp thư Gmail của bạn."}
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 border border-red-100 font-bold">
            {error}
          </div>
        )}
        {successMsg && step === 2 && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm mb-6 border border-green-100 font-bold">
            {successMsg}
          </div>
        )}

        {step === 1 ? (
          // FORM 1: NHẬP EMAIL
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="email"
                required
                placeholder="Nhập địa chỉ Email"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-predator transition-all font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-black uppercase tracking-widest text-black bg-predator hover:brightness-105 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Gửi Mã OTP"
              )}
            </button>
          </form>
        ) : (
          // FORM 2: NHẬP OTP & MẬT KHẨU MỚI
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="relative">
              <ShieldCheck
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="text"
                required
                placeholder="Nhập mã OTP (6 số)"
                maxLength="6"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-predator transition-all font-black tracking-[0.5em] text-center text-lg"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="relative">
              <Key
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu mới"
                minLength="6"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-predator transition-all font-medium"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Xác nhận Đổi Mật Khẩu"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
