import React, { useState } from "react";

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
      const res = await fetch("/api/fournisseurs", {
        credentials: "include", 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fournisseur),
      });

      if (!res.ok) throw new Error("Erreur lors de la création");

      alert("✅ Fournisseur ajouté avec succès");
      setNom("");
      setAdresse("");
      setEmail("");
      setTelephone("");
      setShowForm(false);

      onAdd && onAdd(); // rafraîchit si fourni
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Adresse</label>
            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>  
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>Téléphone</label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
          </div>

          <button type="submit">Valider</button>
          <button
            type="button"
            onClick={toggleForm}
            style={{ marginLeft: "10px" }}
          >
            Fermer
          </button>
        </form>
      )}
    </div>
  );
};

export default FournisseurForm;
