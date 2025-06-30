const db = require('../models/db');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        // 1. Récupérer l'utilisateur par email
        const [rows] = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);

        // 2. Vérifier si l'utilisateur existe
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const utilisateur = rows[0];
        // 4. Vérifier le mot de passe
        const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // 5. Authentification réussie → stocker dans la session
        req.session.user = {
            id: utilisateur.id_utilisateur,
            role: utilisateur.role,
            nom: utilisateur.nom,
            email: utilisateur.email,
            id_magasin: utilisateur.id_magasin || null
        };

        res.json({ message: 'Connexion réussie', user: req.session.user });
        console.log("Tentative de connexion avec :", email);
        console.log("Utilisateur trouvé :", utilisateur);
        console.log("Mot de passe correct ?", isMatch);

    } catch (err) {
        console.error("🔥 Erreur lors de la connexion :", err);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        }
        res.clearCookie('connect.sid'); // Nettoyer le cookie
        res.json({ message: 'Déconnexion réussie' });
    });
};
