const express = require('express');
const router = express.Router();
const commandesController = require('../controllers/commandesController');

// Créer une commande avec produits
router.post('/', commandesController.creerCommande);

// Lister toutes les commandes (avec fournisseurs et produits)
router.get('/', commandesController.listerCommandes);

// Supprimer une commande (et ses contenus)
router.delete('/:id', commandesController.supprimerCommande);

// Mettre à jour le statut d'une commande
router.put('/:id/statut', commandesController.mettreAJourStatut);

module.exports = router;
