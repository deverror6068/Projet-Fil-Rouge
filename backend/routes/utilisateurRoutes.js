// routes/utilisateurRoutes.js
const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController.js');

router.get('/', utilisateurController.getAllUtilisateurs);

router.post('/', utilisateurController.createUtilisateur);

// Supprimer un utilisateur
router.delete('/:id', utilisateurController.deleteUtilisateur);

router.put('/:id', utilisateurController.updateUtilisateur);


// Mettre à jour un utilisateur

module.exports = router;
