const sequelize = require("./database");
const { Model, DataTypes } = require("sequelize");

class List extends Model {}

List.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize,
  tableName: "list"
});


module.exports = List;

// List.findAll();
