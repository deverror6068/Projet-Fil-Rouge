// models/magasinModel.js
const db = require("./db");

exports.getAllMagasins = async () => {
  const [rows] = await db.query("SELECT * FROM magasins ORDER BY id_magasin DESC");
  return rows;
};

exports.createMagasin = async (data) => {
  const { nom, adresse, ville, code_postal, telephone, email } = data;
  return db.query(
    "INSERT INTO magasins (nom, adresse, ville, code_postal, telephone, email) VALUES (?, ?, ?, ?, ?, ?)",
    [nom, adresse, ville, code_postal, telephone, email]
  );
};
exports.updateMagasin = async (id, data) => {
  const { nom, adresse, ville, code_postal, telephone, email } = data;
  return db.query(
    "UPDATE magasins SET nom = ?, adresse = ?, ville = ?, code_postal = ?, telephone = ?, email = ? WHERE id_magasin = ?",
    [nom, adresse, ville, code_postal, telephone, email, id]
  );
};