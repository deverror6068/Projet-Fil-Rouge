// routes/searchRoute.js
const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.get("/", async (req, res) => {
  const query = req.query.q || "";
  const likeQuery = `%${query}%`;

  try {
    const [produits] = await db.query("SELECT id_produit AS id, nom FROM produits WHERE nom LIKE ?", [likeQuery]);
    const [fournisseurs] = await db.query("SELECT id_fournisseur AS id, nom FROM fournisseurs WHERE nom LIKE ?", [likeQuery]);
    const [commandes] = await db.query("SELECT id_commande AS id, date_commande FROM commandes WHERE id_commande LIKE ?", [likeQuery]);

    res.json({
      produits,
      fournisseurs,
      commandes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la recherche." });
  }
});

module.exports = router;
