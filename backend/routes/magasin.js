const express = require('express');
const router = express.Router();
const magasinController = require('../controllers/magasinController');
const requireLogin = require("../middlewares/requireLogin");
// Routes CRUD pour les magasins
// router.get('/', requireLogin, magasinsController.getMagasins);
// router.post('/', requireLogin, magasinController.ajouterMagasin);
// router.put('/:id', requireLogin, magasinController.mettreAJourMagasin);
// router.delete('/:id', requireLogin, magasinController.supprimerMagasin);
router.get('/', requireLogin, magasinController.getAllMagasins);
module.exports = router;