import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const CreateUser = ({ onAdd }) => {
  const { utilisateur } = useAuth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "utilisateur",
    mot_de_passe: "",
    confirmPassword: "",
  });

  const handleToggleForm = () => setShowForm(!showForm);

  const handleChange = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, prenom, email, role, mot_de_passe, confirmPassword } = newUser;
    const errs = {};

    if (!mot_de_passe || mot_de_passe !== confirmPassword) {
      errs.mot_de_passe = "Les mots de passe ne correspondent pas.";
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      const res = await fetch("/api/utilisateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nom,
          prenom,
          email,
          role,
          mot_de_passe,
          statut: "actif",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("✅ Utilisateur ajouté avec succès !");
        setNewUser({
          nom: "",
          prenom: "",
          email: "",
          role: "utilisateur",
          mot_de_passe: "",
          confirmPassword: "",
        });
        if (onAdd) onAdd();
      } else if (res.status === 401) {
        navigate("/login");
      } else {
        const err = await res.json();
        setMessage("❌ Erreur : " + (err));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur de communication avec le serveur.");
    }
  };

  if (!utilisateur || utilisateur.role !== "responsable")
    return <Navigate to="/" replace />;

  return (
    <div className="product-form-container">
      {!showForm && (
        <button className="create-button" onClick={handleToggleForm}>
          Créer un utilisateur
        </button>
      )}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit} style={{gap: "2rem"}}>
          <div className="form-user">
            <label>Nom</label>
            <input
              type="text"
              value={newUser.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              required
            />
          </div>

          <div  className="form-user">
            <label>Prénom</label>
            <input
              type="text"
              value={newUser.prenom}
              onChange={(e) => handleChange("prenom", e.target.value)}
              required
            />
          </div>

          <div  className="form-user">
            <label>Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          <div  className="form-user">
            <label>Mot de passe</label>
            <input
              type="password"
              value={newUser.mot_de_passe}
              onChange={(e) => handleChange("mot_de_passe", e.target.value)}
              required
            />
            {errors.mot_de_passe && (
              <p style={{ color: "red", fontSize: "0.9em" }}>
                {errors.mot_de_passe}
              </p>
            )}
          </div>

          <div  className="form-user">
            <label>Confirmer mot de passe</label>
            <input
              type="password"
              value={newUser.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              required
            />
          </div>

          <div  className="form-user">
            <label>Rôle</label>
            <select
              value={newUser.role}
              onChange={(e) => handleChange("role", e.target.value)}
              required
            >
              <option value="utilisateur">utilisateur</option>
              <option value="responsable">responsable</option>
            </select>
          </div>

          <button type="submit">Valider</button>
          <button
            type="button"
            onClick={handleToggleForm}
            style={{ marginLeft: "10px" }}
          >
            Fermer
          </button>
          {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </form>
      )}
    </div>
  );
};

export default CreateUser;
