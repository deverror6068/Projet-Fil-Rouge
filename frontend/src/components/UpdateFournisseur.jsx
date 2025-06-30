// import React, { useState, useEffect } from "react";

// const UpdateFournisseur = ({ fournisseur, onUpdate, onClose }) => {
//   const [nom, setNom] = useState("");
//   const [email, setEmail] = useState("");
//   const [telephone, setTelephone] = useState("");
//   const [adresse, setAdresse] = useState("");

//   useEffect(() => {
//     if (fournisseur) {
//       setNom(fournisseur.nom || "");
//       setEmail(fournisseur.email || "");
//       setTelephone(fournisseur.telephone || "");
//       setAdresse(fournisseur.adresse || "");
//     }
//   }, [fournisseur]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const updatedFournisseur = {
//       nom,
//       email,
//       telephone,
//       adresse,
//     };

//     try {
//       const res = await fetch(`/api/fournisseurs/${fournisseur.id_fournisseur}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedFournisseur),
//       });

//       if (!res.ok) throw new Error("Erreur lors de la mise à jour");

//       alert("Fournisseur mis à jour avec succès");
//       onUpdate && onUpdate();
//       onClose && onClose();
//     } catch (err) {
//       console.error("Erreur:", err);
//       alert("Échec de la mise à jour");
//     }
//   };

//   return (
//     <div className="product-form-container">
//       <h3>Modifier le fournisseur</h3>
//       <form className="product-form" onSubmit={handleSubmit}>
//         <div>
//           <label>Nom</label>
//           <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
//         </div>

//         <div>
//           <label>Email</label>
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//         </div>

//         <div>
//           <label>Téléphone</label>
//           <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
//         </div>

//         <div>
//           <label>Adresse</label>
//           <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
//         </div>

//         <button type="submit">Enregistrer</button>
//         <button type="button" onClick={onClose} style={{ marginLeft: "10px" }}>
//           Annuler
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateFournisseur;



