

const express = require('express');
const router = express.Router();
const commandesController = require('../controllers/commandesController');
const contenuController = require('../controllers/contenuController');
const requireLogin = require("../middlewares/requireLogin");

// Créer une commande avec produits
router.post('/', requireLogin, commandesController.creerCommande);

// Lister toutes les commandes (avec fournisseurs et produits)
router.get('/',requireLogin, commandesController.listerCommandes);

// Supprimer une commande (et ses contenus)
router.delete('/:id',requireLogin, commandesController.supprimerCommande);

// Mettre à jour le statut d'une commande
router.put('/statut/:id',requireLogin, commandesController.mettreAJourStatut);

// Obtenir les détails d'une commande
router.get('/:id', requireLogin, contenuController.getContenuById);
module.exports = router;
