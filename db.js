const { Sequelize, DataTypes } = require('sequelize')
const session = require('express-session')
const SequelizeStore = require("connect-session-sequelize")(session.Store)

const config = require('./config')

const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: config.DB_DIALECT,
  logging: config.production ? false : console.log
})

const sessionStore = new SequelizeStore({
  db: sequelize
})

async function init () {
  return await sequelize.sync({force: true})
}
module.exports = { init, sessionStore }
