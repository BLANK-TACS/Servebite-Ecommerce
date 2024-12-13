const { MAX } = require('mssql')
const { mssql, getPool } = require('../config/DBconnect')

const getUserProducts = async () => {
    const pool = await getPool()

    const query = `SELECT p.prodID, p.name, p.price, p.path, c.categoryID, c.category,
    COALESCE(AVG(r.rating), 0) AS averageRating FROM tblProduct p 
    JOIN tblCategory c ON p.categoryID = c.categoryID
    LEFT JOIN tblRating r ON p.prodID = r.prodID 
    where p.stock > 0
    GROUP BY p.prodID, p.name, p.price, p.path, c.category, c.categoryID`
    const result = (await pool.request().query(query)).recordset

    return result
}

const getAdminProducts = async () => {
    const pool = await getPool()

    const query = `select * from tblProduct p 
        join tblCategory c on p.categoryID = c.categoryID`
    const result = (await pool.request().query(query)).recordset

    return result
}

const getProductsByID = async (prodID) => {
    const pool = await getPool()

    const query = `select * from tblProduct where prodID = @prodID`
    const result = await pool.request()
        .input('prodID', mssql.Int, prodID)
        .query(query)

    return result
}

const getProductPathByID = async (prodID) => {
    const pool = await getPool()

    const query = `select path from tblProduct where prodID = @prodID `
    const result = await pool.request()
        .input('prodID', mssql.Int, prodID)
        .query(query)

    return result.recordset[0].path
}

const createProduct = async (prod) => {
    const pool = await getPool()

    const query = `insert into tblProduct (name, categoryID, stock, price, description, path)
        values (@name, @categoryID, @stock, @price, @description, @path)`

    const result = await pool.request()
        .input('name', mssql.VarChar, prod.name)
        .input('categoryID', mssql.Int, prod.categoryID)
        .input('stock', mssql.Int, prod.stock)
        .input('price', mssql.Decimal(10, 2), prod.price)
        .input('description', mssql.NVarChar(MAX), prod.description)
        .input('path', mssql.VarChar(255), prod.path)
        .query(query)

    return result.rowsAffected[0]
}

const updateProductByID = async (prod) => {
    const pool = await getPool()

    const query = `update tblProduct 
        set name = @name,
        stock = @stock,
        price = @price
        where prodID = @prodID`
    const result = await pool.request()
        .input('prodID', mssql.Int, prod.prodID)
        .input('name', mssql.VarChar, prod.name)
        .input('stock', mssql.Int, prod.stock)
        .input('price', mssql.Decimal(10, 2), prod.price)
        .query(query)

    return result.rowsAffected[0]
}

const updateProductStock = async (name, quantity) => {
    const pool = await getPool()

    const query = `update tblProduct 
    set stock = stock - @quantity
    where name = @name`
    const result = await pool.request()
        .input('name', mssql.VarChar, name)
        .input('quantity', mssql.Int, quantity)
        .query(query)

    return result.rowsAffected[0]
}

const deleteProductByID = async (prodID) => {
    const pool = await getPool()

    const query = 'delete from tblProduct where prodID = @prodID'
    const result = await pool.request()
        .input('prodID', mssql.Int, prodID)
        .query(query)

    return result.rowsAffected[0]
}

module.exports = {
    getUserProducts,
    getAdminProducts,
    getProductsByID,
    getProductPathByID,
    createProduct,
    updateProductByID,
    updateProductStock,
    deleteProductByID,
}