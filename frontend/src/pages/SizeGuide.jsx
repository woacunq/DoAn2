import React from "react";
import { sizeData } from "../utils/sizeData";
import { Ruler, Info } from "lucide-react";

const SizeGuide = () => {
  return (
    <div className="container mx-auto py-16 px-4 animate-in fade-in duration-700">
      {/* Tiêu đề trang */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-16 h-16 bg-predator rounded-2xl flex items-center justify-center shadow-lg shadow-predator/20 mb-6">
          <Ruler size={32} className="text-black" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900">
          Hướng dẫn <span className="text-predator">chọn kích cỡ</span>
        </h1>
        <p className="mt-4 text-gray-500 max-w-2xl font-medium">
          Để lựa chọn sản phẩm vừa vặn nhất, vui lòng đối chiếu thông số cơ thể
          của bạn với bảng size tiêu chuẩn của PREDATOR dưới đây.
        </p>
      </div>

      {/* Danh sách các bảng size */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {Object.keys(sizeData)
          .filter((key) => key !== "Default") // Ẩn bảng Default khỏi trang hướng dẫn chung
          .map((key) => (
            <div
              key={key}
              className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all duration-300"
            >
              <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3 text-gray-800 border-l-4 border-predator pl-4">
                {sizeData[key].title}
              </h3>

              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full text-center">
                  <thead>
                    <tr className="bg-gray-50">
                      {sizeData[key].headers.map((header, idx) => (
                        <th
                          key={idx}
                          className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sizeData[key].rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`py-4 px-4 text-sm ${cellIndex === 0 ? "font-black text-predator" : "font-medium text-gray-600"}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>

      {/* Lưu ý chân trang */}
      <div className="mt-16 p-8 bg-gray-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl">
        <div className="w-12 h-12 shrink-0 bg-predator/20 rounded-full flex items-center justify-center text-predator">
          <Info size={24} />
        </div>
        <div className="text-center md:text-left">
          <h4 className="font-bold uppercase tracking-widest text-predator text-sm mb-1">
            Bạn vẫn còn phân vân?
          </h4>
          <p className="text-gray-400 text-xs leading-relaxed">
            Mỗi dòng sản phẩm có thể có độ co giãn khác nhau. Nếu số đo của bạn
            nằm giữa 2 size, chúng tôi khuyên bạn nên chọn
            <span className="text-white font-bold"> Size lớn hơn </span> nếu
            thích mặc thoải mái, hoặc
            <span className="text-white font-bold"> Size nhỏ hơn </span> nếu
            muốn mặc ôm sát.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
