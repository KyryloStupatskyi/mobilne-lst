const { Sequelize } = require("sequelize")

const sequalize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres"
  }
)

module.exports = sequalize