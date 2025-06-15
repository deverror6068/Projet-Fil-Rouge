// // // const db = require('../models/db');

// // // 1. Créer une commande avec des produits
// // import { useAuth } from "../contexts/AuthContext";

// // const db = require('../models/db');
// // const commandeModel = require('../models/commandeModel');
// // const utilisateur = req.session.utilisateur;

// // exports.creerCommande = async (req, res) => {
// //   const { id_fournisseur, produits } = req.body;
// //   const vendeur_id = req.session.utilisateur?.id || 1;

// //   if (!id_fournisseur || !Array.isArray(produits) || produits.length === 0) {
// //     console.log("❌ Données invalides", req.body);
// //     return res.status(400).json({ error: "Données invalides" });
// //   }

// //   const conn = await db.getConnection();
  
// //   try {
// //     await conn.beginTransaction();

// //     const id_commande = await commandeModel.createCommande(id_fournisseur, vendeur_id, conn);
// //     await commandeModel.addProduitsToCommande(id_commande, produits, conn);

// //     await conn.commit();
// //     res.status(201).json({ message: "Commande créée", id_commande });
// //   } catch (err) {
// //   await conn.rollback();
// //   console.error("❌ Erreur insertion commande :", err.message);
// //   console.error("🧠 Stack:", err.stack);
// //   res.status(500).json({ error: "Erreur serveur", details: err.message });
// // }
  
// // };



// // // 2. Lister toutes les commandes
// // // exports.listerCommandes = async (req, res) => {
// // //     try {
// // //         const [commandes] = await db.query(`
// // //             SELECT c.id_commande, c.date_commande, c.status, f.nom AS fournisseur
// // //             FROM commandes c
// // //             JOIN fournisseurs f ON c.id_fournisseur = f.id_fournisseur
// // //             ORDER BY c.date_commande DESC
// // //         `);

// // //         // Récupérer les produits de chaque commande
// // //         for (const commande of commandes) {
// // //             const [produits] = await db.query(`
// // //                 SELECT p.nom, cc.quantite
// // //                 FROM contenu_commande cc
// // //                 JOIN produits p ON cc.id_produit = p.id_produit
// // //                 WHERE cc.id_commande = ?
// // //             `, [commande.id_commande]);
// // //             commande.produits = produits;
// // //         }

// // //         res.json(commandes);
// // //     } catch (err) {
// // //         res.status(500).json({ error: 'Erreur lors de la récupération des commandes', details: err });
// // //     }
// // // };

// // // 3. Supprimer une commande
// // exports.supprimerCommande = async (req, res) => {
// //     const id = req.params.id;
// //     try {
// //         await db.query('DELETE FROM contenu_commande WHERE id_commande = ?', [id]);
// //         await db.query('DELETE FROM commandes WHERE id_commande = ?', [id]);
// //         res.json({ message: 'Commande supprimée' });
// //     } catch (err) {
// //         res.status(500).json({ error: 'Erreur lors de la suppression de la commande', details: err });
// //     }
// // };

// // // 4. Modifier le statut d'une commande
// // exports.mettreAJourStatut = async (req, res) => {
// //     const id = req.params.id;
// //     const { status } = req.body;
// //     try {
// //         await db.query('UPDATE commandes SET status = ? WHERE id_commande = ?', [status, id]);
// //         res.json({ message: 'Statut mis à jour' });
// //     } catch (err) {
// //         res.status(500).json({ error: 'Erreur lors de la mise à jour du statut', details: err });
// //     }
// // };

// // // // controllers/commandesController.js
// // // exports.getDetailsCommande = async (req, res) => {
// // //     const { id } = req.params;
  
// // //     try {
// // //       const [details] = await db.query(`
// // //         SELECT 
// // //           cc.id_contenu,
// // //           cc.id_commande,
// // //           p.nom AS nom_produit,
// // //           cc.quantite,
// // //           cc.prix_unitaire,
// // //           (cc.quantite * cc.prix_unitaire) AS total
// // //         FROM contenu_commande cc
// // //         JOIN produits p ON p.id_produit = cc.id_produit
// // //         WHERE cc.id_commande = ?
// // //       `, [id]);
  
// // //       res.json(details);
// // //       console.log("Détails de la commande récupérés :", details);
// // //     } catch (error) {
// // //       console.error("Erreur lors de la récupération des détails :", error);
// // //       res.status(500).json({ message: "Erreur serveur" });
// // //     }
// // //   };
  
// // exports.listerCommandes = async (req, res) => {
// //     const utilisateur = req.session.utilisateur;
  
// //     if (!utilisateur) {
// //       return res.status(401).json({ error: "Utilisateur non authentifié" });
// //     }
  
// //     try {
// //       let commandes = [];
  
