const db = require('../models/db');

const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const utilisateur = rows[0];

        const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Auth ok : stocker dans la session
        req.session.user = {
            id: utilisateur.id_utilisateur,
            role: utilisateur.role,
            nom: utilisateur.nom,
            email: utilisateur.email
        };

        res.json({ message: 'Connexion réussie', user: req.session.user });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
};


exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        }
        res.clearCookie('connect.sid'); // Important : efface le cookie de session
        res.json({ message: 'Déconnexion réussie' });
    });
};
