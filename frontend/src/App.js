// import logo from './logo.svg';
import './styles.css';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
// import RouteProtegee from "./components/ProtectedRoute";
import React from "react";
// import CommandPage from "./components/CreerCommandePage";
import ProductPage from "./pages/ProductPage";
import Commande from "./pages/Commande";
import Stock from "./pages/Stock";
import Analyse from "./pages/Analyse";
// import UserProfile from './components/UserProfil';
import Fournisseur from './pages/Fournisseur';
import StockAlerts from "./pages/Notification";
// import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserPage from "./pages/UserPage";
import Utilisateurs from './pages/User';
import Magasin from "./pages/MagasinsPage";
import Modifournisseur from "./pages/ModiFournisseur";
function App() {
    return (
        <Routes>
          {/*  <Route path="/" element={<LoginPage />} />*/}
            {/* <Route path="/dashboard" element={
                <RouteProtegee>
                    <Dashboard />
                </RouteProtegee>
            } /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/command" element={<Commande />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/analyse" element={<Analyse />} />
            {/* <Route path="/user" element={<UserProfile />} /> */}
            <Route path="/fournisseurs" element={<Fournisseur />} />
            <Route path="/stock-alerts" element={<StockAlerts />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user" element ={<UserPage />} />
            <Route path="/magasins" element={<Magasin />} />
            <Route path="/utilisateurs" element={<Utilisateurs />} />
  
            <Route path="/modifier/:id" element={<Modifournisseur />} />


        </Routes>

    );
}

export default App;
