const express = require('express');
const router = express.Router();
const produitsController = require('../controllers/produitsController');
const requireLogin = require("../middlewares/requireLogin");

// Routes
router.get('/', requireLogin, produitsController.getProduits);
router.post('/',requireLogin, produitsController.ajouterProduit);
router.delete('/:id',requireLogin, produitsController.supprimerProduit);
router.put('/:id',requireLogin, produitsController.mettreAJourProduit); // Pour être complet

module.exports = router;
