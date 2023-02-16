const { Router } = require("express");
const { listController } = require("../controllers");
const cw = require("./controllerWrapper");

const router = Router();

router.get("/lists", cw(listController.getLists));
router.get("/lists/:id", cw(listController.getOneList));
router.post("/lists", cw(listController.createList));
router.delete("/lists/:id", cw(listController.deleteList));
router.patch("/lists/:id", cw(listController.updateList));


module.exports = router;
