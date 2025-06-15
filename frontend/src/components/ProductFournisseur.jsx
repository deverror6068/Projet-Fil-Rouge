import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Assure-toi d'utiliser react-router
import UpdateProduct from "./UpdateProduct";

const FournisseurProduits = () => {
  const { id } = useParams(); // récupère l’id de l’URL
  const [produits, setProduits] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch(`/api/produits/${id}/produitFournisseur`)
      .then((res) => res.json())
      .then(setProduits)
      .catch((err) => console.error("Erreur chargement produits", err));
  }, [id, refresh]);

  return (
    <div className="recent-sales box">
      <div className="title">Produits du fournisseur {id}</div>
      <ul>
        {produits.map((p) => (
          <li key={p.id_produit}>
            <strong>{p.nom_produit}</strong> - {p.prix_vente} F - {p.quantite}
            <button
                className="menu-button"
                style={menuButtonStyle}
                onClick={() => toggleMenu(index)}
            >
                ...
            </button>
            {openMenuIndex === index && (
                <div className="dropdown-menu" style={dropdownMenuStyle}>
                <button style={dropdownButtonStyle} onClick={() => handleEdit(produit)}>Modifier</button>
                <button style={dropdownButtonStyle} onClick={() => handleDelete(produit.id_produit)}>Supprimer</button>
                </div>

            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FournisseurProduits;
