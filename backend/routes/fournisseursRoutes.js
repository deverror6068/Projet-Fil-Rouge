const express = require('express');
const router = express.Router();
const fournisseursController = require('../controllers/fournisseursController');

// Routes CRUD
router.get('/', fournisseursController.getFournisseurs);
router.post('/', fournisseursController.ajouterFournisseur);
router.put('/:id', fournisseursController.mettreAJourFournisseur);
router.delete('/:id', fournisseursController.supprimerFournisseur);

module.exports = router;
