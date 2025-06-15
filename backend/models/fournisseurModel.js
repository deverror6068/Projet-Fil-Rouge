const db = require('./db');
exports.getAll = async () => {
  const [rows] = await db.query('SELECT * FROM fournisseurs');
  return rows;
};

exports.create = async ({ nom, adresse, email, telephone }) => {
  const [result] = await db.query(
    'INSERT INTO fournisseurs (nom, adresse, email, telephone) VALUES (?, ?, ?, ?)',
    [nom, adresse, email, telephone]
  );
  return result.insertId;
};

exports.update = async (id, { nom, adresse, email, telephone }) => {
  await db.query(
    'UPDATE fournisseurs SET nom = ?, adresse = ?, email = ?, telephone = ? WHERE id_fournisseur = ?',
    [nom, adresse, email, telephone, id]
  );
};

exports.delete = async (id) => {
  await db.query('DELETE FROM fournisseurs WHERE id_fournisseur = ?', [id]);
};

exports.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM fournisseurs WHERE id_fournisseur = ?', [id]);
  if (rows.length === 0) {
    throw new Error('Fournisseur non trouvé');
  }
  return rows[0];
};

//recuperation des produits d'un fournisseur
exports.getProduitsByFournisseur = async (id_fournisseur) => {
  const [rows] = await db.query(
    `SELECT pf.*, p.nom AS nom_produit, p.description, p.prix AS prix_vente
     FROM produits_fournisseurs pf
     JOIN produits p ON pf.id_produit = p.id_produit
     WHERE pf.id_fournisseur = ?`,
    [id_fournisseur]
  );
  return rows;
};