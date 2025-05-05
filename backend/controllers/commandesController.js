const db = require('../models/db');

// 1. Créer une commande avec des produits
exports.creerCommande = async (req, res) => {
    const { id_fournisseur, produits } = req.body;
    try {
        // Créer la commande
        const [result] = await db.query(
            'INSERT INTO commandes (id_fournisseur, date_commande) VALUES (?, CURDATE())',
            [id_fournisseur]
        );
        const id_commande = result.insertId;

        // Insérer les produits dans contenu_commande
        for (const produit of produits) {
            await db.query(
                'INSERT INTO contenu_commande (id_commande, id_produit, quantite) VALUES (?, ?, ?)',
                [id_commande, produit.id_produit, produit.quantite]
            );
        }

        res.status(201).json({ message: 'Commande créée', id_commande });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création de la commande', details: err });
    }
};

// 2. Lister toutes les commandes
exports.listerCommandes = async (req, res) => {
    try {
        const [commandes] = await db.query(`
            SELECT c.id_commande, c.date_commande, c.status, f.nom AS fournisseur
            FROM commandes c
            JOIN fournisseurs f ON c.id_fournisseur = f.id_fournisseur
            ORDER BY c.date_commande DESC
        `);

        // Récupérer les produits de chaque commande
        for (const commande of commandes) {
            const [produits] = await db.query(`
                SELECT p.nom, cc.quantite
                FROM contenu_commande cc
                JOIN produits p ON cc.id_produit = p.id_produit
                WHERE cc.id_commande = ?
            `, [commande.id_commande]);
            commande.produits = produits;
        }

        res.json(commandes);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes', details: err });
    }
};

// 3. Supprimer une commande
exports.supprimerCommande = async (req, res) => {
    const id = req.params.id;
    try {
        await db.query('DELETE FROM contenu_commande WHERE id_commande = ?', [id]);
        await db.query('DELETE FROM commandes WHERE id_commande = ?', [id]);
        res.json({ message: 'Commande supprimée' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la commande', details: err });
    }
};

// 4. Modifier le statut d'une commande
exports.mettreAJourStatut = async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    try {
        await db.query('UPDATE commandes SET status = ? WHERE id_commande = ?', [status, id]);
        res.json({ message: 'Statut mis à jour' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut', details: err });
    }
};
