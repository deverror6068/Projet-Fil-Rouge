import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();
  const { utilisateur, enChargement, setUtilisateur } = useAuth();

  useEffect(() => {
    if (!enChargement && utilisateur) {
      // navigate("/dashboard");
    }
  }, [utilisateur, enChargement, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, motDePasse);

      const res = await fetch("http://localhost:5000/api/auth/verifier-session", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUtilisateur(data.utilisateur); // ✅ Mise à jour du contexte
        navigate("/dashboard");
      } else {
        setErreur("Session non active après la connexion.");
      }
    } catch (err) {
      setErreur("Email ou mot de passe incorrect.");
    }
  };

  if (enChargement) return <p>Chargement...</p>;

  return (
      <div className="card login-card shadow mx-auto mt-5" id="form">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h5 className="card-title fw-bold display-6">Se connecter</h5>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label visually-hidden">Adresse mail</label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Adresse mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="motDePasse" className="form-label visually-hidden">Mot de passe</label>
              <input
                  type="password"
                  id="motDePasse"
                  name="password"
                  className="form-control"
                  placeholder="Mot de passe"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  autoComplete="current-password"
                  required
              />
            </div>

            <button type="submit" className="btn w-100 modern-btn">
              Se connecter
            </button>

            {erreur && <p style={{ color: "red" }} className="mt-2">{erreur}</p>}

            <div className="text-center mt-3">
              <span>Pas encore de compte ? </span>
              <a href="/register">S'inscrire</a>
            </div>
          </form>
        </div>
      </div>
  );
};

export default LoginPage;
