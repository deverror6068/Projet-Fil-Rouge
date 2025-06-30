import React, { useEffect, useState } from "react";
import UpdateFournisseur from "./UpdateFournisseur"; // le composant pour modifier un fournisseur
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const FournisseurTable = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [limit, setLimit] = useState(5);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [produitsFournisseur, setProduitsFournisseur] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/fournisseurs")
      .then((res) => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFournisseurs(data);
        } else {
          console.error("❌ Données invalides reçues :", data);
          setFournisseurs([]);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement fournisseurs", err);
        setFournisseurs([]);
      });
  }, [refresh]);

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;

    try {
      await fetch(`/api/fournisseurs/${id}`, { method: "DELETE" });
      setRefresh(!refresh);
      alert("Fournisseur supprimé");
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleEdit = (fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setIsEditing(true);
    setOpenMenuIndex(null);
  };

  const handleFournisseurClick = async (id) => {
    try {
      const res = await fetch(`/api/fournisseurs/fournisseur/${id}`);
      const data = await res.json();
      console.log("Produits récupérés pour le fournisseur", id, ":", data);

      setProduitsFournisseur(data);
      setShowModal(true);
    } catch (err) {
      console.error("Erreur chargement produits fournisseur :", err);
      setProduitsFournisseur([]);
    }
  };

  const fournisseursAffiches = fournisseurs.slice(0, limit);

  const dropdownButtonStyle = {
    padding: "5px 10px",
    backgroundColor: "#eee",
    border: "1px solid #ccc",
    cursor: "pointer"
  };
  
  return (
    <div>
      <div
      className="recent-sales box"
      style={{
        width: "100%",
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
      <div className="title" style={{ marginBottom: "1rem" }}>
        Liste des fournisseurs
      </div>

      <div
        className="sales-details"
        style={{
          display: "flex",
          gap: "5rem",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* <style>{`
          .sales-details::-webkit-scrollbar { width: 0px; }
          .sales-details { scrollbar-width: none; }
          ul.details-fournisseur { flex: 1; min-width: 0; padding: 0; list-style: none; }
          ul.details-fournisseur li.topic {
            position: sticky;
            top: 0;
            background: white;
            z-index: 2;
            font-weight: bold;
            padding: 0.5rem 0;
          }
          ul.details-fournisseur li {
            margin: 0.25rem 0;
            padding: 0.25rem;
          }
        `}</style> */}

        <ul className="details-fournisseur" style={{ marginTop: "0rem" }}>
          <li className="topic">Nom</li>
          {fournisseurs.map((f) => (
            <li key={f.id_fournisseur}>
              <button
                onClick={() => handleFournisseurClick(f.id_fournisseur)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline"
                }}
              >
                {f.nom}
              </button>
            </li>
          ))}
        </ul>

        <ul className="details-fournisseur" style={{ marginTop: "0rem" }}>
          <li className="topic">Téléphone</li>
          {fournisseurs.map((f) => (
            <li key={f.id_fournisseur}>{f.telephone}</li>
          ))}
        </ul>

        <ul className="details-fournisseur" style={{ marginTop: "0rem" }}>
          <li className="topic">Email</li>
          {fournisseurs.map((f) => (
            <li key={f.id_fournisseur}>{f.email}</li>
          ))}
        </ul>

        <ul className="details-fournisseur" style={{ marginTop: "0rem" }}>
          <li className="topic">Actions</li>
          {fournisseurs.map((f, index) => (
            <li key={f.id_fournisseur} style={{ position: "relative" }}>
              <button className="menu-button" onClick={() => toggleMenu(index)}>...</button>
              {openMenuIndex === index && (
                <div
                  style={{
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
                    minWidth: "120px"
                  }}
                >
                  <button
                    style={{ background: "none", border: "none", padding: "5px 10px", cursor: "pointer", textAlign: "left" }}
                    onClick={() => navigate(`/modifier/${f.id_fournisseur}`)}
                  >
                    Modifier
                  </button>
                  <button
                    style={{ background: "none", border: "none", padding: "5px 10px", cursor: "pointer", textAlign: "left" }}
                    onClick={() => handleDelete(f.id_fournisseur)}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      </div>
      {/* {isEditing && selectedFournisseur && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", width: "80%", maxHeight: "90vh", overflowY: "auto" }}>
            <UpdateFournisseur
              fournisseur={selectedFournisseur}
              onClose={() => {
                setIsEditing(false);
                setSelectedFournisseur(null);
                setRefresh(!refresh);
              }}
            />
          </div>
        </div>
      )} */}
  
      {/* Modal */}
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
}
export default FournisseurTable;  