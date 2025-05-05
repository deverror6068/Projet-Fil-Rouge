const express = require('express');
const router = express.Router();
const produitsController = require('../controllers/produitsController');

// Routes
router.get('/', produitsController.getProduits);
router.post('/', produitsController.ajouterProduit);
router.delete('/:id', produitsController.supprimerProduit);
router.put('/:id', produitsController.mettreAJourProduit); // Pour être complet

module.exports = router;
