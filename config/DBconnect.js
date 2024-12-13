const mssql = require('mssql')

const config = {
    server: process.env.MSSQL_SERVER,
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    database: process.env.MSSQL_DATABASE,
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
}

const createPool = async () => {
    try {
        const pool = await new mssql.ConnectionPool(config).connect()
        return pool
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = {
    mssql,
    getPool: createPool
}