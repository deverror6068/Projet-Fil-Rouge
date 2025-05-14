const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const inscriptionController = require('../controllers/inscriptionController');

router.post('/inscription', inscriptionController.inscrire);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get("/verifier-session", (req, res) => {
    if (req.session && req.session.user) {
        res.json({ utilisateur: req.session.user });
    } else {
        res.status(401).json({ message: "Non connecté" });
    }
});

module.exports = router;
