/**
 * @description Logic nghiệp vụ tính toán giá trị đơn hàng
 * @formula $Total = \sum (Unit Price + Custom Fee) \times Quantity$
 */

/**
 * Tính toán đơn giá cho từng item (bao gồm phí tùy chỉnh nếu có)
 */
const calculateItemPrice = (product, isCustom, quantity) => {
    let unitPrice = product.basePrice;

    // Logic tính phí in ấn (chỉ áp dụng cho danh mục Áo)
    if (product.category === 'Shirt' && isCustom) {
        unitPrice += (product.customPrice || 50000);
    }

    return unitPrice * quantity;
};

module.exports = { calculateItemPrice };