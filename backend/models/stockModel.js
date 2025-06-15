const db = require('./db');
exports.getStocksByMagasin = async (idMagasin) => {
  const [rows] = await db.query(
    `SELECT s.id_stock, s.id_produit, p.nom, s.quantite, s.seuil_alerte
      FROM stocks s
      JOIN produits p ON s.id_produit = p.id_produit
      WHERE s.id_magasin = ?`,
    [idMagasin]
  );
  return rows;
};

exports.upsertStock = async (data) => {
  const { id_produit, id_magasin, quantite, seuil_alerte } = data;
  return db.query(
    `INSERT INTO stocks (id_produit, id_magasin, quantite, seuil_alerte)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE quantite = ?, seuil_alerte = ?`,
    [id_produit, id_magasin, quantite, seuil_alerte, quantite, seuil_alerte]
  );
};

exports.getStocksEnAlerteByMagasin = async (idMagasin) => {
  const [rows] = await db.query(
    `SELECT s.id_stock, s.id_produit, s.quantite, s.seuil_alerte, p.nom
      FROM stocks s
      JOIN produits p ON s.id_produit = p.id_produit
      WHERE s.id_magasin = ? AND s.quantite <= s.seuil_alerte`,
    [idMagasin]
  );
  return rows;
};

exports.getAllStocks = async () => {
  const [rows] = await db.query(
    `SELECT s.id_stock, s.id_produit, p.nom, s.quantite, s.seuil_alerte, s.id_magasin
      FROM stocks s
      JOIN produits p ON s.id_produit = p.id_produit`
  );
  return rows;
}