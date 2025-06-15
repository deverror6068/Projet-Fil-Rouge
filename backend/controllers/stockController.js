// controllers/stockController.js
const stockModel = require("../models/stockModel");
exports.getStocksByMagasin = async (req, res) => {
  const utilisateur = req.session.user;
  console.log("🧑 Utilisateur dans session:", utilisateur);


  if (!utilisateur) {
    return res.status(401).json({ message: "Utilisateur non connecté" });
  }

  try {
    let stocks;

    if (utilisateur.role === "admin") {
      stocks = await stockModel.getAllStocks();
    } else if (utilisateur.id_magasin) {
      stocks = await stockModel.getStocksByMagasin(utilisateur.id_magasin);
    } else {
      return res.status(400).json({ message: "Magasin non défini" });
    }

    res.json(stocks);
  } catch (err) {
    console.error("Erreur getStocks:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.upsertStock = async (req, res) => {
  const utilisateur = req.session.user;

  if (!utilisateur || !utilisateur.id_magasin) {
    return res.status(401).json({ message: "Utilisateur non connecté ou magasin non défini" });
  }

  const { id_produit, quantite, seuil_alerte } = req.body;

  if (!id_produit || quantite === undefined || seuil_alerte === undefined) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  try {
    await stockModel.upsertStock({
      id_produit,
      id_magasin: utilisateur.id_magasin,
      quantite,
      seuil_alerte
    });
    res.json({ message: "Stock mis à jour" });
  } catch (err) {
    console.error("Erreur upsertStock:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getNotifications = async (req, res) => {
  const utilisateur = req.session.user;

  if (!utilisateur?.id_magasin) {
    return res.status(401).json({ error: "Utilisateur non authentifié ou sans magasin" });
  }

  try {
    const stocksAlerte = await stockModel.getStocksEnAlerteByMagasin(utilisateur.id_magasin);
    res.json(stocksAlerte);
  } catch (err) {
    console.error("Erreur récupération notifications :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
exports.getStocksByMagasinId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID de magasin manquant" });
  }

  try {
    const stocks = await stockModel.getStocksByMagasin(id);
    res.json(stocks);
  } catch (err) {
    console.error("Erreur getStocksByMagasinId:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await stockModel.getAllStocks();
    res.json(stocks);
  } catch (err) {
    console.error("Erreur getAllStocks:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};