const { mssql, getPool } = require('../config/DBconnect')

const getFavProducts = async (userID) => {
    const pool = await getPool()

    const query = `SELECT p.prodID, p.name, p.price, p.path,
    COALESCE(AVG(r.rating), 0) AS averageRating FROM tblProduct p 
    JOIN tblFavorite f ON f.prodID = p.prodID
    LEFT JOIN tblRating r ON p.prodID = r.prodID
	where f.userID = @userID and p.stock > 0
	group BY p.prodID, p.name, p.price, p.path`
    const result = await pool.request()
    .input('userID', mssql.Int, userID)
    .query(query)

    return result.recordset
}

const addFavProduct = async (userID, prodID) => {
    const pool = await getPool()

    const query = `INSERT INTO tblFavorite(userID, prodID) VALUES (@userID, @prodID)`
    const result = await pool.request()
    .input('userID', mssql.Int, userID)
    .input('prodID', mssql.Int, prodID)
    .query(query)

    return result
}

const deleteFavProduct = async (userID, prodID) => {
    const pool = await getPool()

    const query = `delete from tblFavorite where userID = @userID and prodID = @prodID`
    const result = await pool.request()
        .input('userID', mssql.Int, userID)
        .input('prodID', mssql.Int, prodID)
        .query(query)

    return result
}

const isProductInFavorite = async (userID, prodID) => {
    const pool = await getPool()

    const query = `select f.prodID from tblFavorite f
        inner join tblUser u on f.userID = u.userID
        inner join tblProduct p on f.prodID = p.prodID
        where u.userID = @userID and p.prodID = @prodID`

    const favorite = await pool.request()
    .input('userID', mssql.Int, userID)
    .input('prodID', mssql.Int, prodID)
    .query(query)

    return favorite.recordset[0]
}

module.exports = {
    getFavProducts,
    addFavProduct,
    deleteFavProduct,
    isProductInFavorite,
}