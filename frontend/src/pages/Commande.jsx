import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CreateCommande from "../components/CreateCommande";
import CommandeList from "../components/CommandeList";
import CommandDetails from "../components/CommandDetails";
import { useAuth } from "../contexts/AuthContext";

const Commande = () => {
  const [commandes, setCommandes] = useState([]);
  const [editingCommande, setEditingCommande] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const { utilisateur } = useAuth();

  // ✅ Charger les commandes depuis l'API AVEC les cookies
  useEffect(() => {
    fetch("http://localhost:5000/api/commandes", {
      credentials: "include", // 👈 Essentiel pour la session
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCommandes(data);
        } else {
          console.warn("❌ Données reçues non valides :", data);
          setCommandes([]);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement commandes", err);
        setCommandes([]);
      });
  }, [refresh]);

  // ✅ Ajouter une commande
  const handleAdd = async (commande) => {
    await fetch("http://localhost:5000/api/commandes/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 👈 Toujours requis
      body: JSON.stringify(commande),
    });
    setRefresh(!refresh);
  };

  // ✅ Modifier une commande
  const handleEdit = async (commande) => {
    await fetch(`http://localhost:5000/api/commandes/${commande.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(commande),
    });
    setEditingCommande(null);
    setRefresh(!refresh);
  };

  // ✅ Supprimer une commande
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette commande ?")) return;
    await fetch(`http://localhost:5000/api/commandes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setRefresh(!refresh);
  };
  // ✅ Gérer l'affichages des détails d'une commande
  useEffect(() => {
    fetch(`http://localhost:5000/api/commandes/details`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCommandes(data);
        } else {
          console.warn("❌ Données reçues non valides :", data);
          setCommandes([]);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement détails commandes", err);
        setCommandes([]);
      });
  }, [refresh]);

  return (
    <>
      <Sidebar />
      <section className="home-section" style={{ position: "fixed" }}>
        <Navbar />
        <div className="home-content" style={{ display: "flex", justifyContent: "space-between" }}>
          {utilisateur?.role !== "admin" ? (
            <>
              {/* <h2>Gestion des Commandes</h2> */}
              <CreateCommande onAdd={handleAdd} />
            </>
          ) : (
            <h2>Liste des Commandes</h2>
          )}
          <div className="commande-wrapper" style={{ width: "100%"}}>
            <CommandeList
              commandes={commandes.slice(0, 10)} // Limite à 10 commandes
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
  
        {/* <div className="commande-content"> */}
          {/* {utilisateur?.role !== "admin" && (
            <div className="commande-box">
              <CommandDetails commandes={commandes} />
            </div>
          )} */}
       

      
      </section>
    </>
  );
  
};

export default Commande;
