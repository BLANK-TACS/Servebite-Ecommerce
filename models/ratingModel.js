const { mssql, getPool } = require('../config/DBconnect')

const isProductRated = async (userID, prodID) => {
    const pool = await getPool()

    const query = `select * from tblRating 
    where userID = @userID and
    prodID = @prodID`
    const result = await pool.request()
        .input('userID', mssql.Int, userID)
        .input('prodID', mssql.Int, prodID)
        .query(query)

    return result.recordset[0]
}

const getAveRating = async () => {
    const pool = await getPool()

    const query = `select prodID, AVG(rating) as averageRating
        from tblRating
        group by prodID`
    const result = (await pool.request()).recordset

    return result
}

const getProductRatingByID = async (prodID) => {
    const pool = await getPool();

    const query = `
        SELECT AVG(rating) AS averageRating
        FROM tblRating
        WHERE prodID = @prodID
        GROUP BY prodID
    `;
    
    const result = await pool.request()
        .input('prodID', mssql.Int, prodID)
        .query(query);

    return result.recordset[0];
}


const addRating = async (userID, prodID, rating) => {
    const pool = await getPool()

    const query = `insert into tblRating(userID, prodID, rating) 
    values(@userID, @prodID, @rating)`
    const result = await pool.request()
        .input('userID', mssql.Int, userID)
        .input('prodID', mssql.Int, prodID)
        .input('rating', mssql.Int, rating)
        .query(query)

    return result.rowsAffected[0]
}

const updateRating = async (userID, prodID, rating) => {
    const pool = await getPool()

    const query = `update tblRating set rating = @rating
    where userID = @userID and prodID = @prodID`
    const result = await pool.request()
        .input('userID', mssql.Int, userID)
        .input('prodID', mssql.Int, prodID)
        .input('rating', mssql.Int, rating)
        .query(query)

    return result.rowsAffected[0]
}

module.exports = {
    getAveRating,
    getProductRatingByID,
    isProductRated,
    addRating,
    updateRating,
}