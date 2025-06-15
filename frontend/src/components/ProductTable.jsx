// // components/SalesData.jsx
// import React from "react";
// import { useState } from "react";

// const salesDetails = {
//   Date: [
//     "02 Jan 2021", "02 Jan 2021", "02 Jan 2021", "02 Jan 2021",
//     "02 Jan 2021", "02 Jan 2021", "02 Jan 2021",
//   ],
  
//   Produit: [
//     "Ordinateur", "iPhone", "Returned", "Ordinateur",
//     "iPhone", "Returned", "Ordinateur", "iPhone", "Ordinateur",
//   ],
//   Prix: [
//     "204.98 F", "24.55 F", "25.88 F", "170.66 F",
//     "56.56 F", "44.95 F", "67.33 F", "23.53 F", "46.52 F",
//   ],
// };

// const SalesData = () => {
//     const [openMenuIndex, setOpenMenuIndex] = useState(null);

//     const toggleMenu = (index) => {
//       setOpenMenuIndex(openMenuIndex === index ? null : index);
//     };
//   return (
//     <div className="recent-sales box">
//       <div className="title">Liste des produits</div>
//       <div className="sales-details">
//         {Object.entries(salesDetails).map(([topic, items], i) => (
//           <ul className="details" key={i}>
//             <li className="topic">{topic}</li>
//             {items.map((item, index) => (
//               <li key={index}>
//                 <a href="#">{item}</a>
//               </li>
//             ))}
//           </ul>
//         ))}
//         <ul className="details">
//           <li className="topic">Actions</li>
//           {salesDetails.Produit.map((_, index) => (
//             <li key={index} style={{ position: "relative" }}>
//               <button className="menu-button" onClick={() => toggleMenu(index)}>...</button>
//               {openMenuIndex === index && (
//                 <div className="dropdown-menu">
//                   <button onClick={() => alert("Modifier")}>Modifier</button>
//                   <button onClick={() => alert("Supprimer")}>Supprimer</button>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="button">
//         <a href="#">Voir Tout</a>
//       </div>
//     </div>
//   );
// };

// export default SalesData;
import React, { useEffect, useState } from "react";
import ProductEditForm from "./UpdateProduct";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SalesData = () => {
  const [produits, setProduits] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [limit, setLimit] = useState(5);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const { utilisateur } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/produits")
      .then((res) => res.json())
      .then(setProduits)
      .catch((err) => console.error("Erreur chargement produits", err));
  }, [refresh]);

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;

    try {
      await fetch(`/api/produits/${id}`, { method: "DELETE" });
      setRefresh(!refresh);
      alert("Produit supprimé");
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleEdit = (produit) => {
    setSelectedProduit(produit);
    setIsEditing(true);
    setOpenMenuIndex(null);
  };

  const produitsAffiches = produits.slice(0, limit);

  const menuButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "0 5px",
  };

  const dropdownMenuStyle = {
    position: "absolute",
    top: "25px",
    right: "0",
    background: "white",
    border: "1px solid #ccc",
    padding: "5px",
    zIndex: 100,
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
  };

  const dropdownButtonStyle = {
    background: "none",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    textAlign: "left",
  };

  return (
    <div
      className="recent-sales box"
      style={{
        width: "56%",
        height: "580px",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <div className="title" style={{ marginBottom: "1rem" }}>Liste des produits</div>

      <div
        className="sales-details"
        style={{
          display: "flex",
          gap: "1rem",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <style>{`
          .sales-details::-webkit-scrollbar { width: 0px; }
          .sales-details { scrollbar-width: none; }
          ul.details { flex: 1; min-width: 0; }
          ul.details li { word-break: break-word; }
          ul.details li.topic {
            position: sticky;
            top: -11px;
            background: white;
            z-index: 2;
            font-weight: bold;
            padding: 0.5rem 0;
          }
        `}</style>

        <ul className="details">
          <li className="topic">Nom</li>
          {produits.map((produit) => (
            <li key={produit.id_produit}><a href="#">{produit.nom}</a></li>
          ))}
        </ul>

        <ul className="details">
          <li className="topic">Quantité</li>
          {produits.map((produit) => (
            <li key={produit.id_produit}><a href="#">{produit.quantite}</a></li>
          ))}
        </ul>

        <ul className="details">
          <li className="topic">Prix</li>
          {produits.map((produit) => (
            <li key={produit.id_produit}><a href="#">{produit.prix} €</a></li>
          ))}
        </ul>

        {utilisateur?.role === "responsable" && (
          <ul className="details">
            <li className="topic">Actions</li>
            {produits.map((produit, index) => (
              <li key={produit.id_produit} style={{ position: "relative" }}>
                <button style={menuButtonStyle} onClick={() => toggleMenu(index)}>...</button>
                {openMenuIndex === index && (
                  <div style={dropdownMenuStyle}>
                    <button style={dropdownButtonStyle} onClick={() => handleEdit(produit)}>Modifier</button>
                    <button style={dropdownButtonStyle} onClick={() => handleDelete(produit.id_produit)}>Supprimer</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal pour modification */}
      {isEditing && selectedProduit && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <ProductEditForm
              produit={selectedProduit}
              onClose={() => {
                setIsEditing(false);
                setSelectedProduit(null);
              }}
              onUpdate={() => {
                setRefresh(!refresh);
                setIsEditing(false);
                setSelectedProduit(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesData;
