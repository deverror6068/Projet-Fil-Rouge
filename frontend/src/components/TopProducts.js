import React, { useEffect, useState } from "react";
import axios from "axios";

const TopProducts = () => {
  const [produits, setProduits] = useState([]);
  const [limite, setLimite] = useState(5);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/produits", {
          withCredentials: true, // si tu utilises des sessions
        });
        setProduits(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);
      }
    };

    fetchProduits();
  }, []);

  const produitsAffiches = produits.slice(0, limite);

  return (
    <div className="top-sales box">
      <div className="title">Produits disponibles</div>
      <ul className="top-sales-details">
        {produitsAffiches.map((product, i) => (
          <li key={i}>
            <a href="#">
              <span className="product">{product.nom}</span>
            </a>
            <span className="price">{product.prix ? `${product.prix} €` : "-"}</span>
          </li>
        ))}
      </ul>

      {limite < produits.length && (
        <div className="button" style={{ marginTop: "10px", textAlign: "center" }}>
          <a href="#" onClick={() => setLimite(produits.length)}>
            Voir tout
          </a>
        </div>
      )}
    </div>
  );
};

export default TopProducts;
