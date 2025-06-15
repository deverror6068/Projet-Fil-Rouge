const express = require("express");
const router = express.Router();
const db = require("../models/db");
const stockController = require("../controllers/stockController");
const requireLogin = require("../middlewares/requireLogin");


router.get("/mon-magasin", requireLogin, stockController.getStocksByMagasin);
router.get("/", stockController.getStocksByMagasin);
// router.get("/magasin/:id", requireLogin, stockController.getStocksByMagasin);

// router.get("/magasin/:id", stockController.getStocksByMagasin);
// router.get("/magasin/:id", stockController.getStocksByMagasin);

// Créer ou mettre à jour un stock (upsert)
router.post("/upsert", stockController.upsertStock);
// router.get("/mon-magasin", stockController.getStocksByMagasin);

module.exports = router;

