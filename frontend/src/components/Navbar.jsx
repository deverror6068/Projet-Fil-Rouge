// components/Navbar.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import SearchBox from "./SearchBox";


const Navbar = () => {
  const { utilisateur } = useAuth();

  return (
    <nav>
      <div className="sidebar-button">
        <i className="bx bx-menu sidebarBtn"></i>
        <span className="dashboard">Dashboard</span>
      </div>

      <SearchBox />
      <div className="profile-details">
        <span className="admin_name">   {utilisateur ? `${utilisateur.nom} (${utilisateur.role})` : "Utilisateur non connecté"}</span>
        <i className="bx bx-chevron-down"></i>
      </div>
    </nav>
  );
};

export default Navbar;
