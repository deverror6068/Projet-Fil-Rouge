import React, { useEffect, useState } from "react";
import ProductEditForm from "./UpdateProduct";
import { useAuth } from "../contexts/AuthContext";

const SalesData = ({ refresh, setRefresh }) => {
  const [produits, setProduits] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { utilisateur } = useAuth();

  useEffect(() => {
    fetch("/api/produits")
      .then((res) => res.json())
      .then((data) => {
        const produitsArray = Array.isArray(data) ? data : data.produits;
        setProduits(produitsArray || []);
      })
      .catch((err) => console.error("Erreur chargement produits", err));
  }, [refresh]);

  const handleEdit = (produit) => {
    setSelectedProduit(produit);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await fetch(`/api/produits/${id}`, { method: "DELETE" });
      setRefresh((prev) => !prev);
      alert("Produit supprimé");
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const menuButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
    marginRight: "0.5rem",
  };

  return (
    <div
      className="liste"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "500px",
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Liste des produits</h2>

      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div style={{ overflowY: "auto", height: "100%" }} className="scroll-invisible">
          <style>{`
            .scroll-invisible::-webkit-scrollbar { display: none; }
            .scroll-invisible { scrollbar-width: none; }
          `}</style>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, backgroundColor: "#f8f8f8", zIndex: 1 }}>
              <tr>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Nom</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Quantité</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Prix</th>
                {utilisateur?.role === "responsable" && (
                  <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {produits.map((produit) => (
                <tr key={produit.id_produit}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{produit.nom}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{produit.quantite}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{produit.prix} €</td>
                  {utilisateur?.role === "responsable" && (
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                      <button style={menuButtonStyle} onClick={() => handleEdit(produit)}>Modifier</button>
                      <button style={menuButtonStyle} onClick={() => handleDelete(produit.id_produit)}>Supprimer</button>
                    </td>
                  )}
                </tr>
              ))}
              {produits.length === 0 && (
                <tr>
                  <td colSpan={utilisateur?.role === "responsable" ? 4 : 3} style={{ textAlign: "center", padding: "1rem" }}>
                    Aucun produit trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditing && selectedProduit && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
                setRefresh((prev) => !prev);
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
