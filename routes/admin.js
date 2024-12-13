const express = require('express')
const { upload } = require('../config/upload')

const adminController = require('../controllers/adminController')
const adminRouter = express.Router()

const isAdmin = (req, res, next) => {
    const user = req.session.user

    if (user.typeID != 1) return res.redirect('/protected/user')
    next()
}

adminRouter.get('/', isAdmin, adminController.renderHomePage)

adminRouter.get('/products', isAdmin, adminController.renderProductPage)
adminRouter.post('/products/add-product', isAdmin, upload.single('file'), adminController.addNewProduct)
adminRouter.put('/products/update', isAdmin, adminController.updateProduct)
adminRouter.delete('/products/delete', isAdmin, adminController.deleteProduct)
adminRouter.post('/products/add-category', isAdmin, upload.single('file'), adminController.addNewCategory)


adminRouter.get('/orders', isAdmin, adminController.renderSalesPage)
adminRouter.put('/orders/order-status', isAdmin, adminController.updateOrderStatus)
module.exports = adminRouter