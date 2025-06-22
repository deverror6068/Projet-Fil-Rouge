import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CreateCommande from "../components/CreateCommande";
import CommandeList from "../components/CommandeList";
import CommandDetails from "../components/CommandDetails";
import { useAuth } from "../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const Commande = () => {



  const [commandes, setCommandes] = useState([]);
  const [editingCommande, setEditingCommande] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const { utilisateur } = useAuth();


  // ✅ Charger les commandes depuis l'API AVEC les cookies
  useEffect(() => {

  }, [refresh]);

  // ✅ Ajouter une commande
  const handleAdd = async (commande) => {

    console.log("sdq<sefqqsd",commande)
     const  res  = await fetch("http://localhost:5000/api/commandes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 👈 Toujours requis
      body: commande,
    });
    let data = await res.json()
  console.log( "sdygsdf",Object.entries(data) )
    console.log(JSON.parse(commande).commande,'sqdsfertergttrty')
    if (res.ok){
        let resume = JSON.parse(commande)
        console.log(resume.commande.id_fournisseur)
      const message = (
          <div>
            <strong>✅ Commande ajoutée !</strong>
            <div><b>Fournisseur :</b> {resume.commande.id_fournisseur}</div>
            <div><b>Statut :</b> {resume.commande.status}</div>
            <hr />
            <div><b>Produits :</b></div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
                {Array.isArray(resume.lignes) && resume.lignes.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {resume.lignes.map((ligne, index) => (
                            <li key={index}>
                                🛒 <b>Produit #{ligne.id_produit}</b> – Qté: {ligne.quantite} – Prix: {ligne.prix_unitaire} €
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>Aucun produit dans la commande.</div>
                )}

            </ul>
          </div>
      );

      toast.success(message, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      /*  toast.error(
            <strong> Erreur de  Commande </strong>
        )*/
    }else{
        toast.error(
            <strong> Erreur de  Commande </strong>
        )
    }


    setRefresh(!refresh);
  };

  // ✅ Modifier une commande
  const handleEdit = async (commande) => {
      const  res = await fetch(`http://localhost:5000/api/commandes/${commande.id}`, {
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
           {/*   <CreateCommande onAdd={handleAdd} */} <CreateCommande  onAdd= {handleAdd}  />
            </>
          ) : (
            <h2>Liste des Commandes</h2>
          )}
          <div className="commande-wrapper" style={{ width: "100%"}}>
            <CommandeList
                refresh={!refresh}
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
