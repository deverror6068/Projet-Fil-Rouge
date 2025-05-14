const express = require('express');
const router = express.Router();
const commandesController = require('../controllers/processus-commandesController');
const requireLogin = require("../middlewares/requireLogin");

router.post('/',requireLogin, commandesController.ajouterCommande);
router.get('/',requireLogin, commandesController.getCommandes);
router.get('/search/:id', requireLogin,commandesController.getCommandeById);
router.delete('/:id',requireLogin, commandesController.supprimerCommande);
router.put('/:id', requireLogin,commandesController.mettreAJourCommande);
router.get('/mes-commandes', requireLogin, commandesController.listerCommandesDuVendeur);

module.exports = router;
