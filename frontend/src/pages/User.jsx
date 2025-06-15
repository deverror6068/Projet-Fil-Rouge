import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UtilisateurList from "../components/UtilisateurList";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import CreateUser from "../components/CreateUser";


const User = () => {
  const { utilisateur } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!utilisateur) {
      setError("Vous devez être connecté pour accéder à cette page.");
    }
  }, [utilisateur]);

  if (error) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Sidebar />
      <section className="home-section">
        <Navbar />
        <div className="home-content" style={{ display: "flex" }}>
            <div className="create-user">
                <CreateUser/>
                <UtilisateurList />
            </div>
        </div>
      </section>
    </>
  );
  
}
export default User;