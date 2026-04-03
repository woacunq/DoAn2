const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// 1. Cấu hình biến môi trường
dotenv.config();

/**
 * @description Dữ liệu mẫu đa dạng danh mục cho PREDATOR_STORE
 */
const products = [
    {
        name: "Áo Real Madrid Home 2026",
        category: "Shirt",
        brand: "Adidas",
        basePrice: 850000,
        image: "real_home.jpg",
        isCustomizable: true, // Hỗ trợ in tên/số
        customPrice: 50000,
        variants: [
            { size: "S", stock: 10 },
            { size: "M", stock: 20 },
            { size: "L", stock: 15 }
        ],
        description: "Mẫu áo thi đấu sân nhà đẳng cấp của Hoàng gia Tây Ban Nha."
    },
    {
        name: "Giày Adidas Predator Accuracy.3 TF",
        category: "Shoes",
        brand: "Adidas",
        basePrice: 2100000,
        image: "predator_accuracy.jpg",
        variants: [
            { size: "40", type: "TF", stock: 8 },
            { size: "41", type: "TF", stock: 12 },
            { size: "42", type: "TF", stock: 5 }
        ],
        description: "Kiểm soát bóng tuyệt đối trên mặt sân cỏ nhân tạo."
    },
    {
        name: "Găng tay thủ môn Predator Pro",
        category: "Accessories",
        brand: "Adidas",
        basePrice: 1250000,
        image: "gloves_pro.jpg",
        variants: [
            { size: "8", stock: 5 },
            { size: "9", stock: 7 }
        ],
        description: "Độ bám dính cực cao cho các pha cứu thua xuất thần."
    }
];

/**
 * @description Hàm thực thi bơm dữ liệu (Seed Data)
 */
const seedData = async () => {
    try {
        // Kiểm tra kết nối DB trước khi thao tác
        console.log('⏳ Đang kết nối tới MongoDB: ', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🚀 Kết nối thành công để nạp dữ liệu!');

        // Xóa sạch dữ liệu cũ để làm mới database
        await Product.deleteMany();
        console.log('🗑️  Đã xóa sạch dữ liệu cũ trong Collection Products.');

        // Nạp mảng dữ liệu mới
        const createdProducts = await Product.insertMany(products);
        
        console.log(`✅ THÀNH CÔNG: Đã nạp ${createdProducts.length} sản phẩm mới vào Database.`);
        
        // Ngắt kết nối và dừng script
        mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error('❌ LỖI KHI NẠP DỮ LIỆU:', error.message);
        process.exit(1);
    }
};


seedData();