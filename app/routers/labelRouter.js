const { Router } = require("express");
const { labelController } = require("../controllers");
const cw = require("./controllerWrapper");

const router = Router();

router.get("/labels", cw(labelController.getAllLabels));
router.get("/labels/:id", cw(labelController.getOneLabel));
router.post("/labels", cw(labelController.createLabel));
router.patch("/labels/:id", cw(labelController.updateLabel));
router.delete("/labels/:id", cw(labelController.deleteLabel));

router.put("/cards/:cardId/labels/:labelId", cw(labelController.addLabelToCard));
router.delete("/cards/:cardId/labels/:labelId", cw(labelController.removeLabelFromCard));

module.exports = router;
