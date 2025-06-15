import { useAuth } from "../contexts/AuthContext";
import React, { useEffect, useState } from "react";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const { utilisateur } = useAuth();

  useEffect(() => {
    fetch(`/api/stocks`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setStocks(data);
          console.log("📦 Stocks récupérés :", data);
        } else {
          console.warn("❌ Format de réponse inattendu :", data);
          setStocks([]);
        }
      })
      .catch((err) => {
        console.error("Erreur récupération stocks :", err);
        setStocks([]);
      });
  }, []);

  return (
    <div>
      <h2>
        {utilisateur?.role === "admin"
          ? "Stock de tous les magasins"
          : "Stock de votre magasin"}
      </h2>
      {stocks.length > 0 ? (
        <ul>
          {stocks.map((s) => (
            <li key={s.id_stock}>
              {s.nom} — {s.quantite} en stock (alerte à {s.seuil_alerte})
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun stock trouvé pour ce magasin.</p>
      )}
    </div>
  );
};

export default StockList;
