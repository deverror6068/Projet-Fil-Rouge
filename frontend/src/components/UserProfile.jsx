// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const UserProfile = () => {
//   // Simulons des données comme dans ton fichier PHP
//   const user = {
//     id: 1,
//     firstname: "Paul DERAT",
//     created_at: "2023-04-15",
//   };

//   const presence = {
//     name: "Ynov Aix en Provence",
//   };

//   const products = [
//     { name: "iPhone 12", price: "799", image: "/img/iphone.PNG" },
//     { name: "MacBook Pro", price: "1999", image: "/img/iphone.PNG" },
//     { name: "AirPods", price: "199", image: "/img/iphone.PNG" },
//   ];

//   return (
//     <div className="bg-light">
//       <div className="container py-5" style={{ marginTop: "5rem" }}>
//         <div className="bg-white p-4 rounded shadow">
//           {/* Entête */}
//           <div className="d-flex align-items-center justify-content-between flex-wrap">
//             <div className="d-flex align-items-center mb-3 mb-md-0">
//               <div className="avatar me-3" style={styles.avatar}></div>
//               <div>
//                 <h4 className="mb-0">
//                   {user.firstname} <span style={styles.badgeCheck}>✔</span>
//                 </h4>
//                 <small className="text-muted">★★★★★ 10 avis</small><br />
//                 <small className="text-muted">{presence.name}</small><br />
//                 <small className="text-muted">Compte créé le {user.created_at}</small><br />
//               </div>
//             </div>
//             <a href={`/users/${user.id}/edit`} className="btn btn-outline-info">
//               Modifier mon profil
//             </a>
//           </div>

//           {/* Citation */}
//           <p className="mt-4 quote" style={styles.quote}>
//             Voyez ce jeu exquis wallon, de graphie en kit mais bref. Portez ce vieux whisky au juge blond qui fume
//             sur son île intérieure, à côté de l'alcôve ovoïde, où les bûches se consument dans l'âtre, ce qui lui
//             permet de penser à de l’être.
//           </p>

//           {/* Produits */}
//           <div className="row mt-4 g-4">
//             {products.length > 0 ? (
//               products.map((product, index) => (
//                 <div className="col-sm-12 col-md-4" key={index}>
//                   <img src={product.image} alt={product.name} style={styles.itemImg} />
//                   <div className="item-actions" style={styles.itemActions}>
//                     <strong>{product.name}</strong><br />
//                     <span>{product.price} €</span><br />
//                     ❤️ 250 👁 250 ⬇ 250
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-12 text-center">
//                 <p className="text-muted">Vous n'avez encore publié aucun produit.</p>
//                 <a href="/products/create" className="btn btn-primary">Créer une annonce</a>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   avatar: {
//     width: "100px",
//     height: "100px",
//     borderRadius: "50%",
//     background: "#ddd",
//   },
//   badgeCheck: {
//     color: "#00bfa6",
//   },
//   quote: {
//     fontStyle: "italic",
//     color: "#555",
//   },
//   itemImg: {
//     width: "80%",
//     borderRadius: "10px",
//   },
//   itemActions: {
//     textAlign: "center",
//     marginTop: "8px",
//     color: "#555",
//   },
// };

// export default UserProfile;

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const [commandes, setCommandes] = useState([]);
  const presence = { name: "Ynov Aix en Provence" };
  const { user, setUser } = useAuth();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/utilisateurs/me", {
          credentials: "include",
        });
        const data = await res.json();
        console.log("👤 Utilisateur récupéré :", data);
        setUser(data);
      } catch (err) {
        console.error("Erreur chargement utilisateur :", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const res = await fetch("/api/commandes/me", {
          credentials: "include",
        });
        const data = await res.json();
        setCommandes(data);
      } catch (err) {
        console.error("Erreur chargement commandes :", err);
      }
    };

    fetchCommandes();
  }, []);

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="bg-light">
      <div className="container py-5" style={{ marginTop: "5rem" }}>
        <div className="bg-white p-4 rounded shadow">
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <div className="avatar me-3" style={styles.avatar}></div>
              <div>
                <h4 className="mb-0">
                  {user.prenom} {user.nom}{" "}
                  <span style={styles.badgeCheck}>✔</span>
                </h4>
                <small className="text-muted">★★★★★ 10 avis</small>
                <br />
                <small className="text-muted">{presence.name}</small>
                <br />
                <small className="text-muted">
                  Compte créé le{" "}
                  {new Date(user.created_at).toLocaleDateString("fr-FR")}
                </small>
              </div>
            </div>
            <a href={`/users/${user.id_utilisateur}/edit`} className="btn btn-outline-info">
              Modifier mon profil
            </a>
          </div>

          <p className="mt-4 quote" style={styles.quote}>
            "Portez ce vieux whisky au juge blond..."
          </p>

          <h5 className="mt-5">🧾 Mes commandes</h5>
          {commandes.length > 0 ? (
            <ul className="list-group mt-3">
              {commandes.map((cmd) => (
                <li
                  key={cmd.id_commande}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    Commande #{cmd.id_commande} —{" "}
                    {new Date(cmd.date_commande).toLocaleDateString("fr-FR")}
                  </span>
                  <span
                    className={`badge ${
                      cmd.status === "livrée" ? "bg-success" : "bg-warning"
                    }`}
                  >
                    {cmd.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted mt-3">Aucune commande pour l’instant.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#ddd",
  },
  badgeCheck: {
    color: "green",
    marginLeft: "0.3rem",
  },
  quote: {
    fontStyle: "italic",
    color: "#555",
  },
};

export default UserProfile;
