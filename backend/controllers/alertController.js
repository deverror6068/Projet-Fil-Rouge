const db = require('../models/db');

 exports.checkalert = async (req, res) => {
    try {
        const [produits] = await db.query(
            'SELECT * FROM produits WHERE quantite <= qnt_min'
        );

        res.status(200).json(produits);
    } catch (error) {
        console.error("Erreur récupération alertes :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};