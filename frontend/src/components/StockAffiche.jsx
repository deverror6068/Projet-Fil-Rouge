import React from "react";
import { useState } from "react";

const StockAffiche = {
    Date_commande: [
      "02 Jan 2021", "02 Jan 2021", "02 Jan 2021", "02 Jan 2021",
      "02 Jan 2021", "02 Jan 2021", "02 Jan 2021",
    ],
    Produit: [
      "Ordinateur", "iPhone", "Returned", "Ordinateur",
      "iPhone", "Returned", "Ordinateur", "iPhone", "Ordinateur",
    ],
    Prix: [
      "204.98 F", "24.55 F", "25.88 F", "170.66 F",
      "56.56 F", "44.95 F", "67.33 F", "23.53 F", "46.52 F",
    ],
    Quantité: [
      "2", "1", "3", "4","5", "6", "7", "8", "9",
    ],
    Fournisseur: [
      "Fournisseur 1", "Fournisseur 2", "Fournisseur 3", "Fournisseur 4",
      "Fournisseur 5", "Fournisseur 6", "Fournisseur 7", "Fournisseur 8", "Fournisseur 9",
    ],
  };

const StockAfficche = () => {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    
    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };
    return (
        <div className="stock-box" style={{ display: "flex", flexDirection: "column" , alignItems: "center" , justifyContent: "center", gap: "3rem"}}>
        <div className="title" style={{ fontSize: "2rem"}}>Produits restant en stock</div>
        <div className="stock-details" style={{ display: "flex" , gap: "8rem"}}>
            {Object.entries(StockAffiche).map(([topic, items], i) => (
            <ul className="details-stock" key={i}>
                <li className="topic-stock">{topic}</li>
                {items.map((item, index) => (
                <li key={index}>
                    <a href="#">{item}</a>
                </li>
                ))}
            </ul>
            ))}
        </div>
        <div className="button">
            <a href="#">Voir Tout</a>
        </div>
        </div>
    );
}
export default StockAfficche;