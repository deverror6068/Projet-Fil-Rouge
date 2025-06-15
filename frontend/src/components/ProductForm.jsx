import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductForm = ({ onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const { utilisateur } = useAuth();

  // Champs individuels du formulaire
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("Ordinateur");
  const [quantite, setQuantite] = useState("");
  const [prix, setPrix] = useState("");

  const [message, setMessage] = useState("");

  const handleToggleForm = () => setShowForm(!showForm);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nom,
      description,
      prix: parseFloat(prix),
      quantite: parseInt(quantite),
      id_vendeur: utilisateur?.id_utilisateur || utilisateur?.id // au cas où
    };

    try {
      const res = await fetch("http://localhost:5000/api/produits/simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("✅ Produit ajouté avec succès !");
        // Réinitialiser le formulaire
        setNom("");
        setDescription("Ordinateur");
        setPrix("");
        setQuantite("");
        if (onAdd) onAdd(data); // si tu veux rafraîchir la liste des produits
      } else if (res.status === 401) {
        navigate("/login");
      } else {
        const err = await res.json();
        setMessage("❌ Erreur : " + (err.error || err.message));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur de communication avec le serveur.");
    }
  };

  return (
    <div className="product-form-container">
      {!showForm && (
        <button className="create-button" onClick={handleToggleForm}>
          Créer un produit
        </button>
      )}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-proFornisseur">
            <label>Nom de l'article</label>
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
          </div>

          <div className="form-proFornisseur">
            <label>Quantité du produit</label>
            <input type="number" value={quantite} onChange={(e) => setQuantite(e.target.value)} required />
          </div>

          <div className="form-proFornisseur">
            <label>Prix unitaire</label>
            <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} required />
          </div>

          <div className="form-proFornisseur">
            <label>Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          {/* <button type="submit">Valider</button> */}
          {/* un button ferme ou quitte */}
          {/* <button type="button" onClick={handleToggleForm} style={{ marginLeft: "10px" }}>
            Fermer
          </button> */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <button type="submit" style={{ width: "80%" }} >Valider</button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <button type="button" onClick={handleToggleForm} style={{ width: "50%" }}>
              Annuler
            </button>
          </div>
          {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </form>
      )}
    </div>
  );
};

export default ProductForm;
