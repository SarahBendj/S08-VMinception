require("dotenv/config");
// require("dotenv").config()


const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: "postgres",
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

// sequelize.authenticate(); // Executing (default): SELECT 1+1 AS result 💪

module.exports = sequelize;
