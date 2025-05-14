import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
    const { utilisateur } = useAuth();
    const [commandes, setCommandes] = useState([]);
    const [produits, setProduits] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!utilisateur) {
            navigate("/login");
        } else {
            console.log(utilisateur.role)
            const commandesURL = utilisateur.role === "utilisateur"
                ? "http://localhost:5000/api/commandes/mes-commandes"
                : "http://localhost:5000/api/commandes";

            fetch(commandesURL, { credentials: "include" })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Commandes récupérées :", data); // ← Ajoute ceci
                    setCommandes(data);
                });

            fetch("http://localhost:5000/api/produits", {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((data) => setProduits(data));
        }
    }, [utilisateur, navigate]);

    const produitsFaibleStock = produits.filter((p) => p.quantite <= 5);
    //console.log(produits)

    return (
        <div style={{ padding: "20px" }}>
            <h2>Bienvenue, {utilisateur?.nom}!</h2>
            <p>Email: {utilisateur?.email}</p>
            <p>Rôle: {utilisateur?.role}</p>

            {/* 🚨 Produits en stock faible */}
            <h3 style={{ color: "red" }}>🚨 Produits en stock faible</h3>
            <table style={{ width: "100%", border: "1px solid red", backgroundColor: "#ffe6e6" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Stock</th>
                    <th>Prix</th>
                    <th>Vendeur</th>
                </tr>
                </thead>
                <tbody>
                {produitsFaibleStock.length > 0 ? (
                    produitsFaibleStock.map((produit) => (
                        <tr key={produit.id}>
                            <td>{produit.id_produit}</td>
                            <td>{produit.nom}</td>
                            <td style={{ color: "red", fontWeight: "bold" }}>{produit.quantite}</td>
                            <td>{produit.prix} €</td>
                            <td>{produit.id_vendeur} </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">Aucun produit en stock faible</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* ✅ Liste complète des produits */}
            <h3 style={{ marginTop: "30px" }}>📦 Tous les produits</h3>
            <table border="1" style={{ width: "100%" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Stock</th>
                    <th>Prix</th>
                </tr>
                </thead>
                <tbody>
                {produits.map((produit) => (
                    <tr key={produit.id}>
                        <td>{produit.id_produit}</td>
                        <td>{produit.nom}</td>
                        <td>{produit.quantite}</td>
                        <td>{produit.prix} €</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Commandes */}
            <h3 style={{ marginTop: "30px" }}>📋 Vos commandes</h3>
            <table border="1" style={{ width: "100%" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Id Fournisseur</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {commandes.length > 0 ? (
                    commandes.map((commande) => (
                        <tr key={commande.id_commande}>
                            <td>{commande.id_commande}</td>
                            <td>{commande.date_commande}</td>
                            <td>{commande.id_fournisseur}</td>
                            <td>{commande.status}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">Aucune commande trouvée</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;