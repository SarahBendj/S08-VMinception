// Imports generaux
const { Router } = require("express");

// Imports des differents routeurs
const cardRouter = require("./cardRouter");
const labelRouter = require("./labelRouter");
const listRouter = require("./listRouter");

// Imports pour la documentation Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");


// Création du router principal
const router = Router();


// On branches les sous routeurs
router.use(cardRouter);
router.use(labelRouter);
router.use(listRouter);

// On branche la documentation
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// On redirige toutes les requêtes perdues sur la route de documentation
router.use((req, res) => {
  res.redirect("/docs");
})

// On exporte le routeur principal
module.exports = router;
