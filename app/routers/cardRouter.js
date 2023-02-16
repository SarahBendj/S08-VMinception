const { Router } = require("express");
const { cardController } = require("../controllers");
const cw = require("./controllerWrapper");

const router = Router();

router.get("/cards", cw(cardController.getAllCards));
router.get("/cards/:id", cw(cardController.getOneCard));
router.post("/cards", cw(cardController.createCard));
router.patch("/cards/:id", cw(cardController.updateCard));
router.delete("/cards/:id", cw(cardController.deleteCard));

router.get("/lists/:list_id/cards", cw(cardController.getAllCardsOfList));

module.exports = router;
