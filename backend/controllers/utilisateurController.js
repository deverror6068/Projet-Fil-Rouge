// // // controllers/utilisateurController.js
// // const db = require('../models/db');

// // exports.getAllUtilisateurs = async (req, res) => {
// //     try {
// //         const [rows] = await db.query('SELECT * FROM utilisateurs');
// //         res.json(rows);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Erreur serveur', error });
// //     }
// // };


// // exports.createUtilisateur = async (req, res) => {
// //     const { nom, prenom, email, mot_de_passe, role, statut } = req.body;
// //     try {
// //         const [result] = await db.query(
// //             'INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, statut) VALUES (?, ?, ?, ?, ?, ?)',
// //             [nom, prenom, email, mot_de_passe, role, statut]
// //         );
// //         res.status(201).json({ message: 'Utilisateur créé', id: result.insertId });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Erreur lors de la création', error });
// //     }
// // };

// // // 3. Supprimer un utilisateur par son ID
// // exports.deleteUtilisateur = async (req, res) => {
// //     const { id } = req.params;
// //     try {
// //         await db.query('DELETE FROM utilisateurs WHERE id_utilisateur = ?', [id]);
// //         res.json({ message: 'Utilisateur supprimé' });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Erreur lors de la suppression', error });
// //     }
// // };

// // // 4. Mettre à jour un utilisateur
// // exports.updateUtilisateur = async (req, res) => {
// //     const { id } = req.params;
// //     const { nom, prenom, email, mot_de_passe, role, statut } = req.body;
// //     try {
// //         await db.query(
// //             'UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, mot_de_passe = ?, role = ?, statut = ? WHERE id_utilisateur = ?',
// //             [nom, prenom, email, mot_de_passe, role, statut, id]
// //         );
// //         res.json({ message: 'Utilisateur mis à jour' });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Erreur lors de la mise à jour', error });
// //     }
// // };

// // controllers/utilisateurController.js
// const utilisateurModel = require('../models/utilisateurModel');
// const bcrypt = require("bcrypt");

// exports.getAllUtilisateurs = async (req, res) => {
//     try {
//         const utilisateurs = await utilisateurModel.getAllUtilisateurs();
//         res.json(utilisateurs);
//     } catch (error) {
//         res.status(500).json({ message: 'Erreur serveur', error });
//     }
// };

// exports.createUtilisateur = async (req, res) => {
//     const { nom, prenom, email, mot_de_passe, role, statut } = req.body;
//     try {
//         const id = await utilisateurModel.createUtilisateur({ nom, prenom, email, mot_de_passe, role, statut });
//         res.status(201).json({ message: 'Utilisateur créé', id });
//     } catch (error) {
//         res.status(500).json({ message: 'Erreur lors de la création', error });
//     }
// };

// exports.deleteUtilisateur = async (req, res) => {
//     const { id } = req.params;
//     try {
//         await utilisateurModel.deleteUtilisateur(id);
//         res.json({ message: 'Utilisateur supprimé' });
//     } catch (error) {
//         res.status(500).json({ message: 'Erreur lors de la suppression', error });
//     }
// };

// exports.updateUtilisateur = async (req, res) => {
//     const { id } = req.params;
//     const { nom, prenom, email, mot_de_passe, role, statut } = req.body;
//     try {
//         await utilisateurModel.updateUtilisateur(id, { nom, prenom, email, mot_de_passe, role, statut });
//         res.json({ message: 'Utilisateur mis à jour' });
//     } catch (error) {
//         res.status(500).json({ message: 'Erreur lors de la mise à jour', error });
//     }
// };

// exports.checkStatut = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const count = await utilisateurModel.countConnexions(id);
//         if (count <= 0) {
//             return res.json({ statut: "noconnexion", jours: null });
//         }

//         const lastConnexion = await utilisateurModel.getLastConnexionDate(id);
//         const now = new Date();
//         const diffEnMs = now - lastConnexion;
//         const diffInDays = Math.floor(diffEnMs / (1000 * 60 * 60 * 24));

