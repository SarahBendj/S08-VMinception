const sequelize = require("./database");
const { Model, DataTypes } = require("sequelize");

class Label extends Model {}

Label.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  color: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  tableName: "label"
});

module.exports = Label;

// Label.findAll();
