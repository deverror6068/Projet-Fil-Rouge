const db = require("../models/db");

const commandesController = require("./commandesController");
const produitsController = require("./produitsController");
const fournisseursController = require("./fournisseursController");
const utilisateurController = require("./utilisateurController");

exports.getStats = async (req, res) => {
  try {
    const [commandes, produits, fournisseurs,utilisateurs] = await Promise.all([
      commandesController.getNombreCommandes(),
      produitsController.getNombreProduct(),
      fournisseursController.getNombreFournisseurs(),
      utilisateurController.getNombreUtilisateur()
    ]);

    res.json({ commandes, produits, fournisseurs,utilisateurs });

  } catch (err) {

    res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
  }
};
