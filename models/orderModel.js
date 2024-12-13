const { mssql, getPool } = require('../config/DBconnect')


const getOrderByUserID = async (userID, orderNo = 1) => {
    const pool = await getPool()

    const query = `select o.name, o.quantity, o.path, o.orderDate, o.price, o.total, s.status
    from tblOrder o 
    join tblStatus s on o.statusID = s.statusID
    where o.userID = @userID and o.orderNo = @orderNo`
    const result = await pool.request()
        .input('userID', mssql.Int, userID)
        .input('orderNo', mssql.Int, orderNo)
        .query(query)

    return result.recordset
}

const getSalesDetails = async () => {
    const pool = await getPool()

    const query = `WITH DistinctOrders AS (
    SELECT u.username, o.userID, o.orderNo, 
        SUM(o.quantity) AS quantity, 
        MAX(o.orderDate) AS orderDate,  
        MAX(o.price) AS price, 
        s.status, 
        o.total,
        ROW_NUMBER() OVER (PARTITION BY o.userID, o.orderNo ORDER BY MAX(o.orderDate) DESC) AS RowNum
    FROM tblOrder o
    JOIN tblUser u ON u.userID = o.userID
    JOIN tblStatus s ON o.statusID = s.statusID
    GROUP BY u.username, o.userID, o.orderNo, s.status, o.total)
    SELECT username, userID, orderNo, orderDate,  status, total
    FROM DistinctOrders
    WHERE RowNum = 1`
    const result = await pool.request().query(query)

    return result.recordset
}

const getOrderStatus = async () => {
    const pool = await getPool()

    const query = `select * from tblStatus`
    const result = await pool.request().query(query)

    return result.recordset
}

const getOrderDetailsByUserID = async (userID, orderNo) => {
    const pool = await getPool()

    const query = `select name, price, quantity
    where userID = @userID and orderNo = @orderNO`
    const result = await pool.request()
        .input('userID', mssql.Int, userID)
        .input('orderNo', mssql.Int, orderNo)
        .query(query)

    return result.recordset
}

const getOrderQueueByUserID = async (userID) => {
    const pool = await getPool()

    const query = `select distinct orderNo from tblOrder
    where userID = @userID`
    const result = await pool.request()
        .input('userID', mssql.Int, userID)
        .query(query)

    return result.recordset
}

const getOrderNumberByUserID = async (userID) => {
    const pool = await getPool()

    const query = `select distinct orderNo from tblOrder  where userID = @userID order by orderNo desc`
    const result = await pool.request()
        .input('userID', mssql.Int, userID)
        .query(query)

    return result.recordset[0]
}

const getUsername = async () => {
    const pool = await getPool()

    const query = `select distinct u.userID, u.username
    from tblUser u 
    join tblOrder o on o.userID = u.userID`
    const result = await pool.request().query(query)

    return result.recordset
}

const addOrderProduct = async (details) => {
    const pool = await getPool()

    const query = `insert into tblOrder(userID, name, path, quantity, price, total, 
    orderNo, statusID) 
    values (@userID, @name, @path, @quantity, @price, @total, @orderNo, @statusID)`
    const result = await pool.request()
        .input('userID', mssql.Int, details.userID)
        .input('name', mssql.VarChar, details.name)
        .input('path', mssql.NVarChar, details.path)
        .input('quantity', mssql.Int, details.quantity)
        .input('price', mssql.Decimal(10, 2), details.price)
        .input('total', mssql.Decimal(10, 2), details.total)
        .input('orderNo', mssql.Int, details.orderNo)
        .input('statusID', mssql.Int, details.statusID)
        .query(query)

    return result.rowsAffected
}

const updateOrderNumber = async (userID, orderNo) => {
    const pool = await getPool()

    const query = `update tblOrder set orderNo = @orderNo`
    const result = await pool.request()
        .input('orderNo', mssql.Int, orderNo)
        .query(query)

    return result.rowsAffected
}

const updateOrderStatus = async (details) => {
    const pool = await getPool()

    const query = `UPDATE tblOrder
                    SET statusID = @statusID
                    WHERE userID = @userID AND orderNo = @orderNo`
    const result = await pool.request()
        .input('userID', mssql.Int, details.userID)
        .input('orderNo', mssql.Int, details.orderNo)
        .input('statusID', mssql.Int, details.statusID)
        .query(query)

    return result.rowsAffected
}

module.exports = {
    getOrderByUserID,
    getOrderQueueByUserID,
    getOrderNumberByUserID,
    getOrderDetailsByUserID,
    getOrderStatus,
    getUsername,
    getSalesDetails,
    addOrderProduct,
    updateOrderNumber,
    updateOrderStatus,
}