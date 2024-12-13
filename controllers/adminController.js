const product = require('../models/productModel')
const category = require('../models/categoryModel')
const order = require('../models/orderModel')
const fs = require('fs').promises

const renderHomePage = (req, res) => {
    const user = req.session.user

    res.render('index', {
        currentPage: '',
        currentUser: user
    })
}

const renderProductPage = async (req, res) => {
    const user = req.session.user

    try {
        const [categories, items] = await Promise.all([
            category.getProductCategory(),
            product.getAdminProducts()
        ])

        res.render('admin/products', {
            items,
            categories,
            currentPage: 'products',
            currentUser: user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error'
        })
    }
}

const renderSalesPage = async (req, res) => {
    const username = req.session.user

    const [sales, statuses, users] = await Promise.all([
        order.getSalesDetails(),
        order.getOrderStatus(),
        order.getUsername(),
    ])

    res.render('admin/orders', {
        items: sales,
        users,
        statuses,
        currentPage: 'orders',
        currentUser: username
    })
}

const addNewProduct = async (req, res) => {
    const { name, category: cat, stock, price, description } = req.body
    const path = req.file ? req.file.path : '\\uploads\\prod-default.png'
    const splitPath = path.replace('public', '')

    try {
        const categoryID = await category.getCategoryIDByName(cat)

        if (!categoryID) {
            req.flash('error_msg', 'Category does not exist');
            return res.redirect('/protected/admin/products');
        }

        const prod = {
            name,
            categoryID,
            stock,
            price,
            description,
            path: splitPath
        }

        const create = await product.createProduct(prod)

        if (create == 0) {
            return req.flash('error_msg', 'No product added')
        }

        req.flash('success_msg', "Product was successfully added")
        res.redirect('/protected/admin/products')
    } catch (error) {
        console.log(error)
        req.flash('error_msg', 'Duplicate product name detected')
        res.redirect('/protected/admin/products')
    }
}

const addNewCategory = async (req, res) => {
    const { addCategory: cat } = req.body
    const path = req.file ? req.file.path : '\\uploads\\cat-default.png'
    const splitPath = path.replace('public', '')

    try {
        const create = await category.createCategory(cat, splitPath)

        if (create == 0) {
            return req.flash('error_msg', 'No category was added')
        }

        req.flash('success_msg', 'Category was successfully added')
        res.redirect('/protected/admin/products')
    } catch (error) {
        console.log(error)
        req.flash('error_msg', 'Duplicate category detected')
        res.redirect('/protected/admin/products')
    }
}

const updateProduct = async (req, res) => {
    const { prodID, name, stock, price } = req.body

    const prod = {
        prodID,
        name,
        stock,
        price
    }

    try {
        const update = await product.updateProductByID(prod)
        
        if(!prod.name) {
            return res.status(500).json({
                message: 'Prodcut name required!'
            })
        }

        if (update == 0) {
            return res.status(404).json({
                message: 'Product not found!'
            })
        }

        res.status(200).json({
            message: 'Data updated successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'error'
        })
    }
}

const deleteProduct = async (req, res) => {
    const { prodID } = req.body
    try {
        const getPath = await product.getProductPathByID(prodID)

        const filePath = 'public' + getPath

        if (filePath != 'public\\uploads\\prod-default.png') {
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'error'
                })
            }
        }
        
        const deleteProd = await product.deleteProductByID(prodID)
        if (deleteProd == 0) {
            return res.status(500).json({
                message: 'No product was deleted!'
            })
        }

        res.status(200).json({
            message: 'Product was successfully deleted'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'error'
        })
    }
}

const updateOrderStatus = async (req, res) => {
    const details = req.body
    
    try {
        const update = await order.updateOrderStatus(details)

        if(!update) {
            return res.status(404).json({
                message: 'Cant fiind the order details'
            })
        }
        res.status(200).json({
            message: 'Successfully updated order status'
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    renderHomePage,
    renderProductPage,
    renderSalesPage,
    addNewProduct,
    updateProduct,
    deleteProduct,
    addNewCategory,
    updateOrderStatus,
}