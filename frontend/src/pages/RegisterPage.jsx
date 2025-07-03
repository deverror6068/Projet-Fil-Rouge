

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/LoginPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
    confirmPassword: "",
    role: "utilisateur",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.mot_de_passe !== formData.confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 201) {
        alert("Inscription réussie 🎉");
        navigate("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Erreur réseau ou serveur.");
    }
  };

  return (
    <div className="card login-card shadow mx-auto mt-5" id="form">
      <div className="card-body p-4">
        <div className="text-center mb-4">
          <h5 className="card-title fw-bold display-6">Créer un compte</h5>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Adresse mail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Mot de passe"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirmer le mot de passe"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>



          <button type="submit" className="btn w-100 modern-btn">
            S'inscrire
          </button>

          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
