function calculateTotal(cartItems) {
    let subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return subtotal
}

module.exports = {
    calculateTotal,
}