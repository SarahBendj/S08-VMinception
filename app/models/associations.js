const Card = require("./Card");
const Label = require("./Label");
const List = require("./List");

// Card <-> List
// One-To-Many

List.hasMany(Card, {
  as: "cards", // Depuis une List, je pourrai demander ses "cards"
  foreignKey: "list_id"
});
Card.belongsTo(List, {
  as: "list", // Depuis une Card, je veux la "list"
  foreignKey: "list_id"
});

// On test !
// List.findOne({ include: "cards" }).then(res => console.log(res.get({ plain: true })));
// Card.findOne({ include: "list", raw: true }).then(res => console.log(res));


// Card <-> Label
// Many-to-Many

Card.belongsToMany(Label, {
  as: "labels",
  through: "card_has_label",
  foreignKey: "card_id" // name of the foreign key in the target table (target table = Label)

});
Label.belongsToMany(Card, {
  as: "cards",
  through: "card_has_label",
  foreignKey: "label_id" // name of the foreign key in the target table (target table = Card)
});

// Card.findOne({ include: "labels" }).then(res => console.log(res.toJSON()));
// Label.findOne({ include: "cards" }).then(res => console.log(res.toJSON()));

module.exports = { Label, Card, List };
