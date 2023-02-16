const { Label, Card } = require("../models");
const { isValidHexadecimalColor } = require("./utils");

async function getAllLabels(_, res) {
  const labels = await Label.findAll();
  res.json(labels);
}

async function getOneLabel(req, res) {
  const labelId = req.params.id;
  const label = await Label.findByPk(labelId);
  if (! label) {
    return res.json({ error: "Label not found. Please verify the provided id." });
  }
  res.json(label);
}

async function createLabel(req, res) {
  const { name, color } = req.body;

  if (! name) {
    return res.status(400).json({ error: "Missing (or empty) body parameter: 'name'." });
  }

  if (color && ! isValidHexadecimalColor(color)) {
    return res.status(400).json({ error: "Invalid type: 'color' should be a valid hexadecimal code." });
  }

  const alreadyExistingLabelWithSameName = await Label.findOne({ where: { name }});
  if (alreadyExistingLabelWithSameName) { // S'il existe un label avec le même nom, on bloque.
    return res.status(409).json({ error: "Already existing label with the same name." });
  }

  const label = await Label.create({ name, color });

  res.status(201).json(label);
}

async function updateLabel(req, res) {
  const labelId = req.params.id;
  const { name, color } = req.body;

  if (! name && ! color) {
    return res.status(400).json({ error: "Invalid body. Should provide at least a 'name' or 'color' property" });
  }

  if (color && ! isValidHexadecimalColor(color)) {
    return res.status(400).json({ error: "Invalid type: color should be a hexadecimal code (string)." });
  }

  const label = await Label.findByPk(labelId);
  if (! label) {
    return res.status(404).json({ error: "Label not found. Please verify the provided id." });
  }

  if (name) { // Si l'utisaliteur veut update le name du label
    const alreadyExistingLabelWithSameName = await Label.findOne({ where: { name }});
    if (alreadyExistingLabelWithSameName) { // S'il existe un label avec le même nom, on bloque.
      return res.status(409).json({ error: "Already existing label with the same name." });
    }
  }

  label.name = name || label.name;
  label.color = color || label.color;
  await label.save();

  res.send(label);
}

async function deleteLabel(req, res) {
  const labelId = req.params.id;

  const label = await Label.findByPk(labelId);
  if (! label) {
    return res.status(404).send({ error: "Label not found. Please verify the provided id." });
  }

  await label.destroy();

  res.status(204).end();
}


async function addLabelToCard(req, res) {
  const { cardId, labelId } = req.params;

  const card = await Card.findByPk(cardId);
  if (! card) { // Si la carte n'existe pas, on bloque.
    return res.json({ error: "Card not found. Please verify the provided id." });
  }

  const label = await Label.findByPk(labelId);
  if (! label) { // Si le label n'existe pas, on bloque.
    return res.json({ error: "Label not found. Please verify the provided id." });
  }

  // Note : on pourrait vérifier si le label n'est pas déjà présent sur la carte mais....
  await card.addLabel(label); // ... il se trouve que c'est déjà géré : si le label est déjà présent sur la carte, Sequelize est malin et ne le rajoute pas une seconde fois !

  const updatedCard = await Card.findByPk(cardId, { include: ["labels"] }); // Je récupère la carte une fois updated avant de la retourner au client
  res.status(201).json(updatedCard);
}


async function removeLabelFromCard(req, res) {
  const { cardId, labelId } = req.params;

  const card = await Card.findByPk(cardId);
  if (! card) {
    return res.json({ error: "Card not found. Please verify the provided id." });
  }

  const label = await Label.findByPk(labelId);
  if (! label) {
    return res.json({ error: "Label not found. Please verify the provided id." });
  }

  await card.removeLabel(label);

  const updatedCard = await Card.findByPk(cardId, { include: ["labels"] });
  res.json(updatedCard);
}


module.exports = {
  getAllLabels,
  getOneLabel,
  createLabel,
  updateLabel,
  deleteLabel,
  addLabelToCard,
  removeLabelFromCard
};
