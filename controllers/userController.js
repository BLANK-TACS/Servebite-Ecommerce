const product = require('../models/productModel')
const category = require('../models/categoryModel')
const favorite = require('../models/favoriteModel')
const cart = require('../models/cartModel')
const rating = require('../models/ratingModel')
const order = require('../models/orderModel')
const cartService = require('../services/cartServices')
const comment = require('../models/commentModel')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const renderHomePage = async (req, res) => {
    const user = req.session.user

    try {
        const cartProducts = await cart.getProductCartByID(user.userID)

        res.render('index', {
            currentPage: '',
            currentUser: user,
            addedToCart: cartProducts.length == 0 ? null : cartProducts,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'error'
        })
    }
}

const renderProductPage = async (req, res) => {
    const user = req.session.user
    try {

        const [products, favorites, cartProducts, categories] = await Promise.all([
            product.getUserProducts(),
            favorite.getFavProducts(user.userID),
            cart.getProductCartByID(user.userID),
            category.getProductCategory(),
        ])

        res.render('user/products', {
            currentPage: 'products',
            currentUser: user,
            categories,
            products,
            addedToCart: cartProducts.length == 0 ? null : cartProducts,
            favorites
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'error'
        })
    }
}

const renderCartPage = async (req, res) => {
    const user = req.session.user

    try {
        const products = await cart.getProductCartByID(user.userID)
        const total = products ? cartService.calculateTotal(products) : 0

        res.render('user/cart', {
            items: products,
            total,
            addedToCart: null,
            currentPage: 'cart',
            currentUser: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

const renderOrderPage = async (req, res) => {
    const user = req.session.user
    try {
        const [items, queues, cartProducts] = await Promise.all([
            order.getOrderByUserID(user.userID),
            order.getOrderQueueByUserID(user.userID),
            cart.getProductCartByID(user.userID)
        ])
        const total = product ? cartService.calculateTotal(items) : 0

        res.render('user/history', {
            items,
            queues,
            addedToCart: cartProducts.length == 0 ? null : cartProducts,
            totalPrice: total,
            currentPage: 'history',
            currentUser: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
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
            ratings: !ratings ? 0 : rating,
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

const addFavProduct = async (req, res) => {
    const userID = req.session.user.userID
    const { prodID } = req.body;

    try {
        const isDup = await favorite.isProductInFavorite(userID, prodID)

        if (isDup) {
            return res.status(404).json({
                message: 'Product already in favorites'
            })
        }

        const result = await favorite.addFavProduct(userID, prodID)

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: 'Product not found or already in favorites'
            })
        }
        res.status(200).json({ redirectUrl: '/protected/user/products' });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'An error occurred while adding to favorites'
        })
    }
}

const removeFavProduct = async (req, res) => {
    const userID = req.session.user.userID
    const { prodID } = req.body
    try {

        const deleteResult = await favorite.deleteFavProduct(userID, prodID)

        if (deleteResult.rowsAffected[0] == 0) {
            return res.status(500).json({
                message: 'Product not found',
                redirectUrl: '/protected/user/products'
            })
        }

        res.status(200).json({
            message: 'Product is successfully removed to the favorite',
            redirectUrl: '/protected/user/products'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'An error occured'
        })
    }
}

const addProductToCart = async (req, res) => {
    const userID = req.session.user.userID
    const { prodID } = req.body
    
    try {
        const found = await product.getProductsByID(prodID)
        if (!found.recordset[0]) {
            return res.status(404).json({
                message: 'Can\'nt find product'
            })
        }

        const dup = await cart.isProductInCart(userID, prodID)
        if (dup) {
            return res.status(404).json({
                message: 'Product already in the cart'
            })
        }

        const addResult = await cart.addProductCart(userID, prodID)
        if (addResult.rowsAffected[0] == 0) {
            return res.status(404).json({
                message: 'Can\'nt find product'
            })
        }

        res.status(200).json({
            message: 'Product successfully added to cart'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

const addProductComment = async (req, res) => {
    const userID = req.session.user.userID
    const {prodID, content} = req.body

    const details = {
        userID,
        prodID,
        content
    }

    try {     
        const insert = comment.insertProductComment(details)

        if(insert == 0) {
            return res.status(404).json({
                message: 'Product cant be found'
            })
        }

        res.status(200).json({
            message: 'Successfully added product comment!'
        })
    } catch (error) {
        console.log(error)
    }
}


const removeProductToCart = async (req, res) => {
    const userID = req.session.user.userID
    const { prodID } = req.body
    try {
        const deleted = await cart.deleteProductCart(userID, prodID)

        if (deleted.rowsAffected[0] == 0) {
            return res.status(404).json({
                message: 'Coud\'nt find the product'
            })
        }

        res.status(200).json({
            message: 'Successfully remove the product from cart',
            redirectUrl: '/protected/user/cart'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

const addRating = async (req, res) => {
    const userID = req.session.user.userID
    const rate = req.body

    try {
        const products = await cart.getProductCartByID(userID)
        const dup = await rating.isProductRated(userID, rate.prodID)

        if (!dup) {
            const add = await rating.addRating(userID, rate.prodID, rate.star)

            if (add == 0) {
                return res.status(404).json({
                    message: 'Coud\'nt add rating the product'
                })
            }
        } else {
            const update = await rating.updateRating(userID, rate.prodID, rate.star)

            if (update == 0) {
                return res.status(404).json({
                    message: 'Coud\'nt update product rating'
                })
            }
        }
        res.status(200).json({
            message: 'Product was successfully rated',
            items: products
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

const getProductCart = async (req, res) => {
    const userID = req.session.user.userID
    const { prodID } = req.query

    try {
        const product = await cart.getProductCartDetails(userID, prodID)

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        res.status(200).json({
            item: product,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

const updateProductCartQuantity = async (req, res) => {
    const userID = req.session.user.userID
    const { prodID, quantity } = req.body

    const details = {
        userID,
        prodID,
        quantity
    }

    try {
        const update = await cart.updateProductCartQuantity(details)

        if (!update) {
            return res.status(404).json({
                message: 'Cant find product'
            })
        }

        const products = await cart.getProductCartByID(userID)
        const total = products ? cartService.calculateTotal(products) : 0

        res.status(200).json({
            total,
        })
    } catch (error) {
        console.log(error)
    }
}

const addOrder = async (req, res) => {
    const userID = req.session.user.userID
    const products = req.body

    try {
        if (products.length == 0) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        const productsDetails = await cart.getProductsDetailsByUserID(userID)
        let line_items = productsDetails.map((product) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.name,
                },
                unit_amount: Math.max(Math.round(product.price * 100), 50),
            },
            quantity: product.quantity,
        }))

        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Shipping Fee',
                },
                unit_amount: Math.round(12.49 * 100), 
            },
            quantity: 1, 
        })
        
        const successUrl = `http://localhost:3000/protected/user/cart/success?session_id={CHECKOUT_SESSION_ID}&userID=${userID}`
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: "http://localhost:3000/protected/user/cart",
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
        })

        res.status(200).json({
            redirectUrl: session.url
        })
    } catch (error) {   
        console.log(error)
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

const successPayment = async (req, res) => {
    const userID = req.session.user.userID
    const sessionId = req.query.session_id

    if (!sessionId) return res.status(400).send('Session ID is missing')

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status !== 'paid') return res.status(400).send('Payment not completed.');
        
        const [productsDetails, q] = await Promise.all([
            cart.getProductsDetailsByUserID(userID),
            order.getOrderNumberByUserID(userID)
        ])
        const queue = (parseInt(q?.orderNo)) + 1 || 1

        const promises = productsDetails.map(async (prod) => {
            const details = {
                userID,
                name: prod.name,
                path: prod.path,
                quantity: prod.quantity,
                price: prod.price,
                total: prod.price * prod.quantity,
                orderNo: queue,
                statusID: 5,
            }

            const add = await order.addOrderProduct(details)
            if (!add) {
                throw new Error(`Product ${prod} not found`)
            }

            await product.updateProductStock(prod.name, prod.quantity)
        })
        await Promise.all(promises)
        await cart.deleteProductCartByUserID(userID)

        res.redirect('/protected/user/order')
    } catch (error) {
        console.error('Error retrieving session:', error)
        res.status(500).send('Error fetching payment details.')
    }
}

const getOrderProductsByOrderNo = async (req, res) => {
    const userID = req.session.user.userID
    const { orderNo } = req.query

    try {
        const items = await order.getOrderByUserID(userID, orderNo)
        const total = product ? cartService.calculateTotal(items) : 0

        res.status(200).json({
            items,
            total
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    renderHomePage,
    renderProductPage,
    renderCartPage,
    renderOrderPage,
    renderProductModal,
    renderProductComment,
    addProductComment,
    addFavProduct,
    removeFavProduct,
    addProductToCart,
    updateProductCartQuantity,
    removeProductToCart,
    getProductCart,
    addRating,
    addOrder,
    getOrderProductsByOrderNo,
    successPayment,
}