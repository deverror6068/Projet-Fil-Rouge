import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import UpdateFournisseur from "../components/UpdateFournisseur";

const ModiFournisseur = () => {
  const { utilisateur } = useAuth();
  const [fournisseur, setFournisseur] = useState(null);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  
  return (
    <>
      <Sidebar />
      <section className="home-section">
        <Navbar />
        <div className="home-content">
            <button
                type="button"
                onClick={() => navigate("/fournisseurs")}
                className="btn btn-primary" style={ { marginLeft:"2rem" } }
                >
                ← Retour à la liste
            </button>


          {/* <h2>Modifier Fournisseur</h2> */}
          <UpdateFournisseur fournisseur={fournisseur}/>
        </div>
      </section>
    </>
  );
}
export default ModiFournisseur;