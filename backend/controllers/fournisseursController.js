

const db = require('../models/db');

// 🔍 GET - Lister tous les fournisseurs
exports.getFournisseurs = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM fournisseurs');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des fournisseurs' });
    }
};

exports.getFournisseursById = async (req, res,) => {
    try {
        const {id} = req.params
        console.log(id)
        const [rows] = await db.query('SELECT * FROM fournisseurs WHERE id_fournisseur = ?',
        [id]
        );
        res.json(rows);
    } catch (err) {
        console.log("err",err)
        res.status(500).json({ error: 'Erreur lors de la récupération des fournisseurs' });
    }
};

// ➕ POST - Ajouter un fournisseur
exports.ajouterFournisseur = async (req, res) => {
    const { nom, adresse, email, telephone } = req.body;
    console.log("🔽 Fournisseur à ajouter :", req.body);
    try {
        await db.query(
            'INSERT INTO fournisseurs (nom, adresse, email, telephone) VALUES (?, ?, ?, ?)',
            [nom, adresse, email, telephone]
        );
        res.status(201).json({ message: 'Fournisseur ajouté avec succès' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// ✏️ PUT - Modifier un fournisseur
exports.mettreAJourFournisseur = async (req, res) => {
    const { id } = req.params;
    const { nom, adresse, email, telephone } = req.body;
    try {
        await db.query(
            'UPDATE fournisseurs SET nom = ?, adresse = ?, email = ?, telephone = ? WHERE id_fournisseur = ?',
            [nom, adresse, email, telephone, id]
        );
        res.json({ message: 'Fournisseur mis à jour avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du fournisseur' });
    }
};

// ❌ DELETE - Supprimer un fournisseur
exports.supprimerFournisseur = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM fournisseurs WHERE id_fournisseur = ?', [id]);
        res.json({ message: 'Fournisseur supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du fournisseur' });
    }
};
//recuperer le nombre de fournisseurs
exports.getNombreFournisseurs = async (req, res) => {
  const [[{ nb }]] = await db.query("SELECT COUNT(*) as nb FROM fournisseurs");
  return nb;
};