import React, { useEffect, useState } from "react";
import axios from "axios";

const TopProducts = () => {
  const [produits, setProduits] = useState([]);
  const [limite, setLimite] = useState(10);

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
  const produitsAffiches = produitsFaibleStock.slice(0, limite);

  return (
    <div className="top-sales box" style={{ border: "2px solid red", backgroundColor: "#ffe6e6" }}>
      <div className="title" style={{ color: "red" }}>🚨 Produits en stock faible</div>
      {produitsFaibleStock.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid red" }}>
                <th>ID</th>
                <th>Nom</th>
                <th>Stock</th>
                <th>Prix</th>
                <th>Vendeur</th>
              </tr>
            </thead>
            <tbody>
              {produitsAffiches.map((produit) => (
                <tr key={produit.id_produit}>
                  <td>{produit.id_produit}</td>
                  <td>{produit.nom}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>{produit.quantite}</td>
                  <td>{produit.prix ? `${produit.prix} €` : "-"}</td>
                  <td>{produit.id_vendeur ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {limite < produitsFaibleStock.length && (
            <div className="button" style={{ marginTop: "10px", textAlign: "center" }}>
              <a href="#" onClick={() => setLimite(produitsFaibleStock.length)}>
                Voir tout
              </a>
            </div>
          )}
        </div>
      ) : (
        <p style={{ textAlign: "center", padding: "10px" }}>Aucun produit en stock faible</p>
      )}
    </div>
  );
};

export default TopProducts;
