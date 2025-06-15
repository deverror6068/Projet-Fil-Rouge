import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const NotificationPage = () => {
  const [rupture, setRupture] = useState([]);
  const [bientot, setBientot] = useState([]);

  useEffect(() => {
    fetch("/api/notifications/ruptures-stock")
      .then((res) => res.json())
      .then((data) => {
        setRupture(data.rupture || []);
        setBientot(data.bientot || []);
      })
      .catch((err) => console.error("Erreur chargement ruptures", err));
  }, []);

  const isEmpty = rupture.length === 0 && bientot.length === 0;

  return (
    <>
      <Sidebar />
      <section className="home-section">
        <Navbar />
        <div className="home-content">
          <h2>Notifications de rupture de stock</h2>

          {isEmpty ? (
            <p>Aucune alerte de stock pour le moment ✅</p>
          ) : (
            <div className="alert-container" style={{ padding: "10px", backgroundColor: "#ffe0e0", border: "1px solid red", marginTop: "20px" }}>
              {rupture.length > 0 && (
                <>
                  <h4>❌ Produits en rupture :</h4>
                  <ul>
                    {rupture.map((produit) => (
                      <li key={produit.id_produit}>
                        {produit.nom} (Quantité : {produit.quantite})
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {bientot.length > 0 && (
                <>
                  <h4>⚠️ Produits bientôt en rupture :</h4>
                  <ul>
                    {bientot.map((produit) => (
                      <li key={produit.id_produit}>
                        {produit.nom} (Quantité : {produit.quantite})
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default NotificationPage;
