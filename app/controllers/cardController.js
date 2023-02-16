const { Card, List } = require("../models");
const { isValidHexadecimalColor } = require("./utils");

async function getAllCards(_, res) {
  // Traitement
  const cards = await Card.findAll({
    order: [
      ["position", "ASC"],
      ["created_at", "DESC"]
    ],
    include: {
      association: "labels"
    }
  });

  // Réponse
  res.status(200).json(cards);
}

async function getOneCard(req, res) {
  // Parsing
  const cardId = parseInt(req.params.id);

  // Traitement
  const card = await Card.findByPk(cardId, {
    include: "labels"
  });

  // Gardes
  if (! card) {
    return res.status(404).json({ error: "Card not found. Please verify the provided id." });
  }

  // Réponse
  res.status(200).json(card);
}

async function createCard(req, res) {
  // Parsing
  const { content, color, position, list_id } = req.body;

  if (! content) { // On autorise pas les content vide ou string vide
    return res.status(400).json({ error: "Missing body (or empty) parameter: 'content'." });
  }

  if (! list_id) { // Si pas de list_id, on bloque
    return res.status(400).json({ error: "Missing body parameter: 'list_id'."});
  }

  if (color && ! isValidHexadecimalColor(color)) { // Si il y a une couleur mais qu'elle n'est pas au format hexa, on bloque
    return res.status(400).json({ error: "Invalid type: 'color' should be a valid hexadecimal code." });
  }

  if (position && isNaN(position)) { // Si il y a une position mais pas au format number, on bloque
    return res.status(400).json({ error: "Invalid type: 'position' should be a number." });
  }

  if (! await doesListExist(list_id)) { // Si la liste dans laquelle la carte apparaitra n'existe pas, on bloque
    return res.status(400).json({ error: "Invalid body parameter: 'list_id' does not exist." });
  }

  // Traitement
  const card = await Card.create({
    content,
    list_id: parseInt(list_id),
    position: position ? parseInt(position) : 0, // On prend la position demandée, mais si cette position est undefined, on met 0
    color: color || null // On prend la couleur demandée, mais si cette couleur n'est pas précisée, on bloque.
  });

  // Réponse
  res.status(201).json(card);
}

async function updateCard(req, res) {
  // Parsing
  const cardId = parseInt(req.params.id);
  const { content, position, color, list_id } = req.body;

  if (! content && ! position && ! color && ! list_id) { // Si le client veut faire un update sans préciser aucun nouveau champ pour la carte, on bloque.
    return res.status(400).json({ error: "Invalid body. Should provide at least a 'content', 'color', 'position'  or 'list_id' property" });
  }

  if (position && isNaN(position)) { // Si le client fournie une nouvelle position mais au mauvais format, on bloque
    return res.status(400).json({ error: "Invalid type: 'position' should be a number." });
  }

  if (color && ! isValidHexadecimalColor(color)) { // Si il y a une nouvelle couleur, mais mauvais format, on bloque.
    return res.status(400).json({ error: "Invalid type: position should be a valid hexadecimal code (string)." });
  }

  if (list_id && ! await doesListExist(list_id)) { // En cas d'update de list_id, on vérifie que la liste existe, sinon on bloque.
    return res.status(400).json({ error: "Invalid body parameter: list_id does not exist." });
  }

  // Traitement
  const card = await Card.findByPk(cardId);

  // Garde
  if (! card) { // Si la carte n'existe pas, on bloque.
    return res.status(200).json({ error: "Card not found. Please verify the provided id." });
  }

  if (content !== undefined) { // Si il y a un nouveau content
    card.content = content;
  }

  if (position !== undefined) { // Si il y a une nouvelle position
    card.position = parseInt(position);
  }

  if (color !== undefined) { // Si il y a une nouvelle couleur
    card.color = color;
  }

  if (list_id) { // Si il y a une nouvelle liste pour la carte
    card.list_id = parseInt(list_id);
  }

  await card.save();

  // Réponse
  res.status(200).json(card);
}

async function doesListExist(listId) {
  const list = await List.findByPk(listId);
  return !! list; // Si list est null, alors ça vaut false. Si list vaut { ... } ça vaut true.
}

async function deleteCard(req, res) {
  // Parsing
  const cardId = parseInt(req.params.id);

  // Traitement
  const card = await Card.findByPk(cardId);

  // Gardes
  if (! card) {
    return res.status(404).send({ error: "Card not found. Please verify the provided id." });
  }

  await card.destroy(); // On oublie pas le await, sinon, si ça pête l'utilisateur aura eu la 204 alors que ça pète à posteriori

  // Réponse
  res.status(204).end();
}

async function getAllCardsOfList(req, res) {
  const listId = parseInt(req.params.list_id);

  const cards = await Card.findAll({
    where: { list_id: listId },
    include: "labels" // bonus : on rajoute les labels des cartes dans la réponse pour simplifier le code du front plus tard
  });

  // A noter, si l'utilisateur donne une list_id au mauvais format, ça renverra bien une liste vide !

  res.status(200).json(cards);
}

module.exports = {
  getAllCards,
  getAllCardsOfList,
  getOneCard,
  createCard,
  updateCard,
  deleteCard
};
