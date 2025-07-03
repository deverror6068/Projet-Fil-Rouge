import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {toast} from "react-toastify";

const Comdetails = (refresh ) => {
  const [commandes, setCommandes] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const { utilisateur } = useAuth();
  const [selectedCommandeId, setSelectedCommandeId] = useState(null);
  const [contenus, setContenus] = useState([]);
  const [nombreProduitsParCommande, setNombreProduitsParCommande] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [ruptures, setRuptures] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/commandes", {
      credentials: "include",
    })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            // Tri décroissant par id_commande
            const sortedData = data.sort((a, b) => b.id_commande - a.id_commande);
            setCommandes(sortedData);
            sortedData.forEach((c) => fetchNombreProduits(c.id_commande));
          } else {
            setCommandes([]);
          }
        })
        .catch(() => setCommandes([]));
  }, [refresh]);
  if ("Notification" in window) {
    Notification.requestPermission();
  }

  const cooldownMinutes = 10;
  const cooldownKey = "lastShortageNotification";
  const now = Date.now();

  const lastNotif = localStorage.getItem(cooldownKey);
  const lastNotifTime = lastNotif ? parseInt(lastNotif) : 0;
  const elapsedMinutes = (now - lastNotifTime) / 60000;

  fetch("http://localhost:5000/api/alert/shortage", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setRuptures(data);
        console.log(data);

        if (
            data.length > 0 &&
            Notification.permission === "granted" &&
            elapsedMinutes > cooldownMinutes
        ) {
          new Notification("⚠️ Rupture de stock", {
            body: `Il y a ${data.length} produit(s) en rupture.`,
            icon: "/provider.jpeg",
          });
          // Enregistrer l'heure de la dernière notification
          localStorage.setItem(cooldownKey, now.toString());
        }
      })
      .catch(err => console.error("Erreur fetch ruptures", err));



  const fetchNombreProduits = async (id_commande) => {
    try {
      const res = await fetch(`http://localhost:5000/api/commandes/count/${id_commande}`, {
        credentials: "include",
      });
      const data = await res.json();
      setNombreProduitsParCommande((prev) => ({
        ...prev,
        [id_commande]: data.nombre_produits,
      }));
    } catch (err) {
      console.error(`Erreur chargement nombre produits pour commande ${id_commande} :`, err);
    }
  };

  const updateStatut = async (commande, nouveauStatut) => {
    const ancienStatut = commande.status;

    const transitionsValides = {
      enregistrée: ["en cours"],
      "en cours": ["livrée"],
      livrée: [],
    };

    if (!transitionsValides[ancienStatut]?.includes(nouveauStatut)) {
      alert("Transition non autorisée.");
      return;
    }

    const confirm = window.confirm(`Changer le statut de "${ancienStatut}" à "${nouveauStatut}" ?`);
    if (!confirm) return;

    const res = await fetch(`http://localhost:5000/api/commandes/statut/${commande.id_commande}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nouveauStatut }),
    });

    if (res.ok) {
      setCommandes((prev) =>
          prev.map((cmd) =>
              cmd.id_commande === commande.id_commande ? { ...cmd, status: nouveauStatut } : cmd
          )
      );
      const message =(
          <strong> Commande modifiée !</strong>
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
    }else {

      toast.error(
          <strong> Erreur lors du changement de status </strong>
      )
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette commande ?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/commandes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });



      if (res.ok) {
        setCommandes(commandes.filter((c) => c.id_commande !== id));
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
      }else {

        toast.error(
            <strong> Erreur de  Commande </strong>
        )
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleEdit = async (commande) => {
    const nouveauFournisseur = prompt("Nouvel ID fournisseur :", commande.id_fournisseur);
    if (!nouveauFournisseur) return;
    try {
      const res = await fetch(`http://localhost:5000/api/commandes/${commande.id_commande}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id_fournisseur: nouveauFournisseur }),
      });
      if (res.ok) {
        const refreshed = await fetch("http://localhost:5000/api/commandes", {
          credentials: "include",
        });
        const data = await refreshed.json();
        // Re-trier aussi après édition
        const sortedData = data.sort((a, b) => b.id_commande - a.id_commande);
        setCommandes(sortedData);
      }
    } catch (err) {
      console.error("Erreur modification :", err);
    }
  };

  const fetchContenusParCommande = async (id_commande) => {
    try {
      const res = await fetch(`http://localhost:5000/api/commandes/search/${id_commande}`, {
        credentials: "include",
      });
      const data = await res.json();
      setSelectedCommandeId(id_commande);
      setContenus(data.lignes || []);
      setShowModal(true);
    } catch (err) {
      console.error("Erreur chargement contenu :", err);
      setContenus([]);
    }
  };

  const toggleMenu = (index, e) => {
    e.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const getOptions = (status) => {
    switch (status) {
      case "enregistrée":
        return ["enregistrée", "en cours"];
      case "en cours":
        return ["en cours", "livrée"];
      case "livrée":
      default:
        return ["livrée"];
    }
  };

  return (
      <div
          className="liste"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "500px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Liste de commande</h2>

        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <div style={{ overflowY: "auto", height: "100%" }} className="scroll-invisible">
            <style>{`
            .scroll-invisible::-webkit-scrollbar { display: none; }
            .scroll-invisible { scrollbar-width: none; }
          `}</style>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, backgroundColor: "#f8f8f8", zIndex: 1 }}>
              <tr>
                <th style={{ padding: "8px" }}>ID</th>
                <th style={{ padding: "8px" }}>Date</th>
                <th style={{ padding: "8px" }}>Fournisseur</th>
                <th style={{ padding: "8px" }}>Produits</th>
                <th style={{ padding: "8px" }}>Statut</th>
                <th style={{ padding: "8px" }}>Actions</th>
              </tr>
              </thead>
              <tbody>
              {commandes.map((commande, index) => (
                  <tr
                      key={commande.id_commande}
                      onClick={() => fetchContenusParCommande(commande.id_commande)}
                      style={{
                        cursor: "pointer",
                        background: selectedCommandeId === commande.id_commande ? "#f0f0f0" : "white",
                      }}
                  >
                    <td style={{ padding: "8px" }}>Commande #{commande.id_commande}</td>
                    <td style={{ padding: "8px" }}>
                      {new Date(commande.date_commande).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "8px" }}>{commande.fournisseur}</td>
                    <td style={{ padding: "8px" }}>
                      {nombreProduitsParCommande[commande.id_commande] ?? "..."}
                    </td>
                    <td style={{ padding: "8px" }}>
                      <select
                          value={commande.status}
                          onChange={(e) => updateStatut(commande, e.target.value)}
                          disabled={commande.status === "livrée"}
                          style={{ padding: "4px", borderRadius: "4px" }}
                      >
                        {getOptions(commande.status).map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ position: "relative", padding: "8px" }}>
                      {commande.status === "enregistrée" && (
                          <button
                              style={{
                                background: "none",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(commande.id_commande);
                              }}
                          >
                            ❌ Annuler
                          </button>
                      )}
                      {commande.status === "livrée" && (
                          <button
                              style={{
                                background: "none",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(commande.id_commande);
                              }}
                          >
                            🗑 Supprimer
                          </button>
                      )}
                      {commande.status === "en cours" && (
                          <span style={{ color: "gray" }}>Aucune action possible</span>
                      )}
                    </td>
                  </tr>
              ))}
              {commandes.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                      Aucune commande trouvée.
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
            <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
            >
              <div
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "38%",
                    maxHeight: "80vh",
                    overflowY: "auto",
                  }}
              >
                <h3>Détails de la commande #{selectedCommandeId}</h3>
                <table style={{ width: "100%" }}>
                  <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                  </tr>
                  </thead>
                  <tbody>
                  {contenus.map((contenu, index) => (
                      <tr key={index}>
                        <td>{contenu.produit}</td>
                        <td>{contenu.quantite}</td>
                        <td>{contenu.prix_unitaire} €</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
                <div style={{ marginTop: "20px", textAlign: "right" }}>
                  <button onClick={() => setShowModal(false)}>Fermer</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Comdetails;
