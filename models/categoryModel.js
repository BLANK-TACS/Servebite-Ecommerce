const { mssql, getPool } = require('../config/DBconnect')

const getProductCategory = async () => {
    const pool = await getPool()

    const query = `select * from tblCategory`
    const categories = (await pool.request().query(query)).recordset

    return categories
}

const getCategoryIDByName = async (category) => {
    const pool = await getPool()

    const query =  `select categoryID from tblCategory where category = @category`
    const result = await pool.request()
    .input('category', mssql.VarChar, category)
    .query(query)

    return result.recordset[0].categoryID
}

const createCategory = async (category, path) => {
    const pool = await getPool()

    const query = `insert into tblCategory(category, path) values (@category, @path)`
    const result = await pool.request()
    .input('category', mssql.VarChar, category)
    .input('path', mssql.NVarChar, path)
    .query(query)

    return result.rowsAffected[0]
}

module.exports = {
    getProductCategory,
    getCategoryIDByName,
    createCategory,
}