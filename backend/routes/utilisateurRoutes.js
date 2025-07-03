// // routes/utilisateurRoutes.js
// const express = require('express');
// const router = express.Router();
// const utilisateurController = require('../controllers/utilisateurController.js');
// const requireLogin = require("../middlewares/requireLogin");
// router.get('/me', utilisateurController.getUtilisateurConnecte);

// router.get('/',requireLogin, utilisateurController.getAllUtilisateurs);

// router.post('/',requireLogin, utilisateurController.createUtilisateur);

// // Supprimer un utilisateur
// router.delete('/:id',requireLogin, utilisateurController.deleteUtilisateur);

// router.put('/:id',requireLogin, utilisateurController.updateUtilisateur);


// // Mettre à jour un utilisateur

// module.exports = router;


// routes/utilisateurRoutes.js
const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController.js');
const requireLogin = require("../middlewares/requireLogin");

router.get('/',requireLogin, utilisateurController.getAllUtilisateurs);

router.get('/me', requireLogin, utilisateurController.getUtilisateurConnecte);

router.post('/',requireLogin, utilisateurController.createUtilisateur);


router.post('/register', utilisateurController.RegisterUser);

// Supprimer un utilisateur
router.delete('/:id',requireLogin, utilisateurController.deleteUtilisateur);

router.put('/:id',requireLogin, utilisateurController.updateUtilisateur);
router.get( '/connexion/:id',requireLogin,utilisateurController.checkStatut)
router.get( '/number',requireLogin,utilisateurController.getNombreUtilisateur)

router.get( '/connexion-history/:id',requireLogin,utilisateurController.checkHistory)

// Mettre à jour un utilisateur

module.exports = router;