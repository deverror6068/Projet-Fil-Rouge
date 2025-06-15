// frontend/src/components/MagasinList.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const MagasinList = () => {
  const [magasins, setMagasins] = useState([]);
  const { utilisateur } = useAuth();

  useEffect(() => {
    fetch("/api/magasins", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setMagasins)
      .catch((err) => {
        console.error("Erreur lors du chargement des magasins :", err);
      });
  }, []);
  

  return (
    <div>
      <h2>Liste des magasins</h2>
      <ul>
        {magasins.map((m) => (
          <li key={m.id_magasin}>{m.nom} - {m.ville}</li>
        ))}
      </ul>
    </div>
  );
};

export default MagasinList;