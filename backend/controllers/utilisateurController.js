// controllers/utilisateurController.js
const db = require('../models/db');

exports.getAllUtilisateurs = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM utilisateurs');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};


exports.createUtilisateur = async (req, res) => {
    const { nom, prenom, email, mot_de_passe, role, statut } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, statut) VALUES (?, ?, ?, ?, ?, ?)',
            [nom, prenom, email, mot_de_passe, role, statut]
        );
        res.status(201).json({ message: 'Utilisateur créé', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création', error });
    }
};

// 3. Supprimer un utilisateur par son ID
exports.deleteUtilisateur = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM utilisateurs WHERE id_utilisateur = ?', [id]);
        res.json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression', error });
    }
};

// 4. Mettre à jour un utilisateur
exports.updateUtilisateur = async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, mot_de_passe, role, statut } = req.body;
    try {
        await db.query(
            'UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, mot_de_passe = ?, role = ?, statut = ? WHERE id_utilisateur = ?',
            [nom, prenom, email, mot_de_passe, role, statut, id]
        );
        res.json({ message: 'Utilisateur mis à jour' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour', error });
    }
};