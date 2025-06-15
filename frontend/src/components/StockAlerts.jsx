import React, { useEffect, useState } from "react";

const StockAlerts = () => {
  const [ruptures, setRuptures] = useState([]);
  const [bientot, setBientot] = useState([]);

  useEffect(() => {
    fetch("/api/notifications/ruptures-stock")
      .then((res) => res.json())
      .then((data) => {
        setRuptures(data.rupture || []);
        setBientot(data.bientot || []);
      })
      .catch((err) => console.error("Erreur chargement ruptures", err));
  }, []);

  if (ruptures.length === 0 && bientot.length === 0) return null;

  return (
    <div className="alert-container" style={{ padding: "10px", backgroundColor: "#ffe0e0", border: "1px solid red", marginBottom: "20px" }}>
      {ruptures.length > 0 && (
        <div className="alert rupture">
          <h4>❌ Produits en rupture :</h4>
          <ul>
            {ruptures.map((p) => (
              <li key={p.id_produit}>{p.nom} (stock: {p.quantite})</li>
            ))}
          </ul>
        </div>
      )}

      {bientot.length > 0 && (
        <div className="alert warning">
          <h4>⚠️ Produits bientôt en rupture :</h4>
          <ul>
            {bientot.map((p) => (
              <li key={p.id_produit}>{p.nom} (stock: {p.quantite})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StockAlerts;
