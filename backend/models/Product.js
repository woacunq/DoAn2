const mongoose = require('mongoose');

/**
 * @description Định nghĩa cấu trúc sản phẩm đa dạng (Áo, Giày, Phụ kiện)
 * @notes Sử dụng mảng 'variants' để quản lý tồn kho linh hoạt theo size/loại sân.
 */
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    
    // Phân loại để mapping logic hiển thị ở Frontend
    category: { 
        type: String, 
        enum: ['Shirt', 'Shoes', 'Accessories'], 
        required: true 
    },

    brand: { type: String, required: true },
    basePrice: { type: Number, required: true, min: 0 },
    
    // Cấu hình dịch vụ cộng thêm (Ví dụ: In tên/số lên áo)
    isCustomizable: { type: Boolean, default: false }, 
    customPrice: { type: Number, default: 0 },

    /**
     * Quản lý biến thể: Cho phép một mã sản phẩm (SKU) có nhiều lựa chọn size/loại
     */
    variants: [{
        size: { type: String, required: true }, 
        type: { type: String },
        stock: { type: Number, default: 0, min: 0 }
    }],

    image: { type: String, required: true }, 
    description: { type: String },
    featured: { type: Boolean, default: false }, // Gắn nhãn sản phẩm tiêu điểm
    
}, { timestamps: true });

// Tối ưu hóa hiệu năng tìm kiếm theo tên sản phẩm
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);