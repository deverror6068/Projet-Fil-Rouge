import React, { useEffect, useState } from "react";
import axios from "axios";

const LowStockProducts = () => {
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/produits", {
          withCredentials: true,
        });
        setProduits(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);
      }
    };

    fetchProduits();
  }, []);

  const produitsFaibleStock = produits.filter((p) => p.quantite <= 5);

  return (
    <div
      className="top-sales box"
      style={{
        border: "2px solid red",
        backgroundColor: "#ffe6e6",
        padding: "1rem",
        borderRadius: "8px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        width: "60%",
      }}
    >
      <div className="title" style={{ color: "red", marginBottom: "1rem" }}>
        🚨 Produits en stock faible
      </div>

      {produitsFaibleStock.length > 0 ? (
        <div
          style={{ overflowY: "auto", flex: 1 }}
          className="scroll-invisible"
        >
          <style>{`
            .scroll-invisible::-webkit-scrollbar { display: none; }
            .scroll-invisible { scrollbar-width: none; }
          `}</style>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, backgroundColor: "#ffe6e6", zIndex: 1 }}>
              <tr style={{ borderBottom: "1px solid red" }}>
                <th>ID</th>
                <th>Nom</th>
                <th>Stock</th>
                <th>Prix</th>
                <th>Vendeur</th>
              </tr>
            </thead>
            <tbody>
              {produitsFaibleStock.map((produit) => (
                <tr key={produit.id_produit}>
                  <td>{produit.id_produit}</td>
                  <td>{produit.nom}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>
                    {produit.quantite}
                  </td>
                  <td>{produit.prix ? `${produit.prix} €` : "-"}</td>
                  <td>{produit.id_vendeur ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ textAlign: "center", padding: "10px" }}>
          Aucun produit en stock faible
        </p>
      )}
    </div>
  );
};

export default LowStockProducts;
