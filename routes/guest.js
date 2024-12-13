const express = require('express')
const guestRouter = express.Router()

const isGuest = (req, res, next) => {
    const user = req.session.user

    if(user) {
        return res.redirect('/protected/admin')
    }
    next()
}

const guestController = require('../controllers/guestController')

guestRouter.get('/', isGuest, guestController.renderHomePage)
guestRouter.get('/products', isGuest, guestController.renderProductPage)
guestRouter.get('/products/show', isGuest, guestController.renderProductModal)
guestRouter.get('/products/show-comment', isGuest, guestController.renderProductComment)

module.exports = guestRouter