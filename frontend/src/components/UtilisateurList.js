import React, { useEffect, useState } from "react";
import {Navigate, useNavigate} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {FcClock, FcEmptyTrash, FcOk} from "react-icons/fc";
const Utilisateurs = () => {
  const { utilisateur } = useAuth();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [statuts, setStatuts] = useState({});
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "utilisateur",
    mot_de_passe: "",
    confirmPassword: "",
    statut: ""
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const response = await fetch("/api/utilisateurs");
        if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
        const data = await response.json();
        setUtilisateurs(data);

        const newStatuts = {};
        for (const u of data) {
          try {
            console.log(u,"dsfhigdfuyh")
            const res = await fetch(`/api/utilisateurs/connexion/${u.id_utilisateur}`);
            const result = await res.json();
            console.log(result,"fdgfghfg")
            newStatuts[u.id_utilisateur] = {
              statut: u.statut || "inconnu",
              days: result.jours ?? "?"


            };



// 2. Calculer la date correspondante


// 3. Afficher la date en format lisible


// 4. Calculer le temps écoulé par rapport à maintenant
            const now = Date.now();
            const elapsedMilliseconds = now - now;

// 5. Convertir en jours, heures, minutes, secondes
            const seconds = Math.floor(result.elapsedTime / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            console.log(seconds,minutes,hours,days,"zreqshtryjuty",result.elapsedTime )

            if (result.statut === "noconnexion") {
              newStatuts[u.id_utilisateur] = { statut: "inactif", days: "jamais" };
            } else if (result.statut === "inactif") {
              newStatuts[u.id_utilisateur] = { statut: "inactif", days: ` il y a ${days} jours` || "?" };
              let lasttime;

              if (lasttime > 0) {
                // Différence positive → dans le passé
                if (days >= 1) {
                  lasttime =  `il y a${days} jour${days > 1 ? 's' : ''}`;
                } else {
                  lasttime =  `il y a${hours} heure${hours > 1 ? 's' : ''}`;
                }
              }
            } else if (result.statut === "actif") {
              console.log(u,"wxcwxwdfwg",result)
              const diffAbs = Math.abs(result.jours);

              let lasttime;

              if (lasttime > 0) {
                // Différence positive → dans le passé
                if (days >= 1) {
                  lasttime =  `il y a${days} jour${days > 1 ? 's' : ''}`;
                } else {
                  lasttime =  `il y a${hours} heure${hours > 1 ? 's' : ''}`;
                }
              } else {
                // Différence négative → dans le futur
                if (hours >= 1) {
                  lasttime =  `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
                } else {
                 if(minutes<=1){
                   lasttime =  `à l'instant`
                 }else {
                   lasttime =  `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
                 }
                }
              }

              newStatuts[u.id_utilisateur] = { statut: "actif", days: lasttime || "?" };


            } else {
              newStatuts[u.id_utilisateur] = { statut: "inconnu", days: result.jours };
            }

          } catch(err) {
            newStatuts[u.id_utilisateur] = { statut: err.message, days: "?" };
          }
        }


        setStatuts(newStatuts);
      } catch (e) {
        setError(e.message);
      }
    };
    fetchUtilisateurs();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...utilisateurs];
    updated[index][field] = value;
    setUtilisateurs(updated);
  };

  const enregistrer = async (utilisateur) => {
    const { id_utilisateur, nom, prenom, email, role, mot_de_passe } = utilisateur;
    await fetch(`/api/utilisateurs/${id_utilisateur}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, email, role, statut: "actif", mot_de_passe })
    });
    alert("Utilisateur mis à jour ✅");
  };

  const supprimerUtilisateur = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    await fetch(`/api/utilisateurs/${id}`, { method: "DELETE" });
    setUtilisateurs(utilisateurs.filter(u => u.id_utilisateur !== id));
    setStatuts(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleNewUserChange = (field, value) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = async () => {
    const { nom, prenom, email, role, mot_de_passe, confirmPassword } = newUser;
    const errs = {};
    if (!mot_de_passe || mot_de_passe !== confirmPassword) {
      errs.mot_de_passe = "Les mots de passe ne correspondent pas.";
    }
    if (Object.keys(errs).length) return setErrors(errs);

    const res = await fetch("/api/utilisateurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, email, role, mot_de_passe, statut: "actif" })
    });

    if (res.ok) {
      alert("Utilisateur créé ✅");
      setNewUser({ nom: "", prenom: "", email: "", role: "utilisateur", mot_de_passe: "", confirmPassword: "" });
      const data = await fetch("/api/utilisateurs").then(r => r.json());
      setUtilisateurs(data);
    } else {
      alert("Erreur lors de la création de l'utilisateur.");
    }
  };

  if (!utilisateur || utilisateur.role !== "responsable") return <Navigate to="/" replace />;

  return (
    <div
      className="liste"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "500px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      <h3 style={{ marginBottom: "1rem" }}>Liste des utilisateurs</h3>

      {/* Scroll invisible */}
      <style>
        {`
          .scroll-invisible::-webkit-scrollbar { display: none; }
          .scroll-invisible { scrollbar-width: none; }
        `}
      </style>

      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div
          style={{ overflowY: "auto", height: "100%" }}
          className="scroll-invisible"
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#f8f8f8",
                zIndex: 1,
              }}
            >
              <tr>
                <th style={{ padding: "8px" }}>Nom</th>
                <th style={{ padding: "8px" }}>Prénom</th>
                <th style={{ padding: "8px" }}>Email</th>
                <th style={{ padding: "8px" }}>Rôle</th>
                <th style={{ padding: "8px" }}>Statut</th>
                <th style={{ padding: "8px" }}>Connexion</th>
                <th style={{ padding: "8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {utilisateurs.map((u, i) => (
                <tr key={u.id_utilisateur}>
                  <td style={{ padding: "8px" }}>
                    <input
                      type="text"
                      value={u.nom}
                      onChange={(e) => handleChange(i, "nom", e.target.value)}
                    />
                  </td>
                  <td style={{ padding: "8px" }}>
                    <input
                      type="text"
                      value={u.prenom}
                      onChange={(e) => handleChange(i, "prenom", e.target.value)}
                    />
                  </td>
                  <td style={{ padding: "8px" }}>
                    <input
                      type="email"
                      value={u.email}
                      onChange={(e) => handleChange(i, "email", e.target.value)}
                    />
                  </td>
                  <td style={{ padding: "8px" }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleChange(i, "role", e.target.value)}
                    >
                      <option value="utilisateur">utilisateur</option>
                      <option value="responsable">responsable</option>
                    </select>
                  </td>
                  <td style={{ padding: "8px" }}>{statuts[u.id_utilisateur]?.statut}</td>
                  <td style={{ padding: "8px" }}>{statuts[u.id_utilisateur]?.days}</td>
                  <td style={{ padding: "8px" }}>
                    <button onClick={() => enregistrer(u)}><FcOk /></button>
                    <button onClick={() => supprimerUtilisateur(u.id_utilisateur)}>
                      <FcEmptyTrash />
                    </button>
                    <button onClick={() => navigate(`/UserHistory/${u.id_utilisateur}`)}>
                      <FcClock />
                    </button>
                  </td>
                </tr>
              ))}
              {utilisateurs.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Utilisateurs;

