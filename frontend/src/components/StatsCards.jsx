import React, { useEffect, useState } from "react";

import axios from "axios"

import { useAuth } from "../contexts/AuthContext";



const StatsCards = () => {
  const [stats, setStats] = useState({
    commandes: 0,
    produits: 0,
    fournisseurs: 0,
    utilisateurs:0,
  });

  const { utilisateur } = useAuth();




  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/stats", {
          withCredentials: true,
        });

        setStats(res.data);




      } catch (err) {
        console.error("Erreur lors de la récupération des stats :", err);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      topic: "Commandes",
      number: stats.commandes,
      icon: "bx bx-cart-alt cart",
      trend: "Total",
      arrow: "bx bx-up-arrow-alt",
      link: "/command",
    },
    {
      topic: "Produits",
      number: stats.produits,
      icon: "bx bxs-cart-add cart two",
      trend: "Total",
      arrow: "bx bx-up-arrow-alt",
      link: "/products",
    },
    {
      topic: "Fournisseurs",
      number: stats.fournisseurs,
      icon: "bx bx-user cart three",
      trend: "Total",
      arrow: "bx bx-up-arrow-alt",
      link: "/fournisseurs",
    },

    ...(utilisateur.role ==="responsable"
        ? [
          {
            topic: "Utilisateurs",
            number: stats.utilisateurs.nb,
            icon: "bx bx-group cart four",
            trend: "Total",
            arrow: "bx bx-up-arrow-alt",
            link: "/analyse",
          },
        ]
        : []),
  ];

  return (
    <div className="overview-boxes">
      {cards.map((card, i) => (
        <div className="box" key={i}>
          <div className="right-side">
            <div className="box-topic">{card.topic}</div>
            <div className="number">{card.number}</div>
            <div className="indicator">
              <i className={card.arrow}></i>
              <span className="text">{card.trend}</span>
            </div>
          </div>
          <i className={card.icon}></i>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
