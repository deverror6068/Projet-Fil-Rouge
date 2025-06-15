// components/CommandContentList.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const CommandContentList = () => {
  const [contenus, setContenus] = useState([]);
  const { utilisateur } = useAuth();

  useEffect(() => {
    fetch("http://localhost:5000/api/contenus/details", {
      credentials: "include", // ✅ permet d’envoyer le cookie de session
    })
      .then((res) => res.json())
      .then((data) => setContenus(data))
      .catch((err) => console.error("Erreur:", err));
  }, []);
  

  return (
    <div className="command-details">
      <h2>Contenus de toutes les commandes</h2>
      <table>
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Historique</th>
          </tr>
        </thead>
        <tbody>
  {Array.isArray(contenus) ? (
    contenus.map((item) => (
      <tr key={item.id_contenu}>
        <td>{item.nom_produit}</td>
        <td>{item.quantite}</td>
        <td>{item.date_commande?.slice(0, 10)}</td>
        <td>{item.statut}</td>
        <td>{item.historique}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} style={{ textAlign: "center", color: "red" }}>
        Erreur ou pas de contenu disponible.
      </td>
    </tr>
  )}
</tbody>
      </table>
    </div>
  );
}
export default CommandContentList;