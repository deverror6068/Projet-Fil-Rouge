import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";



const CreerCommandePage = () => {
    const { utilisateur } = useAuth();
    const navigate = useNavigate();
    const [fournisseurs, setFournisseurs] = useState([]);
    const [produits, setProduits] = useState([]);
    const [commande, setCommande] = useState({ id_fournisseur: "", status: "en cours" });
    const [lignes, setLignes] = useState([{ id_produit: "", quantite: 1, prix_unitaire: 0 }]);
    const [message, setMessage] = useState("");
    const [nouvelleLigne, setNouvelleLigne] = useState({
        id_produit: "",
        quantite: 1,
        prix_unitaire: ""
    });


    useEffect(() => {
        if (!utilisateur) {
            navigate("/login");
        } else {
            fetch("http://localhost:5000/api/fournisseurs", { credentials: "include" })
                .then(res => res.json())
                .then(data => setFournisseurs(data));

            fetch("http://localhost:5000/api/produits", { credentials: "include" })
                .then(res => res.json())
                .then(data => setProduits(data));
        }
    }, [utilisateur, navigate]);

    const ajouterLigne = () => {
        setLignes([...lignes, { id_produit: "", quantite: 1, prix_unitaire: 0 }]);
    };

    const handleLigneChange = (index, field, value) => {
        const newLignes = [...lignes];
        newLignes[index][field] = field === "quantite" || field === "prix_unitaire" ? Number(value) : value;
        setLignes(newLignes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/commandes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ commande, lignes }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("✅ Commande créée avec succès !");
                navigate("/dashboard");
            } else {
                setMessage("❌ Erreur : " + data.message);
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Erreur serveur lors de la création.");
        }
    };
    const [selectedFournisseurId, setSelectedFournisseurId] = useState(null);
    const produitsPourFournisseur = produits.filter(
        (p) => p.id_vendeur === selectedFournisseurId
    );


    return (
        <div style={{ maxWidth: 800, margin: "auto" }}>
            <h2>Créer une commande</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>Fournisseur :</label>
                <select
                    value={selectedFournisseurId || ""}
                    onChange={(e) => setSelectedFournisseurId(Number(e.target.value))}
                    required
                >
                    <option value="">-- Sélectionner un fournisseur --</option>
                    {fournisseurs.map(f => (
                        <option key={f.id_fournisseur} value={f.id_fournisseur}>
                            {f.nom}
                        </option>
                    ))}
                </select>


                <h4>Lignes de commande :</h4>
                {lignes.map((ligne, index) => (
                    <div key={index} style={{ marginBottom: 10 }}>
                        <select
                            value={nouvelleLigne.id_produit || ""}
                            onChange={(e) =>
                                setNouvelleLigne({ ...nouvelleLigne, id_produit: Number(e.target.value) })
                            }
                            required
                            disabled={!selectedFournisseurId} // empêche la sélection avant le choix d’un fournisseur
                        >
                            <option value="">-- Choisir un produit --</option>
                            {produitsPourFournisseur.map((p) => (
                                <option key={p.id_produit} value={p.id_produit}>
                                    {p.nom}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Quantité"
                            min="1"
                            value={ligne.quantite}
                            onChange={(e) => handleLigneChange(index, "quantite", e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Prix unitaire (€)"
                            step="0.01"
                            value={ligne.prix_unitaire}
                            onChange={(e) => handleLigneChange(index, "prix_unitaire", e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={ajouterLigne}>➕ Ajouter un produit</button><br /><br />
                <button type="submit">Créer la commande</button>
            </form>
        </div>
    );
};

export default CreerCommandePage;
