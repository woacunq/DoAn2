const Product = require("../models/Product");

/**
 * @desc    Lấy danh sách sản phẩm (Hỗ trợ Search, Filter & Pagination)
 * @route   GET /api/products
 * @access  Public
 */
exports.getAllProducts = async (req, res) => {
  try {
    const { category, featured, search } = req.query;

    // 🚨 TỐI ƯU 1: Luôn luôn lọc ra các sản phẩm đã bị "Xóa mềm" (ẩn)
    let query = { isHidden: { $ne: true } };

    // 1. Tìm kiếm theo tên (Dựa trên text index đã tạo ở Model)
    if (search) {
      query.$text = { $search: search };
    }

    // 2. Lọc theo danh mục và tiêu điểm
    if (category) query.category = category;
    if (featured) query.featured = featured === "true";

    // 3. Thực thi query (Sắp xếp mới nhất lên đầu)
    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Lấy chi tiết một sản phẩm
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // Nếu không tìm thấy hoặc sản phẩm đó đã bị ẩn thì báo lỗi
    if (!product || product.isHidden) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Khởi tạo sản phẩm mới
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Dữ liệu đầu vào không hợp lệ",
      error: error.message,
    });
  }
};

/**
 * @desc    Cập nhật thông tin sản phẩm
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Sản phẩm không tồn tại" });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    XÓA MỀM sản phẩm
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    // 🚨 TỐI ƯU 2: Đổi trạng thái thành true thay vì dùng findByIdAndDelete
    product.isHidden = true;
    await product.save();

    res
      .status(200)
      .json({ success: true, message: "Đã ẩn sản phẩm thành công (Xóa mềm)" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
