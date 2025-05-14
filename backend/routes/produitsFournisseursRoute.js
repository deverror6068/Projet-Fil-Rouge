const express = require('express');
const router = express.Router();
const controller = require('../controllers/produitsFournisseursController');
const requireLogin = require("../middlewares/requireLogin");

router.post('/',requireLogin, controller.ajouterRelation);
router.get('/',requireLogin, controller.listerRelations);
router.get('/:id',requireLogin, controller.getRelation);
router.put('/:id',requireLogin, controller.modifierRelation);
router.delete('/:id',requireLogin, controller.supprimerRelation);
router.get('/fournisseur/:id_fournisseur',requireLogin, controller.listerProduitsParFournisseur);
router.get('/produit/:id_produit',requireLogin,controller.listerFournisseursParProduit);


module.exports = router;
