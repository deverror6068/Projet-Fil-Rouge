import React, { useState, useEffect } from "react";

const CreateCommande = ({ onAdd }) => {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [produits, setProduits] = useState([]);
    const [commande, setCommande] = useState({ id_fournisseur: "", status: "en cours" });
    const [lignes, setLignes] = useState([{ id_produit: "", quantite: 1, prix_unitaire: 0 }]);
    const [selectedFournisseurId, setSelectedFournisseurId] = useState("");
    const [message, setMessage] = useState("");

    const fournisseurSelectionne = fournisseurs.find(f => f.id_fournisseur === parseInt(selectedFournisseurId));
    const produitsFournisseur = produits.filter(p => p.id_fournisseur === parseInt(selectedFournisseurId));

    useEffect(() => {
        fetch("/api/fournisseurs")
            .then(res => res.json())
            .then(data => setFournisseurs(data))
            .catch(err => console.error("Erreur fournisseurs :", err));

        fetch("/api/produits")
            .then(res => res.json())
            .then(data => setProduits(data))
            .catch(err => console.error("Erreur produits :", err));
    }, []);

    const ajouterLigne = () => {
        setLignes([...lignes, { id_produit: "", quantite: 1, prix_unitaire: 0 }]);
    };

    const supprimerLigne = (index) => {
        setLignes(lignes.filter((_, i) => i !== index));
    };

    const handleLigneChange = (index, field, value) => {
        const newLignes = [...lignes];
        if (field === "quantite") {
            newLignes[index][field] = parseInt(value) || 1;
        } else if (field === "id_produit") {
            const selectedId = parseInt(value);
            newLignes[index].id_produit = selectedId;
            const produit = produits.find(p => p.id_produit === selectedId);
            newLignes[index].prix_unitaire = produit ? produit.prix : 0;
        }
        setLignes(newLignes);
    };

    const fecth2d = (commandes)=>{

        fetch("http://localhost:5000/api/commandes", {
            credentials: "include", // 👈 Essentiel pour la session
        })
            .then((res) => res.json())
            .then((data) => {

                if (Array.isArray(data)) {


                    console.log("YGVFsdft Dosqdnut ds 2",data)
                    onAdd(data);
                } else {
                    console.warn("❌ Données reçues non valides :", data);

                }
            })
            .catch((err) => {
                console.error("Erreur chargement commandes", err);

            });
        console.log("chargement er données e commande 2 e")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const lignesValides = lignes.filter(l =>
            l.id_produit &&
            !isNaN(l.quantite) && l.quantite > 0 &&
            !isNaN(l.prix_unitaire) && l.prix_unitaire > 0
        );

        if (lignesValides.length === 0) {
            setMessage("❌ Veuillez ajouter au moins un produit valide.");
            return;
        }

        try {

          const  commandeData =  JSON.stringify({
                commande: {
                    id_fournisseur: parseInt(selectedFournisseurId),
                    status: "en cours"
                },
                lignes: lignesValides,
            })



                // Appeler la fonction onAdd pour rafraîchir la liste dans le parent
                if (onAdd) {
                    onAdd(commandeData);
                    console.log(onAdd,"sdffzeesdr")
                }

                // Réinitialiser le formulaire
                setSelectedFournisseurId("");
                setLignes([{ id_produit: "", quantite: 1, prix_unitaire: 0 }]);
           /* } else {
                setMessage("❌ Erreur : " + data.message);
            }*/
        } catch (err) {
            console.error(err);
            setMessage("❌ Erreur serveur lors de la création.");
        }
    };

    const isAjouterDisabled = () => {
        const produitsAjoutes = lignes.map(l => l.id_produit);
        const produitsRestants = produitsFournisseur.filter(p => !produitsAjoutes.includes(p.id_produit));
        return produitsRestants.length === 0;
    };

    return (
        <div style={{
          maxWidth: 800,
          margin: "40px auto",
          backgroundColor: "#fff",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial, sans-serif",
          height: "90vh", // Limite la hauteur visible
          overflow: "hidden", // Cache le débordement
          display: "flex",
          flexDirection: "column"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px", color: "#333" }}>
            📝 Créer une commande
          </h2>
      
          {message && (
            <p style={{ color: message.startsWith("✅") ? "green" : "red", marginBottom: "16px" }}>
              {message}
            </p>
          )}
      
          <div style={{ overflowY: "auto", flex: 1, paddingRight: "8px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontWeight: 500 }}>Fournisseur :</label><br />
                <select
                  value={selectedFournisseurId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedFournisseurId(id);
                    setCommande({ ...commande, id_fournisseur: id });
                    setLignes([{ id_produit: "", quantite: 1, prix_unitaire: 0 }]);
                  }}
                  style={{
                    marginTop: "4px",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    width: "100%"
                  }}
                >
                  <option value="">-- Choisir un fournisseur --</option>
                  {fournisseurs.map(f => (
                    <option key={f.id_fournisseur} value={f.id_fournisseur}>
                      {f.nom}
                    </option>
                  ))}
                </select>
              </div>
      
              {selectedFournisseurId && produitsFournisseur.length === 0 && (
                <p style={{ color: "#b00020", fontStyle: "italic" }}>
                  Ce fournisseur n’a aucun produit disponible.
                </p>
              )}
      
              <h4 style={{ fontSize: "18px", fontWeight: 600, marginTop: "16px" }}>Lignes de commande :</h4>
      
              {lignes.map((ligne, index) => (
                <div key={index} style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  flexWrap: "wrap",
                  background: "#f9f9f9",
                  padding: "12px",
                  borderRadius: "8px"
                }}>
                  <select
                    value={ligne.id_produit}
                    onChange={(e) => handleLigneChange(index, "id_produit", e.target.value)}
                    style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc", flex: 2 }}
                  >
                    <option value="">-- Produit --</option>
                    {produitsFournisseur
                      .filter(p => !lignes.some((l, i) => i !== index && l.id_produit === p.id_produit))
                      .map(p => (
                        <option key={p.id_produit} value={p.id_produit}>
                          {p.nom}
                        </option>
                      ))}
                  </select>
      
                  <input
                    type="number"
                    min="1"
                    value={ligne.quantite}
                    onChange={(e) => handleLigneChange(index, "quantite", e.target.value)}
                    style={{ width: "80px", padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
      
                  <input
                    type="number"
                    readOnly
                    value={ligne.prix_unitaire}
                    style={{ width: "100px", padding: "6px", backgroundColor: "#eee", border: "none", borderRadius: "6px" }}
                  />
      
                  <span style={{ minWidth: 100, fontWeight: 500 }}>
                    Total : {(ligne.quantite * ligne.prix_unitaire).toFixed(2)} €
                  </span>
      
                  <button
                    type="button"
                    onClick={() => supprimerLigne(index)}
                    disabled={lignes.length === 1}
                    style={{
                      padding: "4px 10px",
                      background: "#eee",
                      border: "none",
                      borderRadius: "6px",
                      cursor: lignes.length === 1 ? "not-allowed" : "pointer"
                    }}
                  >
                    🗑
                  </button>
                </div>
              ))}
      
              <button
                type="button"
                onClick={ajouterLigne}
                disabled={isAjouterDisabled()}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isAjouterDisabled() ? "not-allowed" : "pointer"
                }}
              >
                ➕ Ajouter un produit
              </button>
      
              <hr />
      
              <div style={{ fontSize: "16px" }}>
                <p><strong>Nombre d’articles :</strong> {lignes.reduce((acc, l) => acc + Number(l.quantite), 0)}</p>
                <p><strong>Montant total :</strong> {lignes.reduce((acc, l) => acc + (l.quantite * l.prix_unitaire), 0).toFixed(2)} €</p>
                {fournisseurSelectionne && <p><strong>Fournisseur :</strong> {fournisseurSelectionne.nom}</p>}
              </div>
      
              <button
                type="submit"
                disabled={lignes.length === 0 || lignes.some(l => !l.id_produit)}
                style={{
                  backgroundColor: "#388e3c",
                  color: "white",
                  padding: "12px",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginTop: "16px"
                }}
              >
                ✅ Créer la commande
              </button>
            </form>
          </div>
        </div>
    );
      
      
};

export default CreateCommande;
