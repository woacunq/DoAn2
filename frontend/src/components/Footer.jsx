const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-12 mt-auto bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-4 text-center md:text-left">
          <h3 className="text-xl font-black italic tracking-tighter">
            PREDATOR<span className="text-predator">STORE</span>
          </h3>
          <p className="text-gray-500 text-sm">
            Chuyên cung cấp trang phục thi đấu và dụng cụ thể thao cao cấp 2026.
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-4">
            Kết nối với chúng mình
          </p>
          <div className="flex justify-center gap-6 text-gray-600">
            <span className="hover:text-predator cursor-pointer transition-colors">
              Facebook
            </span>
            <span className="hover:text-predator cursor-pointer transition-colors">
              Instagram
            </span>
            <span className="hover:text-predator cursor-pointer transition-colors">
              TikTok
            </span>
          </div>
        </div>

        <div className="text-center md:text-right text-gray-500 text-xs self-center">
          <p>© 2026 PREDATOR STORE</p>
          <p className="mt-1">Proudly developed by IT Student - Đồ án 2</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
