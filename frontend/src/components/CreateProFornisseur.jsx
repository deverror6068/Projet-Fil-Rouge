import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AjouterProduitFournisseur = ({onAdd}) => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produits, setProduits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const { utilisateur } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    description: "",
    prix: "",
    quantite: "",
    id_vendeur: "",
    id_fournisseur: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/fournisseurs", { credentials: "include" })
      .then(res => res.json())
      .then(data => setFournisseurs(data))
      .catch(err => console.error("Erreur chargement fournisseurs", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/list", { credentials: "include" })
      .then(res => res.json())
      .then(data => 
        console.log("Produits chargés  4G :", data) ||  // Log pour vérifier les données
        setProduits(data));
  }, []);

  const handleToggleForm = () => setShowForm(!showForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5000/api/produits/${editingId}`
      : "http://localhost:5000/api/produits";

    const payload = {
      nom: form.nom,
      description: form.description,
      prix: parseFloat(form.prix),
      quantite: parseInt(form.quantite),
      id_vendeur: utilisateur?.role === "admin"
        ? parseInt(form.id_vendeur)
        : utilisateur.id_utilisateur,
      id_fournisseur: parseInt(form.id_fournisseur)
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updated = await res.json();
        setMessage(editingId ? "✅ Produit modifié." : "✅ Produit ajouté.");
        setTimeout(() => setMessage(""), 5000);
        setProduits((prev) => {
          const exists = prev.some(p => p.id_produit === updated.id_produit);
          if (exists) {
            return prev.map(p => (p.id_produit === updated.id_produit ? updated : p));
          } else {
            return [...prev, updated].sort((a, b) => a.id_produit - b.id_produit);
          }
        });

        setForm({
          nom: "",
          description: "",
          prix: "",
          quantite: "",
          id_vendeur: "",
          id_fournisseur: ""
        });
        setEditingId(null);
        if (onAdd) onAdd(updated); // si tu veux rafraîchir la liste des produits
      } else {
        if (res.status === 401) {
          navigate("/login");
        }
        const err = await res.json();
        setMessage("❌ Erreur : " + err.message);
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
          Créer un produit vendu par un fournisseur
        </button>
      )}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", marginTop: "1rem" }}>
            
            <div className="form-proFornisseur">
                <label>Nom de l'article</label>
                <input type="text" name="nom" value={form.nom} onChange={handleChange} required />
            </div>

            <div className="form-proFornisseur">
                <label>Quantité du produit</label>
                <input type="number" name="quantite" value={form.quantite} onChange={handleChange} required />
            </div>

            <div className="form-proFornisseur">
                <label>Prix unitaire</label>
                <input type="number" name="prix" value={form.prix} onChange={handleChange} required />
            </div>

            <div className="form-proFornisseur">
                <label>Description</label>
                <input type="text" name="description" value={form.description} onChange={handleChange} required />
            </div>

            <div>
                <label>
                Fournisseur :
                <select name="id_fournisseur" value={form.id_fournisseur} onChange={handleChange} required>
                    <option value="">-- Choisir un fournisseur --</option>
                    {fournisseurs.map(f => (
                    <option key={f.id_fournisseur} value={f.id_fournisseur}>
                        {f.nom}
                    </option>
                    ))}
                </select>
                </label>
            </div>

            {/* <button type="submit">{editingId ? "Modifier" : "Ajouter"}</button>
            <button type="button" onClick={handleToggleForm} style={{ marginLeft: "10px" }}>
                Fermer
            </button> */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                <button type="submit" style={{ width: "80%" }} >{editingId ? "Modifier" : "Ajouter"}</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                <button type="button" onClick={handleToggleForm} style={{ width: "50%" }}>
                    Fermer
                </button>
            </div>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default AjouterProduitFournisseur;
