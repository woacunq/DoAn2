const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Gửi thông tin định danh lên Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Thiết lập nơi lưu trữ trên Cloud
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'PREDATOR_STORE_PRODUCTS', // Ảnh sẽ nằm trong thư mục này trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Tự động tối ưu kích thước ảnh
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;