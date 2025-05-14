// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [erreur, setErreur] = useState("");
    const navigate = useNavigate();
    const { utilisateur, enChargement,setUtilisateur} = useAuth(); // 👈 Import du contexte

    useEffect(() => {
        if (!enChargement && utilisateur) {
            navigate("/dashboard");
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
        <div style={{ maxWidth: 400, margin: "auto" }}>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email}
                       onChange={(e) => setEmail(e.target.value)} required /><br />
                <input type="password" placeholder="Mot de passe" value={motDePasse}
                       onChange={(e) => setMotDePasse(e.target.value)} required /><br />
                <button type="submit">Se connecter</button>
            </form>
            {erreur && <p style={{ color: "red" }}>{erreur}</p>}
        </div>
    );
};

export default LoginPage;
