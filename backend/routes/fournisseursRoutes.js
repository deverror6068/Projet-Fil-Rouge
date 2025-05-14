const express = require('express');
const router = express.Router();
const fournisseursController = require('../controllers/fournisseursController');
const requireLogin = require("../middlewares/requireLogin");

// Routes CRUD
router.get('/',requireLogin, fournisseursController.getFournisseurs);
router.post('/',requireLogin, fournisseursController.ajouterFournisseur);
router.put('/:id',requireLogin, fournisseursController.mettreAJourFournisseur);
router.delete('/:id',requireLogin, fournisseursController.supprimerFournisseur);

module.exports = router;
