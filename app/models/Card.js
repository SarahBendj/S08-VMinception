const sequelize = require("./database");
const { Model, DataTypes } = require("sequelize");

class Card extends Model {}

Card.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  color: {
    type: DataTypes.TEXT,
    // On pourrait ici affiner le type pour interdire les TEXT de plus de 7 caractères, mais laissons la BDD s'en charger
  }
}, {
  sequelize,
  tableName: "card"
});

module.exports = Card;

// Card.findAll();
