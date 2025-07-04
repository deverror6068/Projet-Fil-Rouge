// components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from '../assets/logo.png';
import useLogout from "../services/authService";
import useNavigateHook from "../services/redirectService";






const menuItems = [
  { icon: "bx bx-grid-alt", label: "Dashboard" , path: "/dashboard",  roles: ["utilisateur", "responsable", "admin"]},
  { icon: "bx bx-cart-alt", label: "Fournisseurs", path: "/fournisseurs" ,  roles: ["utilisateur","responsable", "admin"] },
  { icon: "bx bx-box", label: "Produit", path: "/products", roles: ["utilisateur","responsable", "admin"] },
  { icon: "bx bx-list-ul", label: "Commandes" , path: "/command", roles: ["utilisateur","responsable", "admin"]},
  { icon: "bx bx-pie-chart-alt-2", label: "Analyses" , path: "/analyse", roles: ["responsable", "admin"] },

  { icon: "bx bx-help-circle", label: "Utilisateur" , path: "/utilisateurs" ,  roles: [ "responsable", "admin"] },
];

const Sidebar = () => {
  const logout = useLogout();
  const home = useNavigateHook()

  const location = useLocation();
  const { utilisateur } = useAuth(); // Récupération de l'utilisateur connecté
  if (!utilisateur) return null; // Si l'utilisateur n'est pas connecté, ne pas afficher la sidebar
  return (
    <div className="sidebar">
      <div className="logo-details">
        <i className="bx bxl-c-plus-plus"></i>
        {/* <span className="logo_name">D-CLIC</span> */}
        <img src={logo} onClick={home} alt="Logo" style={{ width: "100px", height: "auto" }} />

      </div>
        <ul className="nav-links">
        {menuItems
        .filter(item => item.roles.includes(utilisateur.role)) // filtrage par rôle ici
        .map((item, i) => (
          <li key={i}>
            <Link to={item.path} className={location.pathname === item.path ? "active" : ""}>
              <i className={item.icon}></i>
              <span className="links_name">{item.label}</span>
            </Link>
          </li>
        ))}
        <li className="log_out">
          <a onClick={logout}>
            <i className="bx bx-log-out"></i>
            <span className="links_name">Déconnexion</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
