// components/Navbar.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";


const Navbar = () => {
  const { utilisateur } = useAuth();

  return (
    <nav>
      <div className="sidebar-button">
        <i className="bx bx-menu sidebarBtn"></i>
        <span className="dashboard">Dashboard</span>
      </div>
      <div className="search-box">
        <input type="text" placeholder="Recherche..." />
        <i className="bx bx-search"></i>
      </div>
      <div className="profile-details">
        <span className="admin_name">   {utilisateur ? `${utilisateur.nom} (${utilisateur.role})` : "Utilisateur non connecté"}</span>
        <i className="bx bx-chevron-down"></i>
      </div>
    </nav>
  );
};

export default Navbar;
