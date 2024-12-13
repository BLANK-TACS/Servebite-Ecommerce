const { MAX } = require('mssql')
const {mssql, getPool} = require('../config/DBconnect')

const getProductComments = async (prodID) => {
    const pool = await getPool()

    const query = `select u.username, c.comment from tblComment c
    join tblUser u on u.userID = c.userID
    where c.prodID = @prodID
    order by c.commentTime asc`
    const result = await pool.request()
    .input('prodID', mssql.Int, prodID)
    .query(query)

    return result.recordset
}

const insertProductComment = async (details) => {
    const pool = await getPool()
    
    const query = `insert into tblComment(userID, prodID, comment) 
    values(@userID, @prodID, @comment)`
    const result = await pool.request()
    .input('userID', mssql.Int, details.userID)
    .input('prodID', mssql.Int, details.prodID)
    .input('comment', mssql.NVarChar(MAX), details.content)
    .query(query)

    return result.rowsAffected
}

module.exports = {
    getProductComments,
    insertProductComment,
}