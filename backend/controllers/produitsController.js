const db = require('../models/db');

// GET tous les produits
exports.getProduits = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, pf.id_fournisseur, pf.prix AS prix_achat, pf.reference_fournisseur
            FROM produits p
            LEFT JOIN produits_fournisseurs pf ON p.id_produit = pf.id_produit
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
};

// POST nouveau produit
// POST - Ajouter un produit + relation fournisseur
exports.ajouterProduit = async (req, res) => {
    const { nom, description, prix, quantite, id_vendeur, id_fournisseur, reference_fournisseur, prix_achat } = req.body;
    const conn = await db.getConnection(); // si vous utilisez pool
    try {
        await conn.beginTransaction();

        const [result] = await conn.query(
            'INSERT INTO produits (nom, description, prix, quantite, id_vendeur) VALUES (?, ?, ?, ?, ?)',
            [nom, description, prix, quantite, id_vendeur]
        );

        const id_produit = result.insertId;

        await conn.query(
            'INSERT INTO produits_fournisseurs (id_produit, id_fournisseur, prix, reference_fournisseur) VALUES (?, ?, ?, ?)',
            [id_produit, id_fournisseur, prix, reference_fournisseur]
        );

        await conn.commit();
        res.status(201).json({ message: 'Produit et relation fournisseur créés avec succès' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: 'Erreur lors de la création du produit avec fournisseur', details: err });
    } finally {
        conn.release();
    }
};


// DELETE un produit
exports.supprimerProduit = async (req, res) => {
    const id = req.params.id;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        await conn.query('DELETE FROM produits_fournisseurs WHERE id_produit = ?', [id]);
        await conn.query('DELETE FROM produits WHERE id_produit = ?', [id]);

        await conn.commit();
        res.json({ message: 'Produit et relation fournisseur supprimés' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: 'Erreur lors de la suppression', details: err });
    } finally {
        conn.release();
    }
};


// PUT mise à jour d’un produit
exports.mettreAJourProduit = async (req, res) => {
    const { id } = req.params;
    const { nom, description, prix, quantite, id_vendeur, id_fournisseur, reference_fournisseur, prix_achat } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        await conn.query(
            `UPDATE produits SET nom = ?, description = ?, prix = ?, quantite = ?, id_vendeur = ? WHERE id_produit = ?`,
            [nom, description, prix, quantite, id_vendeur, id]
        );

        // Relation fournisseur
        await conn.query(
            `UPDATE produits_fournisseurs SET id_fournisseur = ?, reference_fournisseur = ?, prix = ? WHERE id_produit = ?`,
            [id_fournisseur, reference_fournisseur, prix, id]
        );

        await conn.commit();
        res.json({ message: 'Produit et relation fournisseur mis à jour' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: 'Erreur lors de la mise à jour', details: err });
    } finally {
        conn.release();
    }
};

