

const db = require('../models/db');

// 1. Créer une commande avec des produits
exports.creerCommande = async (req, res) => {
    const { id_fournisseur, produits } = req.body;
    const vendeur_id = req.session.utilisateur?.id; // Sécurité : extraire depuis session

    if (!vendeur_id) {
        return res.status(403).json({ error: 'Vendeur non identifié dans la session' });
    }

    try {
        // Créer la commande avec le vendeur_id
        const [result] = await db.query(
            'INSERT INTO commandes (id_fournisseur, date_commande, vendeur_id) VALUES (?, CURDATE(), ?)',
            [id_fournisseur, vendeur_id]
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
// 5. Mettre à jour une commande (ex. modifier fournisseur ou autre champ)
exports.mettreAJourCommande = async (req, res) => {
  const id = req.params.id;
  const { id_fournisseur } = req.body; // adapte selon les champs que tu veux autoriser à modifier

  try {
      await db.query(
          'UPDATE commandes SET id_fournisseur = ? WHERE id_commande = ?',
          [id_fournisseur, id]
      );
      res.json({ message: 'Commande mise à jour' });
  } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la commande', details: err });
  }
};
//recuperer le nombre de commandes
exports.getNombreCommandes = async (req, res) => {
  const [[{ nb }]] = await db.query("SELECT COUNT(*) as nb FROM commandes");
  return nb;
};
// Récupérer le contenu d'une commande spécifique
exports.getDetailsCommande = async (req, res) => {
    const id = req.params.id;

    try {
        const [details] = await db.query(`
            SELECT 
                cc.id_contenu,
                cc.id_commande,
                p.nom AS nom_produit,
                cc.quantite,
                cc.prix_unitaire,
                (cc.quantite * cc.prix_unitaire) AS total
            FROM contenu_commande cc
            JOIN produits p ON p.id_produit = cc.id_produit
            WHERE cc.id_commande = ?
        `, [id]);

        if (details.length === 0) {
            return res.status(404).json({ message: "Aucun détail trouvé pour cette commande" });
        }

        res.json(details);
    } catch (error) {
        console.error("Erreur lors de la récupération des détails :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
