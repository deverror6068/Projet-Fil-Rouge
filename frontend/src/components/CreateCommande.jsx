import React, { useState, useEffect } from "react";

const Created = () => {
  const [showForm, setShowForm] = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [produitsDispo, setProduitsDispo] = useState([]);
  const [idFournisseur, setIdFournisseur] = useState("");
  const [produits, setProduits] = useState([
    { id_produit: "", quantite: "", prix_unitaire: "" }
  ]);
  const [commande, setCommande] = useState({ id_fournisseur: "", status: "en cours" });
  const [lignes, setLignes] = useState([{ id_produit: "", quantite: 1, prix_unitaire: 0 }]);
  const [message, setMessage] = useState("");
  const [nouvelleLigne, setNouvelleLigne] = useState({
      id_produit: "",
      quantite: 1,
      prix_unitaire: ""
  });

  const toggleForm = () => {
    setShowForm(!showForm);
  };
  // Charger les fournisseurs
  useEffect(() => {
    fetch("/api/fournisseurs")
      .then(res => res.json())
      .then(data => {
        // console.log("📦 Fournisseurs :", data);
        Array.isArray(data) ? setFournisseurs(data) : setFournisseurs([]);
      })
      .catch(err => {
        console.error("❌ Erreur fournisseurs :", err);
        setFournisseurs([]);
      });
  }, []);

  // Charger les produits
  useEffect(() => {
    fetch("/api/produits")
      .then(res => res.json())
      .then(data => {
        // console.log("📦 Produits :", data);
        Array.isArray(data) ? setProduitsDispo(data) : setProduitsDispo([]);
      })
      .catch(err => {
        console.error("❌ Erreur produits :", err);
        setProduitsDispo([]);
      });
  }, []);

  const handleProduitChange = (index, field, value) => {
    const updated = [...produits];
    updated[index][field] = value;

    if (field === "id_produit") {
      const produit = produitsDispo.find(p => p.id_produit === parseInt(value));
      updated[index].prix_unitaire = produit ? produit.prix : "";
    }

    setProduits(updated);
  };

  const ajouterProduit = () => {
    // setProduits([...produits, { id_produit: "", quantite: "", prix_unitaire: "" }]);
    setLignes([...lignes, { id_produit: "", quantite: 1, prix_unitaire: 0 }]);

  };

  const supprimerProduit = (index) => {
    const updated = produits.filter((_, i) => i !== index);
    setProduits(updated);
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // if (!idFournisseur || produits.some(p => !p.id_produit || !p.quantite)) {
    //   alert("Veuillez remplir tous les champs");
    //   return;
    // }
  
    // const commande = {
    //   id_fournisseur: parseInt(idFournisseur),
    //   // produits: produits.map(p => ({
    //   //   id_produit: parseInt(p.id_produit),
    //   //   quantite: parseInt(p.quantite),
    //   //   prix_unitaire: parseFloat(p.prix_unitaire),
    //   // })),
    // };
  
    console.log("👉 Données envoyées à l’API :", commande);
  
    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({commande, lignes}),
      });
    
      const resText = await res.text(); // ✅ lire le message même en cas d’erreur
    
      if (!res.ok) {
        console.error("❌ Erreur HTTP :", res.status, resText); // 👈 Garde ça
        throw new Error(resText); // 👈 C’est cette erreur qui est capturée plus bas
      }
    
      alert("Commande créée avec succès");
      
    } catch (err) {
      console.error("❌ Erreur détaillée :", err); // 👈 Donne-nous ce message exact
      alert("Échec de l'enregistrement");
    }
    
  };
  

  return (
    <div className="product-form-container">
      {!showForm && (
        <button className="create-button" onClick={() => setShowForm(true)}>
          Créer une commande
        </button>
      )}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <div>
            <label>Fournisseur</label>
            <select
              value={idFournisseur}
              onChange={e => setIdFournisseur(e.target.value)}
            >
              <option value="">Choisissez un fournisseur</option>
              {fournisseurs.map(f => (
                <option key={f.id_fournisseur} value={f.id_fournisseur}>
                  {f.nom}
                </option>
              ))}
            </select>
            {fournisseurs.length === 0 && (
              <p style={{ color: "red" }}>⚠️ Aucun fournisseur disponible</p>
            )}
          </div>

          {produits.map((p, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <label>Produit {index + 1}</label>
              <select
                value={p.id_produit || ""}
                onChange={e => handleProduitChange(index, "id_produit", e.target.value)}
              >
                <option value="">-- Choisissez un produit --</option>
                {produitsDispo.map(prod => (
                  <option key={prod.id_produit} value={prod.id_produit}>
                    {prod.nom}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantité"
                value={p.quantite}
                onChange={e => handleProduitChange(index, "quantite", e.target.value)}
              />

              <input
                type="text"
                placeholder="Prix unitaire"
                value={p.prix_unitaire}
                readOnly
              />

              {produits.length > 1 && (
                <button type="button" onClick={() => supprimerProduit(index)}>❌</button>
              )}
            </div>
          ))}

          {/* <button type="button" onClick={ajouterProduit}>+ Ajouter un produit</button> */}
          <button type="submit">Valider la commande</button>
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

export default Created;
