const db = require("../models/db");

const commandesController = require("./commandesController");
const produitsController = require("./produitsController");
const fournisseursController = require("./fournisseursController");

exports.getStats = async (req, res) => {
  try {
    const [commandes, produits, fournisseurs] = await Promise.all([
      commandesController.getNombreCommandes(),
      produitsController.getNombreProduct(),
      fournisseursController.getNombreFournisseurs(),
    ]);

    res.json({ commandes, produits, fournisseurs });
    console.log("affichement des stats", { commandes, produits, fournisseurs });
  } catch (err) {
    console.error("Erreur dans getStats:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
  }
};
