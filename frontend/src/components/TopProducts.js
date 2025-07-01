import React, { useEffect, useState } from "react";
import axios from "axios";

const TopProducts = () => {
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

  return (
    <div className="liste" style={{
      display: "flex",
      flexDirection: "column",
      height: "500px",
      width: "100%",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "1rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      background: "#fff"
    }}>
      <h2 style={{ marginBottom: "1rem" }}>Produits disponibles</h2>

      <div style={{ flex: 1, overflowY: "auto" }} className="scroll-invisible">
        <style>{`
          .scroll-invisible::-webkit-scrollbar { display: none; }
          .scroll-invisible { scrollbar-width: none; }
        `}</style>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ position: "sticky", top: 0, backgroundColor: "#f9f9f9", zIndex: 1 }}>
            <tr>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Produit</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Prix</th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Quantité</th>
            </tr>
          </thead>
          <tbody>
            {produits.map((product, i) => (
              <tr key={i}>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{product.nom}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {product.prix ? `${product.prix} €` : "-"}
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  {product.quantite ?? "-"}
                </td>
              </tr>
            ))}
            {produits.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "1rem" }}>
                  Aucun produit disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProducts;
