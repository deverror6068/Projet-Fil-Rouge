// routes/notifications.js
const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.get("/ruptures-stock", async (req, res) => {
  try {
    const [rupture] = await db.query(`SELECT * FROM produits WHERE quantite <= 0`);
    const [bientot] = await db.query(`SELECT * FROM produits WHERE quantite = 1`);
    res.json({ rupture, bientot });
  } catch (error) {
    console.error("Erreur rupture stock:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
