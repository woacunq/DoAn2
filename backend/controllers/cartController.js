const Cart = require('../models/Cart');

/**
 * @desc    Lấy giỏ hàng của người dùng hiện tại
 * @route   GET /api/cart
 * @access  Private
 */
exports.getCart = async (req, res) => {
    try {
        // .populate giúp lấy thêm thông tin như tên, ảnh từ Model Product
        const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product', 'name image category');
        
        if (!cart) {
            return res.status(200).json({ success: true, cartItems: [] });
        }
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @desc    Thêm sản phẩm vào giỏ hoặc cập nhật số lượng
 * @route   POST /api/cart
 */
exports.addToCart = async (req, res) => {
    const { product, quantity, size, variantType, isCustom, customName, customNumber, price } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            // Kiểm tra xem sản phẩm cùng size/loại đã có trong giỏ chưa
            const itemIndex = cart.cartItems.findIndex(item => 
                item.product.toString() === product && 
                item.size === size &&
                item.isCustom === isCustom
            );

            if (itemIndex > -1) {
                // Nếu có rồi thì tăng số lượng
                cart.cartItems[itemIndex].quantity += quantity;
            } else {
                // Nếu chưa có thì đẩy object mới vào mảng
                cart.cartItems.push({ product, quantity, size, variantType, isCustom, customName, customNumber, price });
            }
            cart = await cart.save();
        } else {
            // Nếu User chưa có giỏ hàng nào thì tạo mới hoàn toàn
            cart = await Cart.create({
                user: req.user._id,
                cartItems: [{ product, quantity, size, variantType, isCustom, customName, customNumber, price }]
            });
        }
        res.status(201).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};