import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const FournisseurProduits = () => {
    const { id } = useParams();
    const [fournisseur, setFournisseur] = useState(null);
    const [produits, setProduits] = useState([]);
    const [modifProduits, setModifProduits] = useState([]);
    const [id_produit, setIdProduit] = useState([]);
    const [tousProduits, setTousProduits] = useState([]);


    useEffect(() => {
      console.log("🔍 ID reçu via useParams :", id);

        fetch(`http://localhost:5000/api/fournisseurs/${id}`, { credentials: "include" })
            .then(res => 
              console.log("🔍 Réponse reçue pour le fournisseur :", res) ||
              res.json())
            
            .then(data => {
              console.log("📦 Données JSON reçues :", data);

              if (Array.isArray(data) && data.length > 0) {
                setFournisseur(data[0]);
                console.log("Fournisseur trouvé :", data[0]);
              } else {
                console.warn("Aucun fournisseur trouvé");
                setFournisseur(null); // ou set une structure vide si tu préfères
              }
            })
            
            


            .catch(err => console.error("Erreur chargement données fournisseur", err));

        fetch(`http://localhost:5000/api/produits-fournisseurs/fournisseur/${id}`, {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => {
                // Si data n'est pas un tableau, on le transforme en tableau vide
                const produitsArray = Array.isArray(data) ? data : [];
                setProduits(produitsArray);
                setModifProduits(produitsArray.map(p => ({ ...p })));
                setIdProduit(produitsArray.map(p => ({ ...p })));
            })

            .catch(err => console.error("Erreur chargement produits", err));


        fetch(`http://localhost:5000/api/produits`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => setTousProduits(data))
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

        if (!res.ok) alert("Erreur mise à jour fournisseur");
        else alert("Fournisseur mis à jour ✅");
    };

    const enregistrerProduit = async (produit) => {
        const body = {
            reference_fournisseur: produit.reference_fournisseur,
            id_produit:produit.id_produit,
            prix :produit.prix,
            id_fournisseur:produit.id_fournisseur
        };
        console.log(body)

        const res = await fetch(`http://localhost:5000/api/produits-fournisseurs/${produit.id_pf}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        console.log(res)

        if (!res.ok) alert(`Erreur mise à jour produit: ${produit.nom_produit}`);
        else alert("Produit mis à jour ✅");
    };

    const supprimerProduit = async (idRelation) => {
        const confirmer = window.confirm("Supprimer ce produit du fournisseur ?");
        if (!confirmer) return;

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

    if (!fournisseur) return <div>Chargement...</div>;
    const produitsDejaAssocies = produits.map(p => p.id_produit);
    const produitsDispo = tousProduits.filter(p => !produitsDejaAssocies.includes(p.id_produit));

    return (
        <div style={{ maxWidth: 900, margin: "auto" }}>
            <h2>🏢 Modifier le fournisseur</h2>

            <div style={{ marginBottom: 20 }}>
                <input
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    value={fournisseur.nom}
                    onChange={handleFournisseurChange}
                    style={{ marginRight: 10 }}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={fournisseur.email}
                    onChange={handleFournisseurChange}
                    style={{ marginRight: 10 }}
                />
                <input
                    type="text"
                    name="telephone"
                    placeholder="Téléphone"
                    value={fournisseur.telephone}
                    onChange={handleFournisseurChange}
                    style={{ marginRight: 10 }}
                />

                <input
                    type="text"
                    name="adresse"
                    placeholder="Adresse"
                    value={fournisseur.adresse}
                    onChange={handleFournisseurChange}
                    style={{ marginRight: 10 }}
                />
                <button onClick={enregistrerFournisseur} style={{ marginTop: "20px" , marginBottom: "20px" }}>💾 Enregistrer fournisseur</button>
            </div>

            <hr />
            <h3 style={{ marginTop: "30px" }}>📦 Produits proposés par le fournisseur</h3>
            <table border="1" cellPadding="10" style={{ width: "100%" }}>
                <thead>
                <tr>
                    <th style={{ paddingLeft: "10px" }}>Id Produit</th>
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
                            <td style={{ paddingLeft: "10px" }}>{p.id_produit}</td>
                            <td>{p.nom_produit}</td>
                            <td>
                                <input
                                    type="number"
                                    step="0.01"
                                    min={0.01}
                                    value={p.prix}
                                    onChange={(e) => handleProduitChange(index, "prix", e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={p.reference_fournisseur || ""}
                                    onChange={(e) => handleProduitChange(index, "reference_fournisseur", e.target.value)}
                                />
                            </td>
                            <td>
                                <button onClick={() => enregistrerProduit(p)}>💾</button>{" "}
                                <button onClick={() => supprimerProduit(p.id_pf)}>🗑</button>
                            </td>
                        </tr>


                    ))
                ) : (
                    <tr>
                        <td colSpan="4">Aucun produit trouvé</td>
                    </tr>
                )}


                </tbody>
            </table>
            <h3>➕ Ajouter un produit à ce fournisseur</h3>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <select onChange={(e) => setIdProduit(e.target.value)}>
                    <option value="">-- Sélectionner un produit --</option>
                    {produitsDispo.map(prod => (
                        <option key={prod.id_produit} value={prod.id_produit}>
                            {prod.nom}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    step="0.01"
                    min={0.01}
                    placeholder="Prix"
                    id="prix-produit-ajout"
                />
                <input
                    type="text"
                    placeholder="Référence fournisseur"
                    id="ref-produit-ajout"
                />
                <button onClick={async () => {
                    const prix = document.getElementById("prix-produit-ajout").value;
                    const reference_fournisseur = document.getElementById("ref-produit-ajout").value;

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

                    const res = await fetch(`http://localhost:5000/api/produits-fournisseurs`, {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body)
                    });

                    if (res.ok) {
                        alert("Produit ajouté au fournisseur ✅");
                        window.location.reload(); // Recharge pour afficher le nouveau
                    } else {
                        alert("Erreur ajout produit");
                    }
                }}>
                    ➕ Ajouter
                </button>
            </div>

        </div>
    );
};

export default FournisseurProduits;