//         const nouveauStatut = diffInDays > 10 ? "inactif" : "actif";
//         await utilisateurModel.updateStatut(id, nouveauStatut);

//         res.json({ statut: nouveauStatut, jours: diffInDays });
//     } catch (error) {
//         console.error("Erreur checkStatut:", error);
//         res.status(500).json({ message: 'Erreur serveur' });
//     }
// };

// exports.RegisterUser = async (req, res) => {
//     const { nom, prenom, email, mot_de_passe } = req.body;
//     if (!nom || !prenom || !email || !mot_de_passe) {
//         return res.status(400).json({ message: "Champs requis manquants." });
//     }

//     try {
//         const hash = await bcrypt.hash(mot_de_passe, 10);
//         const role = "utilisateur";
//         const statut = "actif";

//         const id = await utilisateurModel.createUtilisateur({ nom, prenom, email, mot_de_passe: hash, role, statut });
//         res.status(201).json({ message: "Utilisateur créé avec succès", id });
//     } catch (err) {
//         console.error("Erreur RegisterUser:", err);
//         res.status(500).json({ message: "Erreur serveur." });
//     }
// };
// exports.getUtilisateurConnecte = async (req, res) => {
//     const utilisateurSession = req.session.utilisateur;
  
//     if (!utilisateurSession) {
//       return res.status(401).json({ error: "Utilisateur non connecté" });
//     }
  
//     try {
//       const utilisateur = await utilisateurModel.getUtilisateurById(utilisateurSession.id_utilisateur);
      
//       if (!utilisateur) {
//         return res.status(404).json({ error: "Utilisateur non trouvé" });
//       }
  
//       res.json(utilisateur);
//     } catch (err) {
//       console.error("Erreur getUtilisateurConnecte :", err);
//       res.status(500).json({ message: "Erreur serveur" });
//     }
//   };



const db = require('../models/db');
const bcrypt = require("bcrypt")
exports.getAllUtilisateurs = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM utilisateurs');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

/*exports.createUtilisateur = async (req, res) => {
    const { nom, prenom, email, mot_de_passe } = req.body;

    if (!nom || !prenom || !email || !mot_de_passe) {
        return res.status(400).json({ message: "Champs requis manquants." });
    }

    const [existing] = await db.query(
        'SELECT id_utilisateur FROM utilisateurs WHERE email = ?',
        [email]
    );

    if (existing.length > 0) {
        return res.status(409).json({ message: "Email déjà utilisé." });
    }

    const role = "utilisateur";
    const statut = "actif"; // si tu veux forcer un statut par défaut

    try {
        // Hachage du mot de passe
        const hash = await bcrypt.hash(mot_de_passe, 10);

        // Insertion SQL avec query préparée
        const [result] = await db.query(
            'INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, statut) VALUES (?, ?, ?, ?, ?, ?)',
            [nom, prenom, email, hash, role, statut]
        );

        res.status(201).json({ message: "Utilisateur créé avec succès", id: result.insertId });
    } catch (err) {
        console.error("Erreur création utilisateur:", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};*/



exports.createUtilisateur = async (req, res) => {
    const { nom, prenom, email, mot_de_passe, role, statut } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, statut) VALUES (?, ?, ?, ?, ?, ?)',
            [nom, prenom, email, mot_de_passe, role, statut]
        );
        res.status(201).json({ message: 'Utilisateur créé', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création', error });
    }
};



exports.deleteUtilisateur = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM utilisateurs WHERE id_utilisateur = ?', [id]);
        res.json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression', error });
    }
};


