import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const FournisseurProduits = () => {
  const { id } = useParams();
  const [fournisseur, setFournisseur] = useState(null);
  const [produits, setProduits] = useState([]);
  const [modifProduits, setModifProduits] = useState([]);
  const [formAjout, setFormAjout] = useState({ id_produit: "", prix: "", reference_fournisseur: "" });
  const [tousProduits, setTousProduits] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/fournisseurs/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setFournisseur(data[0]))
      .catch(err => console.error("Erreur chargement fournisseur", err));

    fetch(`http://localhost:5000/api/produits-fournisseurs/fournisseur/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const produitsArray = Array.isArray(data) ? data : [];
        setProduits(produitsArray);
        setModifProduits(produitsArray.map(p => ({ ...p })));
      })
      .catch(err => console.error("Erreur chargement produits", err));

    fetch("http://localhost:5000/api/produits", { credentials: "include" })
      .then(res => res.json())
      .then(setTousProduits)
      .catch(err => console.error("Erreur chargement tous les produits", err));
  }, [id]);

  const handleFournisseurChange = (e) => {
    const { name, value } = e.target;
    setFournisseur(prev => ({ ...prev, [name]: value }));
  };

  const handleProduitChange = (index, field, value) => {
    const updated = [...modifProduits];
    updated[index][field] = value;
    setModifProduits(updated);
  };

  const enregistrerFournisseur = async () => {
    const res = await fetch(`http://localhost:5000/api/fournisseurs/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fournisseur)
    });

    alert(res.ok ? "Fournisseur mis à jour ✅" : "Erreur mise à jour fournisseur");
  };

  const enregistrerProduit = async (produit) => {
    const body = {
      reference_fournisseur: produit.reference_fournisseur,
      id_produit: produit.id_produit,
      prix: produit.prix,
      id_fournisseur: produit.id_fournisseur
    };

    const res = await fetch(`http://localhost:5000/api/produits-fournisseurs/${produit.id_pf}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    alert(res.ok ? "Produit mis à jour ✅" : `Erreur mise à jour produit: ${produit.nom_produit}`);
  };

  const supprimerProduit = async (idRelation) => {
    if (!window.confirm("Supprimer ce produit du fournisseur ?")) return;

    const res = await fetch(`http://localhost:5000/api/produits-fournisseurs/${idRelation}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (res.ok) {
      setProduits(produits.filter(p => p.id_relation !== idRelation));
      setModifProduits(modifProduits.filter(p => p.id_relation !== idRelation));
    } else {
      alert("Erreur suppression produit");
    }
  };

  const handleFormAjoutChange = (e) => {
    const { name, value } = e.target;
    setFormAjout(prev => ({ ...prev, [name]: value }));
  };

  const ajouterProduit = async () => {
    const { id_produit, prix, reference_fournisseur } = formAjout;

    if (!id_produit || !prix || !reference_fournisseur) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const body = {
      id_produit,
      id_fournisseur: id,
      prix,
      reference_fournisseur
    };

    const res = await fetch("http://localhost:5000/api/produits-fournisseurs", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      alert("Produit ajouté au fournisseur ✅");
      window.location.reload();
    } else {
      alert("Erreur ajout produit");
    }
  };

  if (!fournisseur) return <div>Chargement...</div>;

  const produitsDejaAssocies = produits.map(p => p.id_produit);
  const produitsDispo = tousProduits.filter(p => !produitsDejaAssocies.includes(p.id_produit));

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h2>🏢 Modifier le fournisseur</h2>
      <div style={{ marginBottom: 20 }}>
        <input type="text" name="nom" placeholder="Nom" value={fournisseur.nom} onChange={handleFournisseurChange} style={{ marginRight: 10 }} />
        <input type="email" name="email" placeholder="Email" value={fournisseur.email} onChange={handleFournisseurChange} style={{ marginRight: 10 }} />
        <input type="text" name="telephone" placeholder="Téléphone" value={fournisseur.telephone} onChange={handleFournisseurChange} style={{ marginRight: 10 }} />
        <input type="text" name="adresse" placeholder="Adresse" value={fournisseur.adresse} onChange={handleFournisseurChange} style={{ marginRight: 10 }} />
        <button onClick={enregistrerFournisseur}>💾 Enregistrer fournisseur</button>
      </div>

      <hr />

      <h3>📦 Produits proposés par le fournisseur</h3>
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Id Produit</th>
            <th>Nom</th>
            <th>Prix (€)</th>
            <th>Référence Fournisseur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {modifProduits.length > 0 ? (
            modifProduits.map((p, index) => (
              <tr key={p.id_relation}>
                <td>{p.id_produit}</td>
                <td>{p.nom_produit}</td>
                <td><input type="number" step="0.01" min={0.01} value={p.prix} onChange={(e) => handleProduitChange(index, "prix", e.target.value)} /></td>
                <td><input type="text" value={p.reference_fournisseur || ""} onChange={(e) => handleProduitChange(index, "reference_fournisseur", e.target.value)} /></td>
                <td>
                  <button onClick={() => enregistrerProduit(p)}>💾</button>{" "}
                  <button onClick={() => supprimerProduit(p.id_relation)}>🗑</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Aucun produit trouvé</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>➕ Ajouter un produit à ce fournisseur</h3>
      <div style={{ display: "grid", gap: 10, maxWidth: 600 }}>
        <select name="id_produit" value={formAjout.id_produit} onChange={handleFormAjoutChange}>
          <option value="">-- Sélectionner un produit --</option>
          {produitsDispo.map(prod => (
            <option key={prod.id_produit} value={prod.id_produit}>{prod.nom}</option>
          ))}
        </select>
        <input type="number" step="0.01" min={0.01} name="prix" placeholder="Prix" value={formAjout.prix} onChange={handleFormAjoutChange} />
        <input type="text" name="reference_fournisseur" placeholder="Référence fournisseur" value={formAjout.reference_fournisseur} onChange={handleFormAjoutChange} />
        <button onClick={ajouterProduit}>➕ Ajouter</button>
      </div>
    </div>
  );
};

export default FournisseurProduits;
