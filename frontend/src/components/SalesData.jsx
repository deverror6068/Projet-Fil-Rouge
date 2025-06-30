import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesData = () => {
  const [commandes, setCommandes] = useState([]);
  const [affichageLimite, setAffichageLimite] = useState(5); // 🔢 nombre de commandes affichées


  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/commandes", {
          withCredentials: true, // si tu utilises les sessions côté serveur
        });
        setCommandes(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des commandes :", err);
      }
    };

    fetchCommandes();
  }, []);
  const commandesAffichees = commandes.slice(0, affichageLimite); // 📊 Limite les commandes visibles

  return (
    <div className="recent-sales box">
      <div className="title">Commandes récentes</div>
      <div className="sales-details">
        <ul className="details-commande">
          <li className="topic">Date</li>
          {commandesAffichees.map((cmd, i) => (
            <li key={i}>
              <a href="#">{new Date(cmd.date_commande).toLocaleDateString()}</a>
            </li>
          ))}
        </ul>
        <ul className="details-commande">
          <li className="topic">Fournisseur</li>
          {commandesAffichees.map((cmd, i) => (
            <li key={i}>
              <a href="#">{cmd.fournisseur}</a>
            </li>
          ))}
        </ul>
        {/* <ul className="details">
          <li className="topic">Produits</li>
          {commandes.map((cmd, i) => (
            <li key={i}>
              <a href="#">
                {(cmd.produits || []).map((p) => `${p.nom} (${p.quantite})`).join(", ")}
              </a>
            </li>
          ))}
        </ul> */}
        <ul className="details-commande">
          <li className="topic">Statut</li>
          {commandesAffichees.map((cmd, i) => (
            <li key={i}>
              <a href="#">{cmd.status}</a>
            </li>
          ))}
        </ul>
      </div>
      {affichageLimite < commandes.length && (
        <div className="button">
          <a href="#" onClick={() => setAffichageLimite(commandes.length)}>Voir tout</a>
        </div>
      )}
    </div>
  );
};

export default SalesData;