// //       if (utilisateur.role === "admin") {
// //         // Admin voit tout
// //         [commandes] = await db.query(`
// //           SELECT c.id_commande, c.date_commande, c.status, f.nom AS fournisseur
// //           FROM commandes c
// //           JOIN fournisseurs f ON c.id_fournisseur = f.id_fournisseur
// //           ORDER BY c.date_commande DESC
// //         `);
// //       } else if (utilisateur.role === "responsable") {
// //         // Responsable : ne voit que les commandes de son magasin
// //         if (!utilisateur.id_magasin) {
// //           return res.status(400).json({ error: "Aucun magasin lié à ce responsable" });
// //         }
  
// //         [commandes] = await db.query(`
// //           SELECT c.id_commande, c.date_commande, c.status, f.nom AS fournisseur
// //           FROM commandes c
// //           JOIN fournisseurs f ON c.id_fournisseur = f.id_fournisseur
// //           WHERE c.id_magasin = ?
// //           ORDER BY c.date_commande DESC
// //         `, [utilisateur.id_magasin]);
// //       } else {
// //         return res.status(403).json({ error: "Accès refusé" });
// //       }
  
// //       // Ajouter les produits associés à chaque commande
// //       for (const commande of commandes) {
// //         const [produits] = await db.query(`
// //           SELECT p.nom, cc.quantite
// //           FROM contenu_commande cc
// //           JOIN produits p ON cc.id_produit = p.id_produit
// //           WHERE cc.id_commande = ?
// //         `, [commande.id_commande]);
// //         commande.produits = produits;
// //       }
  
// //       res.json(commandes);
// //     } catch (err) {
// //       res.status(500).json({ error: 'Erreur lors de la récupération des commandes', details: err.message });
// //     }
// //   };
  
// const db = require('../models/db');
// const commandeModel = require('../models/commandeModel');

// // ✅ 1. Créer une commande
// exports.creerCommande = async (req, res) => {
//   const { id_fournisseur, produits } = req.body;
//   const utilisateur = req.session.user;
//   const vendeur_id = utilisateur?.id_utilisateur || 1;

//   if (!id_fournisseur || !Array.isArray(produits) || produits.length === 0) {
//     console.log("❌ Données invalides", req.body);
//     return res.status(400).json({ error: "Données invalides" });
//   }

//   const conn = await db.getConnection();

//   try {
//     await conn.beginTransaction();

//     const id_commande = await commandeModel.createCommande(id_fournisseur, utilisateur.id_magasin, conn);
//     await commandeModel.addProduitsToCommande(id_commande, produits, conn);

//     await conn.commit();
//     res.status(201).json({ message: "Commande créée", id_commande });
//   } catch (err) {
//     await conn.rollback();
//     console.error("❌ Erreur insertion commande :", err.message);
//     res.status(500).json({ error: "Erreur serveur", details: err.message });
//   }
// };

// // ✅ 2. Supprimer une commande
// exports.supprimerCommande = async (req, res) => {
//   const id = req.params.id;

//   try {
//     await db.query('DELETE FROM contenu_commande WHERE id_commande = ?', [id]);
//     await db.query('DELETE FROM commandes WHERE id_commande = ?', [id]);
//     res.json({ message: 'Commande supprimée' });
//   } catch (err) {
//     res.status(500).json({ error: 'Erreur lors de la suppression de la commande', details: err.message });
//   }
// };

// // ✅ 3. Modifier le statut d'une commande
// exports.mettreAJourStatut = async (req, res) => {
//   const id = req.params.id;
//   const { status } = req.body;

//   try {
//     await db.query('UPDATE commandes SET status = ? WHERE id_commande = ?', [status, id]);
//     res.json({ message: 'Statut mis à jour' });
//   } catch (err) {
//     res.status(500).json({ error: 'Erreur lors de la mise à jour du statut', details: err.message });
//   }
// };

// // ✅ 4. Lister les commandes selon le rôle utilisateur
// exports.listerCommandes = async (req, res) => {
//   const utilisateur = req.session.user;

//   if (!utilisateur) {
//     return res.status(401).json({ error: "Utilisateur non authentifié" });
//   }

//   try {
//     let commandes = [];

//     if (utilisateur.role === "admin") {
//       commandes = await commandeModel.getCommandesAdmin();
//     } else if (utilisateur.role === "responsable") {
//       if (!utilisateur.id_magasin) {
//         return res.status(400).json({ error: "Aucun magasin lié à ce responsable" });
//       }

//       commandes = await commandeModel.getCommandesByMagasin(utilisateur.id_magasin);
//     } else {
//       return res.status(403).json({ error: "Accès refusé" });
//     }

//     // Ajouter les produits à chaque commande
//     for (const commande of commandes) {
//       commande.produits = await commandeModel.getProduitsByCommande(commande.id_commande);
//     }

//     res.json(commandes);
//   } catch (err) {
//     console.error("Erreur listerCommandes :", err);
//     res.status(500).json({ error: "Erreur lors de la récupération des commandes", details: err.message });
//   }
// };


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
