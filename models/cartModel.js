const { mssql, getPool } = require('../config/DBconnect')

const getProductCartByID = async (userID) => {
    const pool = await getPool()

    const query = `SELECT 
    p.prodID, p.name, p.stock, p.price, p.path, r.rating, c.quantity
    FROM tblProduct p
    join tblCart c on c.prodID = p.prodID
    left join tblRating r ON p.prodID = r.prodID
    and r.userID = c.userID
    where c.userID = @userID`

    const products = await pool.request()
        .input('userID', mssql.Int, userID)
        .query(query)

    return products.recordset
}

const getProductsDetailsByUserID = async (userID) => {
    const pool = await getPool()

    const query = `select p.name, p.path, c.quantity, p.price
    from tblProduct p
    join tblCart c on c.prodID = p.prodID
    where c.userID = @userID`
    const result = await pool.request()
    .input('userID', mssql.Int, userID)
    .query(query)

    return result.recordset
}

const deleteProductCartByUserID = async (userID) => {
    const pool = await getPool()

    const query = `delete from tblCart where userID = @userID`
    const result = await pool.request()
    .input('userID', mssql.Int, userID)
    .query(query)

    return result.rowsAffected[0]
}

const getProductCartQuantityByID = async (prodID) => {
    const pool = await getPool()

    const query = `select quantity from tblCart where prodID = @prodID`
    const result = await pool.request(query)
        .input('prodID', mssql.Int, prodID)
        .query(query)

    return result.recordset[0]
}


const getProductCartDetails = async (userID, prodID) => {
    const pool = await getPool()

    const query = `select p.price, p.stock from tblProduct p
    join tblCart c on p.prodID = @prodID
    where c.userID = @userID`
    const result = await pool.request()
        .input('userID', mssql.Int, userID)
        .input('prodID', mssql.Int, prodID)
        .query(query)

    return result.recordset[0]
}

const updateProductCartQuantity = async (details) => {
    const pool = await getPool()

    const query = `update tblCart set quantity = @quantity
    where prodID = @prodID and userID = @userID`
    const result = await pool.request()
        .input('quantity', mssql.Int, details.quantity)
        .input('prodID', mssql.Int, details.prodID)
        .input('userID', mssql.Int, details.userID)
        .query(query)

    return result.rowsAffected[0]
}


const addProductCart = async (userID, prodID) => {
    const pool = await getPool()

    const query = `insert into tblCart(userID, prodID) values(@userID, @prodID)`
    const result = await pool.request()
        .input('userID', mssql.Int, userID)
        .input('prodID', mssql.Int, prodID)
        .query(query)

    return result
}

const deleteProductCart = async (userID, prodID) => {
    const pool = await getPool()

    const query = `delete from tblCart 
    where userID = @userID and prodID = @prodID`

    const result = await pool.request()
        .input('userID', mssql.Int, userID)
        .input('prodID', mssql.Int, prodID)
        .query(query)

    return result
}

const isProductInCart = async (userID, prodID) => {
    const pool = await getPool()

    const query = `select c.prodID from tblCart c
    inner join tblUser u on c.userID = u.userID
    inner join tblProduct p on c.prodID = p.prodID
    where u.userID = @userID and p.prodID = @prodID`

    const result = await pool.request()
        .input('userID', mssql.Int, userID)
        .input('prodID', mssql.Int, prodID)
        .query(query)

    return result.recordset.length > 0
}

module.exports = {
    getProductCartByID,
    getProductCartDetails,
    getProductCartQuantityByID,
    getProductsDetailsByUserID,
    updateProductCartQuantity,
    addProductCart,
    deleteProductCart,
    deleteProductCartByUserID,
    isProductInCart,
}