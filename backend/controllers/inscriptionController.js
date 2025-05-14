const db = require('../models/db');
const bcrypt = require('bcrypt');

exports.inscrire = async (req, res) => {
    const { nom, email, mot_de_passe, role } = req.body;

    try {
        const [exist] = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        if (exist.length > 0) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé' });
        }

        const hash = await bcrypt.hash(mot_de_passe, 10);
        await db.query(
            'INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
            [nom, email, hash, role]
        );
        res.status(201).json({ message: 'Utilisateur inscrit avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de l’inscription' });
    }
};