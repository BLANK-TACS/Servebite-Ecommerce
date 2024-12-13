const express = require('express')
const userController = require('../controllers/userController')
const userRouter = express.Router()

//middleware
const isUser = (req, res, next) => {
    const user = req.session.user

    if (user.typeID != 2) return res.redirect('/protected/admin')
    next()
}

userRouter.get('/', isUser, userController.renderHomePage)

userRouter.get('/products', isUser, userController.renderProductPage)
userRouter.post('/products/favorite-add', isUser, userController.addFavProduct)
userRouter.delete('/products/favorite-remove', isUser, userController.removeFavProduct)
userRouter.get('/products/show', isUser, userController.renderProductModal)
userRouter.get('/products/show-comment', isUser, userController.renderProductComment)
userRouter.post('/products/add-comment', isUser, userController.addProductComment)


userRouter.get('/cart', isUser, userController.renderCartPage)
userRouter.post('/cart/product-add', isUser, userController.addProductToCart)
userRouter.delete('/cart/product-remove', isUser, userController.removeProductToCart)
userRouter.post('/cart/add-rating', isUser, userController.addRating)
userRouter.get('/cart/card-total', isUser, userController.getProductCart)
userRouter.put('/cart/card-quantity', isUser, userController.updateProductCartQuantity)
userRouter.post('/cart/add-order', isUser, userController.addOrder)
userRouter.get('/cart/success', isUser, userController.successPayment)

userRouter.get('/order', isUser, userController.renderOrderPage)
userRouter.get('/order/products', isUser, userController.getOrderProductsByOrderNo)


module.exports = userRouter