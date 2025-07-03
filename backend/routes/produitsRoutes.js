// // const express = require('express');
// // const router = express.Router();
// // const produitsController = require('../controllers/produitsController');
// // const requireLogin = require("../middlewares/requireLogin");

// // // Routes
// // router.get('/', requireLogin, produitsController.getProduits);
// // router.post('/',requireLogin, produitsController.ajouterProduit);
// // router.delete('/:id',requireLogin, produitsController.supprimerProduit);
// // router.put('/:id',requireLogin, produitsController.mettreAJourProduit); // Pour être complet

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const produitsController = require('../controllers/produitsController');

// // Récupérer tous les produits
// router.get('/', produitsController.getProduits);

// // Ajouter un nouveau produit
// router.post('/', produitsController.ajouterProduit);

// // Mettre à jour un produit
// router.put('/:id', produitsController.mettreAJourProduit);

// // Supprimer un produit
// router.delete('/:id', produitsController.supprimerProduit);

// module.exports = router;

const express = require('express');
const router = express.Router();
const produitsController = require('../controllers/produitsController');
const requireLogin = require("../middlewares/requireLogin");
const db = require("../models/db");

// Routes
router.get('/', requireLogin, produitsController.getProduits);
router.get('/list', requireLogin, produitsController.getListProduits);

router.post('/',requireLogin, produitsController.ajouterProduit);
router.delete('/:id',requireLogin, produitsController.supprimerProduit);
router.put('/:id',requireLogin, produitsController.mettreAJourProduit); // Pour être complet
router.post('/simple/',requireLogin, produitsController.ajouterProduitSimple);

router.put("/:id/seuil", produitsController.setSeuilMin);
// Dans routes/produitsRoutes.js
router.get('/:id/quantite', produitsController.getQuantiteDisponible);
router.get("/rupture", produitsController.getProduitsEnRupture);

module.exports = router;

