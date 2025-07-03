import React, { useState } from "react";
import {toast} from "react-toastify";

const FournisseurForm = ({ onAdd }) => {
  const [showForm, setShowForm] = useState(false);

  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  const toggleForm = () => setShowForm(!showForm);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fournisseur = {
      nom,
      adresse,
      email,
      telephone,
    };


    try {
      const res = await fetch("http://localhost:5000/api/fournisseurs", {
        credentials: "include", 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fournisseur),
      });


      if (!res.ok) throw new Error("Erreur lors de la création");


      const message =(
          <strong> Fournisseur ajouté avec succès !</strong>
      )
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      setNom("");
      setAdresse("");
      setEmail("");
      setTelephone("");
      setShowForm(false);

/*

      const message =(
          <strong> Commande supprimée !</strong>
      )
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
*/

      if (onAdd) onAdd();
    } catch (err) {
      console.error("❌ Erreur:", err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="product-form-container">
      {!showForm && (
        <button className="create-button" onClick={toggleForm}>
          ➕ Ajouter un fournisseur
        </button>
      )}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-proFornisseur">
            <label>Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          

          <div className="form-proFornisseur">
            <label>Adresse</label>
            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              required
            />
          </div>

          <div className="form-proFornisseur">  
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-proFornisseur">
            <label>Téléphone</label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <button type="submit" style={{ width: "80%" }} >Valider</button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <button type="button" onClick={toggleForm} style={{ width: "50%" }}>
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FournisseurForm;
