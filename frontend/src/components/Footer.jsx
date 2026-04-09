import { Globe, Camera, Music, Trophy } from "lucide-react"; // Đã đổi sang các icon cơ bản
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-12 mt-auto bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* CỘT 1: THÔNG TIN CỬA HÀNG */}
        <div className="space-y-4 text-center md:text-left">
          <Link
            to="/"
            className="flex justify-center md:justify-start items-center gap-2"
          >
            <Trophy size={20} className="text-predator" />
            <h3 className="text-xl font-black italic tracking-tighter text-gray-900">
              PREDATOR<span className="text-predator">STORE</span>
            </h3>
          </Link>
          <p className="text-gray-500 text-sm">
            Chuyên cung cấp trang phục thi đấu và dụng cụ thể thao cao cấp 2026.
          </p>
        </div>

        {/* CỘT 2: KẾT NỐI MẠNG XÃ HỘI */}
        <div className="text-center">
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-6">
            Kết nối với chúng mình
          </p>
          <div className="flex justify-center gap-8 text-gray-400">
            {/* FACEBOOK */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-all duration-300 hover:scale-125 flex flex-col items-center gap-1"
            >
              <Globe size={24} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                Facebook
              </span>
            </a>

            {/* INSTAGRAM */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-all duration-300 hover:scale-125 flex flex-col items-center gap-1"
            >
              <Camera size={24} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                Instagram
              </span>
            </a>

            {/* TIKTOK */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-all duration-300 hover:scale-125 flex flex-col items-center gap-1"
            >
              <Music size={24} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                TikTok
              </span>
            </a>
          </div>
        </div>

        {/* CỘT 3: BẢN QUYỀN */}
        <div className="text-center md:text-right text-gray-400 text-[10px] self-center font-medium uppercase tracking-widest">
          <p>© 2026 PREDATOR STORE</p>
          <p className="mt-2 text-gray-300">
            Proudly developed by{" "}
            <span className="text-gray-500">IT Student</span> - Đồ án 2
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
