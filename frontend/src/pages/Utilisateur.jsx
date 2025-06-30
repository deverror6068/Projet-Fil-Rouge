import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Utilisateurs = () => {
  const { utilisateur } = useAuth();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [statuts, setStatuts] = useState({});
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

  useEffect(() => {
    fetch("/api/utilisateurs")
      .then(res => res.json())
      .then(async (data) => {
        setUtilisateurs(data);
        const newStatuts = {};
        for (const u of data) {
          try {
            const res = await fetch(`/api/utilisateurs/connexion/${u.id_utilisateur}`);
            const result = await res.json();
            console.log(result,"rtrt")
            newStatuts[u.id_utilisateur] = {
              statut: result.statut || "inconnu",
              days: result.jours ?? "?"
            };


          } catch (error) {
            console.log("error")
            newStatuts[u.id_utilisateur] = { statut: "erreur", days: "?" };
          }
        }
        setStatuts(newStatuts);
      })
      .catch(err => console.error("Erreur chargement utilisateurs", err));
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

  const supprimerUtilisateur = async (id_utilisateur) => {
    const confirmer = window.confirm("Supprimer cet utilisateur ?");
    if (!confirmer) return;

    await fetch(`/api/utilisateurs/${id_utilisateur}`, { method: "DELETE" });
    setUtilisateurs(utilisateurs.filter(u => u.id_utilisateur !== id_utilisateur));
    setStatuts(prev => {
      const copy = { ...prev };
      delete copy[id_utilisateur];
      return copy;
    });
  };

  const handleNewUserChange = (field, value) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = async () => {
    const { nom, prenom, email, role, mot_de_passe, confirmPassword } = newUser;
    const errors = {};
    if (!mot_de_passe || mot_de_passe !== confirmPassword) {
      errors.mot_de_passe = "Les mots de passe ne correspondent pas.";
    }
    if (Object.keys(errors).length > 0) return setErrors(errors);

    const res = await fetch("/api/utilisateurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, email, role, mot_de_passe, statut: "actif" })
    });

    if (res.ok) {
      alert("Utilisateur créé ✅");
      setNewUser({ nom: "", prenom: "", email: "", role: "utilisateur", mot_de_passe: "", confirmPassword: "", statut: "actif" });
      setErrors({});
      const data = await fetch("/api/utilisateurs").then(r => r.json());
      setUtilisateurs(data);
    } else {
      alert("Erreur lors de la création de l'utilisateur.");
    }
  };

  if (!utilisateur || utilisateur.role !== "responsable") return <Navigate to="/" replace />;

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h2>👥 Gestion des utilisateurs</h2>
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Dern. connexion</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map((u, i) => (
            <tr key={u.id_utilisateur}>
              <td><input value={u.nom} onChange={e => handleChange(i, "nom", e.target.value)} /></td>
              <td><input value={u.prenom} onChange={e => handleChange(i, "prenom", e.target.value)} /></td>
              <td><input value={u.email} onChange={e => handleChange(i, "email", e.target.value)} /></td>
              <td><select value={u.role} onChange={e => handleChange(i, "role", e.target.value)}><option>utilisateur</option><option>responsable</option></select></td>
              <td>{statuts[u.id_utilisateur]?.statut}</td>
              <td>{statuts[u.id_utilisateur]?.days}</td>
              <td>
                <button onClick={() => enregistrer(u)}>💾</button>
                <button onClick={() => supprimerUtilisateur(u.id_utilisateur)}>🗑</button>
                <button onClick={() => supprimerUtilisateur(u.id_utilisateur)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>➕ Ajouter un utilisateur</h3>
      <input placeholder="Nom" value={newUser.nom} onChange={e => handleNewUserChange("nom", e.target.value)} />
      <input placeholder="Prénom" value={newUser.prenom} onChange={e => handleNewUserChange("prenom", e.target.value)} />
      <input placeholder="Email" value={newUser.email} onChange={e => handleNewUserChange("email", e.target.value)} />
      <input placeholder="Mot de passe" type="password" value={newUser.mot_de_passe} onChange={e => handleNewUserChange("mot_de_passe", e.target.value)} />
      <input placeholder="Confirmer le mot de passe" type="password" value={newUser.confirmPassword} onChange={e => handleNewUserChange("confirmPassword", e.target.value)} />
      <select value={newUser.role} onChange={e => handleNewUserChange("role", e.target.value)}>
        <option value="utilisateur">utilisateur</option>
        <option value="responsable">responsable</option>
      </select>
      <button onClick={handleCreateUser}>Créer</button>
    </div>
  );
};

export default Utilisateurs;
