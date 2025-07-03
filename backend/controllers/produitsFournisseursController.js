
const db = require('../models/db');
const produitsController = require("./produitsController");

// ➕ CREATE
exports.ajouterRelation = async (req, res) => {
    const { id_produit, id_fournisseur, prix, reference_fournisseur } = req.body;
    try {
        await db.query(
            `INSERT INTO produits_fournisseurs (id_produit, id_fournisseur, prix, reference_fournisseur)
             VALUES (?, ?, ?, ?)`,
            [id_produit, id_fournisseur, prix, reference_fournisseur]
        );
        res.status(201).json({ message: 'Relation ajoutée avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de l’ajout de la relation', details: err });
    }
};

// 📄 READ (toutes les relations)
exports.listerRelations = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM produits_fournisseurs');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération', details: err });
    }
};

// 📄 READ (par id_pf)
exports.getRelation = async (req, res) => {
    const { id } = req.params;
    try {

        const [existing] = await db.query(
            'SELECT * FROM produits_fournisseurs WHERE id_pf = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: "Relation non trouvée : id fournisseur inexistante" });
        }

        const [rows] = await db.query('SELECT * FROM produits_fournisseurs WHERE id_pf = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Erreur lors de la recherche ' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération', details: err });
    }
};

// ✏️ UPDATE
exports.modifierRelation = async (req, res) => {
    const { id } = req.params;
    const { id_produit, id_fournisseur, reference_fournisseur, prix } = req.body;
    try {

        const [existing] = await db.query(
            'SELECT * FROM produits_fournisseurs WHERE id_pf = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: "Relation non trouvée, mise à jour impossible." });
        }

        await db.query(
            `UPDATE produits_fournisseurs
             SET id_produit = ?, id_fournisseur = ?, reference_fournisseur = ?, prix = ?
             WHERE id_pf = ?`,
            [id_produit, id_fournisseur, reference_fournisseur, prix, id]
        );
        res.json({ message: 'Relation mise à jour' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour', details: err });
    }
};

// ❌ DELETE
exports.supprimerRelation = async (req, res) => {
    const { id } = req.params;
    try {
        const [existing] = await db.query(
            'SELECT * FROM produits_fournisseurs WHERE id_pf = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: "Relation non trouvée, suppression impossible." });
        }

        await db.query('DELETE FROM produits_fournisseurs WHERE id_pf = ?', [id]);
        res.json({ message: 'Relation supprimée' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression', details: err });
    }
};


// 🔍 Liste des produits pour un fournisseur donné
exports.listerProduitsParFournisseur = async (req, res) => {
    const { id_fournisseur } = req.params;
    try {
        const [existing] = await db.query(
            'SELECT * FROM produits_fournisseurs WHERE id_fournisseur = ?',
            [id_fournisseur]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: "Fournisseur introuvable" });
        }

        const [rows] = await db.query(
            `SELECT pf.*, p.nom AS nom_produit, p.description, p.prix AS prix_vente
             FROM produits_fournisseurs pf
             JOIN produits p ON pf.id_produit = p.id_produit
             WHERE pf.id_fournisseur = ?`,
            [id_fournisseur]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des produits du fournisseur' });
    }
};

// 🔍 Liste des fournisseurs pour un produit donné
exports.listerFournisseursParProduit = async (req, res) => {
    const { id_produit } = req.params;

    const [produit] = await db.query(
        'SELECT * FROM produits WHERE id_produit = ?',
        [id_produit]
    );
    if (produit.length === 0) {
        return res.status(404).json({ error: 'Produit non trouvé' });
    }
    try {
        const [rows] = await db.query(
            `SELECT pf.*, f.nom AS nom_fournisseur, f.email, f.telephone
             FROM produits_fournisseurs pf
             JOIN fournisseurs f ON pf.id_fournisseur = f.id_fournisseur
             WHERE pf.id_produit = ?`,
            [id_produit]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des fournisseurs du produit' });
    }
};





