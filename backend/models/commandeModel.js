// backend/models/commandeModel.js
const db = require('./db');

// ✅ Création d'une commande
exports.createCommande = async (id_fournisseur, id_magasin, conn) => {
  const [result] = await conn.query(
    `INSERT INTO commandes (id_fournisseur, id_magasin,  date_commande, status) 
     VALUES (?, ?, CURDATE(), 'en cours')`,
    [id_fournisseur, id_magasin]
  );
  return result.insertId;
};

// ✅ Ajout de produits à une commande
exports.addProduitsToCommande = async (id_commande, produits, conn) => {
  for (const produit of produits) {
    if (!produit.id_produit || !produit.quantite) continue;

    await conn.query(
      `INSERT INTO contenu_commande (id_commande, id_produit, quantite, prix_unitaire) 
       VALUES (?, ?, ?, ?)`,
      [id_commande, produit.id_produit, produit.quantite, produit.prix_unitaire]
    );
  }
};


exports.getCommandesAdmin = async () => {
  const [commandes] = await db.query(`
    SELECT c.id_commande, c.date_commande, c.status, f.nom AS fournisseur
    FROM commandes c
    JOIN fournisseurs f ON c.id_fournisseur = f.id_fournisseur
    ORDER BY c.date_commande DESC
  `);
  return commandes;
};

exports.getCommandesByMagasin = async (idMagasin) => {
  const [commandes] = await db.query(`
    SELECT c.id_commande, c.date_commande, c.status, f.nom AS fournisseur
    FROM commandes c
    JOIN fournisseurs f ON c.id_fournisseur = f.id_fournisseur
    WHERE c.id_magasin = ?
    ORDER BY c.date_commande DESC
  `, [idMagasin]);
  return commandes;
};

exports.getProduitsByCommande = async (idCommande) => {
  const [produits] = await db.query(`
    SELECT p.nom, cc.quantite
    FROM contenu_commande cc
    JOIN produits p ON cc.id_produit = p.id_produit
    WHERE cc.id_commande = ?
  `, [idCommande]);
  return produits;
};
