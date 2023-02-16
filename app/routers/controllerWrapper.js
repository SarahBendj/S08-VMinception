function controllerWrapper(mdwFunction) {
  return async function(req, res, next) {
    try {
      await mdwFunction(req, res, next)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Unexpected server error. Please try again later." });
    }
  }
}

module.exports = controllerWrapper;

// Objectif de ce wrapper, gérer les erreurs imprévisibles pour :
// - renvoyer une 500 au client, plutôt que de laisser le serveur crash complètement
// - centraliser la même erreur pour tous les controlleurs
