const magasinModel = require("../models/magasinModel");
const db = require("../models/db");

exports.getMagasins = async (req, res) => {
  try {
    const magasins = await magasinModel.getAllMagasins();
    res.json(magasins);
  } catch (err) {
    console.error("Erreur getMagasins:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.createMagasin = async (req, res) => {
  try {
    await magasinModel.createMagasin(req.body);
    res.status(201).json({ message: "Magasin créé" });
  } catch (err) {
    console.error("Erreur createMagasin:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// backend/controllers/magasinsController.js


exports.getAllMagasins = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM magasins");
    res.json(rows);
  } catch (err) {
    console.error("Erreur getAllMagasins:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
