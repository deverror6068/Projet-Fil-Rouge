// components/SearchBox.jsx
import React, { useState } from "react";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFournisseurProduits, setSelectedFournisseurProduits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults(null);
      return;
    }

    fetch(`/api/search?q=${encodeURIComponent(value)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setShowDropdown(true);
      })
      .catch((err) => {
        console.error("Erreur recherche :", err);
        setResults(null);
      });
  };

  const handleFournisseurClick = (idFournisseur) => {
    fetch(`/api/fournisseurs/fournisseur/${idFournisseur}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedFournisseurProduits(data);
        setModalVisible(true);
      })
      .catch((err) => {
        console.error("Erreur chargement produits fournisseur :", err);
        setSelectedFournisseurProduits([]);
      });
  };

  return (
    <div className="search-box" style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Recherche..."
        value={query}
        onChange={handleChange}
        style={{
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "250px",
        }}
      />
      {showDropdown && results && (
        <div
          className="dropdown"
          style={{
            position: "absolute",
            top: "40px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "100%",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {results.fournisseurs?.length > 0 && (
            <div>
              <strong>Fournisseurs</strong>
              <ul>
                {results.fournisseurs.map((f) => (
                  <li key={f.id}>
                    <button
                      onClick={() => handleFournisseurClick(f.id)}
                      style={{
                        all: "unset",
                        cursor: "pointer",
                        color: "blue",
                        textDecoration: "underline",
                      }}
                    >
                      {f.nom}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.produits?.length > 0 && (
            <div>
              <strong>Produits</strong>
              <ul>
                {results.produits.map((p) => (
                  <li key={p.id}>{p.nom}</li>
                ))}
              </ul>
            </div>
          )}

          {results.commandes?.length > 0 && (
            <div>
              <strong>Commandes</strong>
              <ul>
                {results.commandes.map((c) => (
                  <li key={c.id}>Commande #{c.id}</li>
                ))}
              </ul>
            </div>
          )}

          {results.produits?.length === 0 &&
            results.fournisseurs?.length === 0 &&
            results.commandes?.length === 0 && <p>Aucun résultat.</p>}
        </div>
      )}

      {modalVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "60%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h3>Produits du fournisseur</h3>
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
                {selectedFournisseurProduits.map((produit, idx) => (
                  <tr key={idx}>
                    <td>{produit.nom_produit}</td>
                    <td>{produit.description}</td>
                    <td>{produit.prix} F</td>
                    <td>{produit.quantite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button onClick={() => setModalVisible(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
