// Charger les variables d'environnements
require("dotenv/config");

// Import des dépendances
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const router = require("./app/routers");

// Créer l'app
const app = express();

// On autorise les requêtes Cross-Origin, qui par défaut seraient bloquées.
app.use(cors({
  origin: "*", // On autorise tout le monde, histoire que vous soyez tranquille en S07 !
  // Mais en pratique, dans le cas où notre API est privée, et n'est utilisé que par 1 seul front, on bloquerait seulement le domaine de ce front
}));

// On limite le nombre de requête des clients
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000, // Limit each IP to 100 requests per `window` (here, per 15 minutes) // On met 100K ici pour pas être embêté en S07
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);


// Body parsing middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());

// On sert statiquement le dossier contenant les fichiers client compilés
app.use(express.static("dist"));

// On sert l'API
app.use(router);

// Lancer l'app
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
