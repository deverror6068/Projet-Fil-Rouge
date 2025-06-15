// const express = require('express');
// const router = express.Router();
// const commandesController = require('../controllers/processus-commandesController');
// const requireLogin = require("../middlewares/requireLogin");

// router.post('/',requireLogin, commandesController.ajouterCommande);
// router.get('/',requireLogin, commandesController.getCommandes);
// router.get('/search/:id', requireLogin,commandesController.getCommandeById);
// router.delete('/:id',requireLogin, commandesController.supprimerCommande);
// router.put('/:id', requireLogin,commandesController.mettreAJourCommande);
// router.get('/mes-commandes', requireLogin, commandesController.listerCommandesDuVendeur);

// module.exports = router;

const express = require('express');
const router = express.Router();
const commandesController = require('../controllers/processus-commandesController');
const requireLogin = require("../middlewares/requireLogin");
const { route } = require('./alertRoutes');

router.post('/',requireLogin, commandesController.ajouterCommande);
router.get('/',requireLogin, commandesController.getCommandes);
router.get('/search/:id', requireLogin,commandesController.getCommandeById);
router.delete('/:id',requireLogin, commandesController.supprimerCommande);
// router.put('/:id', requireLogin,commandesController.mettreAJourCommande);
router.get('/mes-commandes', requireLogin, commandesController.listerCommandesDuVendeur);
router.put('/statut/:id',requireLogin, commandesController.mettreAJourStatut);
router.get('/count/:id_commande', requireLogin, commandesController.getNombreProduitsParCommande);
router.get('/date', requireLogin, commandesController.getCommandeDates);
//recuperer les commande d'un user
router.get('/user/:id_user', requireLogin, commandesController.getCommandesByUser);
module.exports = router;