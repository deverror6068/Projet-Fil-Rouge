const db = require('../models/db');

// POST /commandes - Créer une commande avec ses lignes
exports.ajouterCommande = async (req, res) => {
    const { commande, lignes } = req.body;

    if (!commande || !Array.isArray(lignes) || lignes.length === 0) {
        return res.status(400).json({ message: "Requête invalide : données manquantes" });
    }

    const { id_fournisseur, status } = commande;

    // ✅ Récupération du vendeur à partir de la session
    const vendeur_id = req.session.user?.id; // ou req.session.utilisateur.id selon ta structure

    if (!vendeur_id) {
        return res.status(401).json({ message: "Non autorisé : vendeur non identifié" });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // ✅ Insertion de la commande avec vendeur_id
        const [result] = await connection.query(
            `INSERT INTO commandes (id_fournisseur, date_commande, status, vendeur_id)
             VALUES (?, CURRENT_DATE(), ?, ?)`,
            [id_fournisseur, status, vendeur_id]
        );

        const id_commande = result.insertId;

        // Insertion des lignes de commande
        for (const ligne of lignes) {
            const { id_produit, quantite, prix_unitaire } = ligne;
            await connection.query(
                `INSERT INTO contenu_commande (id_commande, id_produit, quantite, prix_unitaire)
                 VALUES (?, ?, ?, ?)`,
                [id_commande, id_produit, quantite, prix_unitaire]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Commande et lignes créées avec succès', id_commande });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de la commande', error });
    } finally {
        connection.release();
    }
};

exports.getCommandes = async (req, res) => {
    try {
        const [commandes] = await db.query(`
            SELECT c.id_commande, c.date_commande, c.status, c.id_fournisseur, f.nom AS fournisseur
            FROM commandes c
            JOIN fournisseurs f ON c.id_fournisseur = f.id_fournisseur
            ORDER BY c.date_commande DESC
        `);

        for (let commande of commandes) {
            const [lignes] = await db.query(`
                SELECT cc.id_produit, p.nom AS produit, cc.quantite, cc.prix_unitaire
                FROM contenu_commande cc
                JOIN produits p ON cc.id_produit = p.id_produit
                WHERE cc.id_commande = ?
            `, [commande.id_commande]);

            commande.lignes = lignes;
        }

        res.json(commandes);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
};

// 3. Détail d'une commande
exports.getCommandeById = async (req, res) => {
    const { id } = req.params;
    try {
        const [commandes] = await db.query(`
            SELECT * FROM commandes WHERE id_commande = ?
        `, [id]);

        if (commandes.length === 0) {
            return res.status(404).json({ error: 'Commande introuvable' });
        }

        const commande = commandes[0];

        const [lignes] = await db.query(`
            SELECT cc.id_produit, p.nom AS produit, cc.quantite, cc.prix_unitaire
            FROM contenu_commande cc
            JOIN produits p ON cc.id_produit = p.id_produit
            WHERE cc.id_commande = ?
        `, [id]);

        commande.lignes = lignes;
        res.json(commande);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la commande' });
    }
};

// 4. Supprimer une commande + ses lignes
exports.supprimerCommande = async (req, res) => {
    const { id } = req.params;

    const connexion = await db.getConnection();
    try {
        await connexion.beginTransaction();

        await connexion.query('DELETE FROM contenu_commande WHERE id_commande = ?', [id]);
        await connexion.query('DELETE FROM commandes WHERE id_commande = ?', [id]);

        await connexion.commit();
        res.json({ message: 'Commande supprimée avec ses lignes' });
    } catch (err) {
        await connexion.rollback();
        res.status(500).json({ error: 'Erreur lors de la suppression de la commande' });
    } finally {
        connexion.release();
    }
};

// PUT mise à jour d'une commande et ses lignes
exports.mettreAJourCommande = async (req, res) => {
    const { id } = req.params;
    const { id_fournisseur, status, lignes } = req.body;

    const connexion = await db.getConnection();
    try {
        await connexion.beginTransaction();

        // Mise à jour de la commande
        await connexion.query(
            `UPDATE commandes SET id_fournisseur = ?, status = ? WHERE id_commande = ?`,
            [id_fournisseur, status, id]
        );

        // Suppression des anciennes lignes
        await connexion.query(
            `DELETE FROM contenu_commande WHERE id_commande = ?`,
            [id]
        );

        // Réinsertion des lignes
        for (const ligne of lignes) {
            const { id_produit, quantite, prix_unitaire } = ligne;
            await connexion.query(
                `INSERT INTO contenu_commande (id_commande, id_produit, quantite, prix_unitaire) VALUES (?, ?, ?, ?)`,
                [id, id_produit, quantite, prix_unitaire]
            );
        }

        await connexion.commit();
        res.json({ message: 'Commande mise à jour avec succès' });
    } catch (err) {
        await connexion.rollback();
        res.status(500).json({ error: 'Erreur lors de la mise à jour', details: err.message });
    } finally {
        connexion.release();
    }
};


exports.listerCommandesDuVendeur = async (req, res) => {
    const vendeurId = req.session.user?.id;

    if (!vendeurId) {
        return res.status(401).json({ message: "Non autorisé : vendeur non identifié" });
    }

    try {
        const [rows] = await db.query(
            `SELECT c.id_commande, c.date_commande, c.status, f.id_fournisseur
             FROM commandes c
             JOIN fournisseurs f ON c.id_fournisseur = f.id_fournisseur
             WHERE c.vendeur_id = ?`,
            [vendeurId]
        );

        res.json(rows);
    } catch (error) {
        console.error("Erreur lors du listing des commandes vendeur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
