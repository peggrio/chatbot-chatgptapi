const dbConfig = require('./database')

const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }

)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.plans = require('../models/plan')(sequelize, DataTypes)

db.sequelize.sync({
    force: false
}).then(() => {
    console.log('db connected!')
})

module.exports = db