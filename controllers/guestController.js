const product = require('../models/productModel')
const category = require('../models/categoryModel')
const rating = require('../models/ratingModel')
const comment = require('../models/commentModel')

const renderHomePage = async (req, res) => {
    try {
        res.render('index', {
            currentPage: '',
            currentUser: null,
            addedToCart: null,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'error'
        })
    }
}

const renderProductPage = async (req, res) => {
    try {
        const [products, categories] = await Promise.all([
            product.getUserProducts(),
            category.getProductCategory(),
        ])

        res.render('guest/products', {
            currentPage: 'products',
            currentUser: null,
            categories,
            products,
            addedToCart: null,
            favorites: null
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'error'
        })
    }
}

const renderProductModal = async (req, res) => {
    const prodID = req.query.prodID

    try {
        const [item, ratings] = await Promise.all([
            product.getProductsByID(prodID),
            rating.getProductRatingByID(prodID)
        ])
    
        res.status(200).json({
            item: item.recordset[0],
            ratings: !ratings ? 0 : ratings,
            message: 'Ok'
        })
    } catch (error) {
        console.log(error)
    }
}

const renderProductComment = async (req, res) => {
    const prodID = req.query.prodID

    try {
        const comments = await comment.getProductComments(prodID)
        res.status(200).json({
            comments
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    renderHomePage,
    renderProductPage,
    renderProductModal,
    renderProductComment,
}