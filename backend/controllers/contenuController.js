const db = require("../models/db");

exports.getAllContenus = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        cc.id_contenu,
        cc.id_commande,
        p.nom AS nom_produit,
        cc.quantite,
        cc.prix_unitaire,
        c.date_commande,
        c.status AS statut,
        CONCAT('Historique de la commande ', cc.id_commande) AS historique
      FROM contenu_commande cc
      JOIN produits p ON p.id_produit = cc.id_produit
      JOIN commandes c ON c.id_commande = cc.id_commande
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erreur getAllContenus :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
exports.getContenuById = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query(`
      SELECT 
        cc.id_contenu,
        cc.id_commande,
        p.nom AS nom_produit,
        cc.quantite,
        cc.prix_unitaire,
        c.date_commande,
        c.status AS statut
      FROM contenu_commande cc
      JOIN produits p ON p.id_produit = cc.id_produit
      JOIN commandes c ON c.id_commande = cc.id_commande
      WHERE cc.id_contenu = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Contenu non trouvé" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Erreur getContenuById :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getContenus = async (req, res) => {
    const utilisateur = req.session.user;
  
    if (!utilisateur) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
  
    try {
      let query = `
        SELECT 
          cc.id_contenu,
          cc.id_commande,
          p.nom AS nom_produit,
          cc.quantite,
          cc.prix_unitaire,
          c.date_commande,
          c.status AS statut,
          CONCAT('Historique de la commande ', cc.id_commande) AS historique
        FROM contenu_commande cc
        JOIN produits p ON p.id_produit = cc.id_produit
        JOIN commandes c ON c.id_commande = cc.id_commande
      `;
  
      const params = [];
  
      if (utilisateur.role === "responsable") {
        if (!utilisateur.id_magasin) {
          return res.status(400).json({ message: "Aucun magasin associé à ce responsable" });
        }
  
        query += ` WHERE c.id_magasin = ?`;
        params.push(utilisateur.id_magasin);
      } else if (utilisateur.role !== "admin") {
        return res.status(403).json({ message: "Accès refusé" });
      }
  
      const [rows] = await db.query(query, params);
      res.json(rows);
    } catch (err) {
      console.error("Erreur getAllContenus :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  