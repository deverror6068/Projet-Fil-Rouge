const db = require('./db');

exports.getAllProduits = async () => {
    const [rows] = await db.query(`
      SELECT id_produit, nom, description, prix, quantite, id_vendeur
      FROM produits
      ORDER BY id_produit DESC
    `);
    return rows;
};
  

exports.createProduit = async (produit, conn) => {
  const { nom, description, prix, quantite, id_vendeur } = produit;
  const [result] = await conn.query(
    'INSERT INTO produits (nom, description, prix, quantite, id_vendeur) VALUES (?, ?, ?, ?, ?)',
    [nom, description, prix, quantite, id_vendeur]
  );
  return result.insertId;
};

// exports.createProduitFournisseur = async (relation, conn) => {
//   const { id_produit, id_fournisseur, reference_fournisseur, prix_achat } = relation;
//   return conn.query(
//     'INSERT INTO produits_fournisseurs (id_produit, id_fournisseur, prix, reference_fournisseur) VALUES (?, ?, ?, ?)',
//     [id_produit, id_fournisseur, prix_achat, reference_fournisseur]
//   );
// };

exports.updateProduit = async (id, data, conn) => {
  const { nom, description, prix, quantite, id_vendeur } = data;
  return conn.query(
    'UPDATE produits SET nom = ?, description = ?, prix = ?, quantite = ?, id_vendeur = ? WHERE id_produit = ?',
    [nom, description, prix, quantite, id_vendeur, id]
  );
};

exports.updateProduitFournisseur = async (id, data, conn) => {
  const { id_fournisseur, reference_fournisseur, prix_achat } = data;
  return conn.query(
    'UPDATE produits_fournisseurs SET id_fournisseur = ?, reference_fournisseur = ?, prix = ? WHERE id_produit = ?',
    [id_fournisseur, reference_fournisseur, prix_achat, id]
  );
};

exports.deleteProduit = async (id, conn) => {
  await conn.query('DELETE FROM produits_fournisseurs WHERE id_produit = ?', [id]);
  await conn.query('DELETE FROM produits WHERE id_produit = ?', [id]);
};
