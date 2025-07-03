

const db = require('../models/db');

exports.getListProduits  = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT *  FROM produits ;
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
};

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


exports.ajouterProduitSimple = async (req, res) => {
    const { nom, description, prix, quantite, id_vendeur } = req.body;
    const conn = await db.getConnection();

    try {
        const [result] = await conn.query(
            'INSERT INTO produits (nom, description, prix, quantite, id_vendeur) VALUES (?, ?, ?, ?, ?)',
            [nom, description, prix, quantite, id_vendeur]
        );

        const id_produit = result.insertId;

        res.status(201).json({
            message: '✅ Produit créé avec succès',
            id_produit,
            produit: { nom, description, prix, quantite, id_vendeur }
        });
    } catch (err) {
        console.error("Erreur lors de l'ajout simple du produit :", err);
        res.status(500).json({ error: "❌ Erreur lors de la création du produit", details: err });
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
    const {
        nom,
        description,
        prix,
        quantite,
        id_vendeur,
        id_fournisseur,
        reference_fournisseur,
        prix_achat
    } = req.body;

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        // 🔧 Mise à jour du produit
        await conn.query(
            `UPDATE produits SET nom = ?, description = ?, prix = ?, quantite = ?, id_vendeur = ? WHERE id_produit = ?`,
            [nom, description, prix, quantite, id_vendeur, id]
        );

        // 🔍 Vérifier s'il existe une relation fournisseur pour ce produit
        const [rows] = await conn.query(
            `SELECT * FROM produits_fournisseurs WHERE id_produit = ?`,
            [id]
        );

        if (rows.length > 0) {
            // 🔁 Mise à jour de la relation seulement si elle existe
            await conn.query(
                `UPDATE produits_fournisseurs SET id_fournisseur = ?, reference_fournisseur = ?, prix = ? WHERE id_produit = ?`,
                [id_fournisseur, reference_fournisseur, prix_achat, id]
            );
        }

        await conn.commit();
        if (rows.length > 0) {
            res.json({ message: 'Produit mis à jour (relation fournisseur mise à jour)' });
        }
        res.json({ message: 'Produit mis à jour ' });

    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: 'Erreur lors de la mise à jour', details: err });
    } finally {
        conn.release();
    }
};


exports.setSeuilMin = async (req, res) => {
    const { id } = req.params;
    const { qnt_min } = req.body;

    if (!qnt_min || isNaN(qnt_min)) {
        return res.status(400).json({ message: "Seuil invalide." });
    }

    try {
        const [result] = await db.query(
            "UPDATE produits SET qnt_min = ? WHERE id_produit = ?",
            [qnt_min, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Produit introuvable." });
        }

        res.json({ message: "Seuil minimal mis à jour." });
    } catch (error) {
        console.error("Erreur mise à jour seuil :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

exports.getNombreProduct = async () => {
    try {
        const [rows] = await db.query("SELECT COUNT(*) AS nombre_produits FROM produits");
        return rows[0].nombre_produits;
    } catch (err) {
        console.error("Erreur lors de la récupération du nombre de produits :", err);
        throw err;
    }
}
//recuperer la quantite disponible par produit
exports.getQuantiteDisponible = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query("SELECT quantite FROM produits WHERE id_produit = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Produit non trouvé." });
        }

        res.json({ quantite_disponible: rows[0].quantite });
    } catch (err) {
        console.error("Erreur lors de la récupération de la quantité disponible :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// Contrôleur pour récupérer les produits en rupture
exports.getProduitsEnRupture = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT nom, quantite
      FROM produits
      WHERE quantite <= qnt_min
    `);

    // Format attendu par Recharts : [{ nom: 'Produit A', valeur: 3 }, ...]
    const produits = rows.map(p => ({
      nom: p.nom,
      valeur: p.quantite
    }));

    res.json(produits);
  } catch (err) {
    console.error("Erreur lors de la récupération des produits en rupture :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
