// routes/utilisateurRoutes.js
const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController.js');
const requireLogin = require("../middlewares/requireLogin");

router.get('/',requireLogin, utilisateurController.getAllUtilisateurs);

router.post('/',requireLogin, utilisateurController.createUtilisateur);

// Supprimer un utilisateur
router.delete('/:id',requireLogin, utilisateurController.deleteUtilisateur);

router.put('/:id',requireLogin, utilisateurController.updateUtilisateur);


// Mettre à jour un utilisateur

module.exports = router;
