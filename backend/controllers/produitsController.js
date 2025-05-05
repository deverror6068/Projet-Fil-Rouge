const db = require('../models/db');

// GET tous les produits
exports.getProduits = async (req, res) => {
    try {
        const [produits] = await db.query('SELECT * FROM produits');
        res.json(produits);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
};

// POST nouveau produit
exports.ajouterProduit = async (req, res) => {
    const { nom, description, prix, quantite, id_vendeur, id_fournisseur, reference_fournisseur } = req.body;
    try {
        await db.query(
            `INSERT INTO produits (nom, description, prix, quantite, id_vendeur, id_fournisseur, reference_fournisseur) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nom, description, prix, quantite, id_vendeur, id_fournisseur, reference_fournisseur]
        );
        res.status(201).json({ message: 'Produit ajouté avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de l’ajout du produit' });
    }
};

// DELETE un produit
exports.supprimerProduit = async (req, res) => {
    const id = req.params.id;
    try {
        await db.query('DELETE FROM produits WHERE id_produit = ?', [id]);
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
    }
};

// PUT mise à jour d’un produit
exports.mettreAJourProduit = async (req, res) => {
    const { id } = req.params;
    const { nom, description, prix, quantite, id_vendeur, id_fournisseur, reference_fournisseur } = req.body;
    try {
        await db.query(
            `UPDATE produits 
             SET nom = ?, description = ?, prix = ?, quantite = ?, id_vendeur = ?, id_fournisseur = ?, reference_fournisseur = ? 
             WHERE id_produit = ?`,
            [nom, description, prix, quantite, id_vendeur, id_fournisseur, reference_fournisseur, id]
        );
        res.json({ message: 'Produit mis à jour avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
    }
};
