// models/utilisateurModel.js
const db = require("./db");

exports.getAllUtilisateurs = async () => {
  const [rows] = await db.query("SELECT * FROM utilisateurs");
  return rows;
};

exports.createUtilisateur = async ({ nom, prenom, email, mot_de_passe, role, statut }) => {
  const [result] = await db.query(
    "INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, statut) VALUES (?, ?, ?, ?, ?, ?)",
    [nom, prenom, email, mot_de_passe, role, statut]
  );
  return result.insertId;
};

exports.deleteUtilisateur = async (id) => {
  return db.query("DELETE FROM utilisateurs WHERE id_utilisateur = ?", [id]);
};

exports.updateUtilisateur = async (id, { nom, prenom, email, mot_de_passe, role, statut }) => {
  return db.query(
    "UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, mot_de_passe = ?, role = ?, statut = ? WHERE id_utilisateur = ?",
    [nom, prenom, email, mot_de_passe, role, statut, id]
  );
};

exports.getLastConnexionDate = async (id) => {
  const [rows] = await db.query(
    "SELECT date_connexion FROM connexions WHERE id_utilisateur = ? ORDER BY date_connexion DESC LIMIT 1",
    [id]
  );
  return rows.length > 0 ? rows[0].date_connexion : null;
};

exports.countConnexions = async (id) => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total FROM connexions WHERE id_utilisateur = ?",
    [id]
  );
  return rows[0].total;
};

exports.updateStatut = async (id, statut) => {
  return db.query("UPDATE utilisateurs SET statut = ? WHERE id_utilisateur = ?", [statut, id]);
};
exports.getUtilisateurById = async (id) => {
  const [rows] = await db.query("SELECT * FROM utilisateurs WHERE id_utilisateur = ?", [id]);
  return rows.length > 0 ? rows[0] : null;
};

exports.getUtilisateurById = async (id_utilisateur) => {
    const [rows] = await db.query(
      `SELECT id_utilisateur AS id, nom, prenom, email, role, created_at, id_magasin 
       FROM utilisateurs 
       WHERE id_utilisateur = ?`,
      [id_utilisateur]
    );
  
    return rows[0]; // retourne un seul utilisateur
};