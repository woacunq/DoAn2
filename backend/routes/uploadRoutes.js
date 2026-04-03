const express = require("express");
const router = express.Router();
const uploadCloud = require("../config/cloudinary");
const { protect, admin } = require("../middleware/authMiddleware");

router.post(
  "/",
  uploadCloud.single("image"), // Đưa Multer lên đầu để nó "nhặt" file trước
  protect,                     // Sau đó mới kiểm tra Token
  admin,                       // Sau đó mới kiểm tra quyền Admin
  (req, res) => {
    console.log("--- KẾT QUẢ CUỐI CÙNG ---");
    console.log("File nhận được:", req.file);
    console.log("Body nhận được:", req.body);

    if (!req.file) {
      return res.status(400).json({ 
        message: "Lỗi: Server vẫn không thấy file!",
        note: "Hãy kiểm tra Postman Console để xem Request Body có thực sự gửi đi không."
      });
    }

    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
    });
  }
);

module.exports = router;