exports.updateUtilisateur = async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, mot_de_passe, role, statut } = req.body;
    try {
        await db.query(
            'UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, mot_de_passe = ?, role = ?, statut = ? WHERE id_utilisateur = ?',
            [nom, prenom, email, mot_de_passe, role, statut, id]
        );
        res.json({ message: 'Utilisateur mis à jour' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour', error });
    }
};

exports.checkStatut = async (req, res) => {
    const { id } = req.params;  // attention, tu avais id_utilisateur mais dans ta route c'est :id
console.log(id)
/*    const [countRows] = await db.query(
        'SELECT * FROM connexions WHERE id_utilisateur = ?',
        [id]
    );*/

    const [connRows] = await db.query(
        'SELECT date_connexion FROM connexions WHERE id_utilisateur = ? ORDER BY date_connexion DESC LIMIT 1',
        [id]
    );
console.log(connRows)

    if (!(connRows.length <=0)) {


        const lastConnexion = new Date(connRows[0].date_connexion);
        const now = new Date();


        const diffEnMs = now - lastConnexion;
        const diffInDays = Math.floor(diffEnMs / (1000 * 60 * 60 * 24));

        let nouveauStatut = diffInDays > 10 ? "inactif" : "actif";
        if (id === 7 ){
            console.log(diffInDays > 10,"fszetrytrrf",diffInDays)
        }

        // Mise à jour du statut utilisateur
        await db.query(
            'UPDATE utilisateurs SET statut = ? WHERE id_utilisateur = ?',
            [nouveauStatut, id]
        );
console.log(diffInDays,diffEnMs,connRows[0].date_connexion,connRows)
        res.json({ statut: nouveauStatut, elapsedTime: diffEnMs });
    }else {
        // Pas de connexion
        res.json({ statut: "noconnexion", jours: null });
    }
};


exports.RegisterUser = async (req, res) => {
    const { nom, prenom, email, mot_de_passe } = req.body;

    if (!nom || !prenom || !email || !mot_de_passe) {
        return res.status(400).json({ message: "Champs requis manquants." });
    }

    const [existing] = await db.query(
        'SELECT id_utilisateur FROM utilisateurs WHERE email = ?',
        [email]
    );

    if (existing.length > 0) {
        return res.status(409).json({ message: "Email déjà utilisé." });
    }

    const role = "utilisateur";
    const statut = "actif"; // si tu veux forcer un statut par défaut

    try {
        // Hachage du mot de passe
        const hash = await bcrypt.hash(mot_de_passe, 10);

        // Insertion SQL avec query préparée
        const [result] = await db.query(
            'INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, statut) VALUES (?, ?, ?, ?, ?, ?)',
            [nom, prenom, email, hash, role, statut]
        );

        res.status(201).json({ message: "Utilisateur créé avec succès", id: result.insertId });
    } catch (err) {
        console.error("Erreur création utilisateur:", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// Récupérer les infos de l'utilisateur connecté
exports.getUtilisateurConnecte = async (req, res) => {
    const utilisateurSession = req.session.utilisateur;

    if (!utilisateurSession) {
        return res.status(401).json({ error: "Utilisateur non connecté" });
    }

    try {
        const [rows] = await db.query(
            'SELECT * FROM utilisateurs WHERE id_utilisateur = ?',
            [utilisateurSession.id_utilisateur]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("Erreur getUtilisateurConnecte :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.checkHistory = async (req, res) => {
    try{
        const { id } = req.params;  // attention, tu avais id_utilisateur mais dans ta route c'est :id
        console.log(id,req.params.id)
        const [history] = await db.query(
            'SELECT *  FROM connexions WHERE id_utilisateur = ? ORDER BY date_connexion DESC ',
            [id]
        );

        console.log([history][0])

        res.status(200).json({ history: history });
    }catch (err){
        res.status(500).json({ message: "Erreur serveur.", details : err });
    }
};


exports.getNombreUtilisateur = async (req, res) => {



    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) as nb FROM utilisateurs ',

        );
        console.log(rows[0],"dfsrdtrdfgdffhgfghfgfhgfghhfhfgty")



        return(  rows[0] );
    } catch (err) {
        console.error("Erreur getNombree :", err);

    }
};