import React, { useState, useEffect } from "react";
import {toast} from "react-toastify";

const ProductEditForm = ({ produit, onUpdate, onClose }) => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [quantite, setQuantite] = useState("");
  const [prix, setPrix] = useState("");

  // Préremplir les champs à partir du produit passé
  useEffect(() => {
    if (produit) {
      setNom(produit.nom || "");
      setDescription(produit.description || "");
      setQuantite(produit.quantite || "");
      setPrix(produit.prix || "");
    }
  }, [produit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduit = {
      nom,
      description,
      quantite: parseInt(quantite),
      prix: parseFloat(prix),
    };

    try {
      const res = await fetch(`/api/produits/${produit.id_produit}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduit),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      const message =(
          <strong> produit modifié !</strong>
      )

      toast.success(message, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      onUpdate && onUpdate(); // Pour rafraîchir la liste côté parent
      onClose && onClose();   // Pour fermer le formulaire
    } catch (err) {
      console.error("Erreur:", err);
      alert("Échec de la mise à jour");
    }
  };

  return (
    <div className="product-form-container">
      <h3>Modifier le produit</h3>
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-proFornisseur">
          <label>Nom de l'article</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>

        <div className="form-proFornisseur" style={{padding: "3px"}}>
          <label>Quantité</label>
          <input type="number" value={quantite} onChange={(e) => setQuantite(e.target.value)} />
        </div>

        <div className="form-proFornisseur">
          <label>Prix unitaire</label>
          <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} />
        </div>

        <div className="form-proFornisseur">
          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <button type="submit" style={{ width: "80%" }} >Enregistrer</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <button type="button" onClick={onClose} style={{ width: "50%" }}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditForm;
