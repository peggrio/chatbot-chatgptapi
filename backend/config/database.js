module.exports = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
    dialect: process.env.DIALECT,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
}