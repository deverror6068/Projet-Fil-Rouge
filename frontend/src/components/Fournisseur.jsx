import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateFournisseur from "./UpdateFournisseur";

const FournisseurTable = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [produitsFournisseur, setProduitsFournisseur] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/fournisseurs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFournisseurs(data);
        } else {
          console.error("❌ Données invalides :", data);
          setFournisseurs([]);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement fournisseurs", err);
        setFournisseurs([]);
      });
  }, [refresh]);

  const handleEdit = (fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;

    try {
      await fetch(`/api/fournisseurs/${id}`, { method: "DELETE" });
      setRefresh((prev) => !prev);
      alert("Fournisseur supprimé");
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleFournisseurClick = async (id) => {
    try {
      const res = await fetch(`/api/fournisseurs/fournisseur/${id}`);
      const data = await res.json();
      setProduitsFournisseur(data);
      setShowModal(true);
    } catch (err) {
      console.error("Erreur chargement produits fournisseur :", err);
      setProduitsFournisseur([]);
    }
  };

  const menuButtonStyle = {
    marginRight: "10px",
    padding: "5px 10px",
    cursor: "pointer",
    border: "1px solid #ccc",
    borderRadius: "5px",
    background: "#f0f0f0",
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
      <h2 style={{ marginBottom: "1rem" }}>Liste des fournisseurs</h2>

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
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Téléphone</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Email</th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fournisseurs.map((fournisseur) => (
                <tr key={fournisseur.id_fournisseur}>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd", cursor: "pointer", color: "blue" }}
                    onClick={() => handleFournisseurClick(fournisseur.id_fournisseur)}
                  >
                    {fournisseur.nom}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{fournisseur.telephone}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{fournisseur.email}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    <button style={menuButtonStyle} onClick={() => handleEdit(fournisseur)}>Modifier</button>
                    <button style={menuButtonStyle} onClick={() => handleDelete(fournisseur.id_fournisseur)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {fournisseurs.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "1rem" }}>
                    Aucun fournisseur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditing && selectedFournisseur && (
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
            <UpdateFournisseur
              fournisseur={selectedFournisseur}
              onClose={() => {
                setIsEditing(false);
                setSelectedFournisseur(null);
              }}
              onUpdate={() => {
                setRefresh((prev) => !prev);
                setIsEditing(false);
                setSelectedFournisseur(null);
              }}
            />
          </div>
        </div>
      )}

      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "60%",
            maxHeight: "80vh",
            overflowY: "auto",
          }}>
            <h3>Produits du fournisseur</h3>
            <div style={{ overflowY: "auto", maxHeight: "50vh" }}>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Prix</th>
                    <th>Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  {produitsFournisseur.map((produit, idx) => (
                    <tr key={idx}>
                      <td>{produit.nom_produit}</td>
                      <td>{produit.description}</td>
                      <td>{produit.prix} F</td>
                      <td>{produit.quantite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button onClick={() => setShowModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FournisseurTable;
