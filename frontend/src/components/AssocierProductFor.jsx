import React, { useEffect, useState } from "react";

const AssocierFournisseurPage = () => {
  const [produits, setProduits] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    id_produit: "",
    id_fournisseur: "",
    prix: "",
    reference_fournisseur: ""
  });

  const handleToggleForm = () => setShowForm(!showForm);

  useEffect(() => {
    fetch("http://localhost:5000/api/produits", { credentials: "include" })
      .then(res => res.json())
      .then(setProduits)
      .catch(err => console.error("Erreur produits", err));

    fetch("http://localhost:5000/api/fournisseurs", { credentials: "include" })
      .then(res => res.json())
      .then(setFournisseurs)
      .catch(err => console.error("Erreur fournisseurs", err));

    fetch("http://localhost:5000/api/produits-fournisseurs", { credentials: "include" })
      .then(res => res.json())
      .then(setAssociations)
      .catch(err => console.error("Erreur associations", err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      id_produit: parseInt(form.id_produit),
      id_fournisseur: parseInt(form.id_fournisseur),
      prix: parseFloat(form.prix),
      reference_fournisseur: form.reference_fournisseur
    };

    try {
      const res = await fetch("http://localhost:5000/api/produits-fournisseurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage("✅ Fournisseur associé au produit.");
        setForm({ id_produit: "", id_fournisseur: "", prix: "", reference_fournisseur: "" });

        const updated = await fetch("http://localhost:5000/api/produits-fournisseurs", {
          credentials: "include"
        });
        setAssociations(await updated.json());
      }
      else {
        const err = await res.json();
        setMessage("❌ Erreur : " + (err.message || err));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur réseau.");
    }
  };

  return (
    <div className="product-form-container">
      {!showForm && (
        <button className="create-button" onClick={handleToggleForm}>
          Associer un fournisseur à un produit
        </button>
      )}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", marginTop: "1rem" }}>
          <div className="form-proFornisseur">
            <label>Produit</label>
            <select name="id_produit" value={form.id_produit} onChange={handleChange} required>
              <option value="">-- Sélectionner un produit --</option>
              {produits.map(p => (
                <option key={p.id_produit} value={p.id_produit}>
                  {p.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="form-proFornisseur">
            <label>Fournisseur</label>
            <select name="id_fournisseur" value={form.id_fournisseur} onChange={handleChange} required>
              <option value="">-- Sélectionner un fournisseur --</option>
              {fournisseurs.map(f => (
                <option key={f.id_fournisseur} value={f.id_fournisseur}>
                  {f.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="form-proFornisseur">
            <label>Prix </label>
            <input type="number" name="prix" value={form.prix} onChange={handleChange} required />
          </div>

          <div className="form-proFornisseur">
            <label>Référence Fournisseur</label>
            <input type="text" name="reference_fournisseur" value={form.reference_fournisseur} onChange={handleChange} />
          </div>

          {/* <button type="submit">Associer</button>
          <button type="button" onClick={handleToggleForm} style={{ marginLeft: "10px" }}>
            Fermer
          </button> */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                <button type="submit" style={{ width: "80%" }} >Associer</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                <button type="button" onClick={handleToggleForm} style={{ width: "50%" }}>
                    Fermer
                </button>
            </div>
        </form>
      )}

      {message && <p>{message}</p>}

      {/* <h3 style={{ marginTop: "2rem" }}>Associations Actuelles</h3>
      {associations.length > 0 ? (
        <ul className="associations-list">
          {associations.map(a => (
            <li key={`${a.id_produit}-${a.id_fournisseur}`}>
              🧾 <strong>{a.produit_nom}</strong> — Fournisseur : {a.fournisseur_nom}, Prix : {a.prix}€, Réf : {a.reference_fournisseur}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune association enregistrée.</p>
      )} */}
    </div>
  );
};

export default AssocierFournisseurPage;
