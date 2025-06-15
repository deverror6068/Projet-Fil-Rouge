// const express = require('express');
// const router = express.Router();
// const fournisseursController = require('../controllers/fournisseursController');
// // const requireLogin = require("../middlewares/requireLogin");

// // Routes CRUD
// router.get('/',  fournisseursController.getFournisseurs);
// router.post('/', fournisseursController.ajouterFournisseur);
// router.put('/:id', fournisseursController.mettreAJourFournisseur);
// router.delete('/:id', fournisseursController.supprimerFournisseur);
// router.get('/:id/produitFournisseur', fournisseursController.getProduitsByFournisseur);
// module.exports = router;

const express = require('express');
const router = express.Router();
const fournisseursController = require('../controllers/fournisseursController');
const controller = require('../controllers/produitsFournisseursController');
const requireLogin = require("../middlewares/requireLogin");

// Routes CRUD
router.get('/',requireLogin, fournisseursController.getFournisseurs);
router.get('/fournisseur/:id_fournisseur',requireLogin, controller.listerProduitsParFournisseur);

router.get('/:id',requireLogin, fournisseursController.getFournisseursById);
router.post('/',requireLogin, fournisseursController.ajouterFournisseur);
router.put('/:id',requireLogin, fournisseursController.mettreAJourFournisseur);
router.delete('/:id',requireLogin, fournisseursController.supprimerFournisseur);

module.exports = router;
