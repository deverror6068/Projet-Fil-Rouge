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
import Page404 from "./pages/Error404";
import RouteProtegee from "./components/ProtectedRoute";
function App() {
    return (
        <Routes>
          {/*  <Route path="/" element={<LoginPage />} />*/}
            {/* <Route path="/dashboard" element={
                <RouteProtegee>
                    <Dashboard />
                </RouteProtegee>
            } /> */}
            <Route path="/dashboard" element={
                <RouteProtegee>
                    <Dashboard />
                </RouteProtegee>
            } />
            <Route path="/dashboard" element={
                <RouteProtegee>
                    <Dashboard />
                </RouteProtegee>
            } />
            <Route path="/products" element={
                <RouteProtegee>
                    <ProductPage />
                </RouteProtegee>
            } />
            <Route path="/command" element={
                <RouteProtegee>
                    <Commande />
                </RouteProtegee>
            } />
            <Route path="/stock" element={
                <RouteProtegee>
                    <Stock />
                </RouteProtegee>
            } />
            <Route path="/analyse" element={
                <RouteProtegee>
                    <Analyse />
                </RouteProtegee>
            } />
            {/* <Route path="/user" element={<UserProfile />} /> */}
            <Route path="/fournisseurs" element={
                <RouteProtegee>
                    <Fournisseur />
                </RouteProtegee>
            } />
            <Route path="/stock-alerts" element={
                <RouteProtegee>
                    <StockAlerts />
                </RouteProtegee>
            } />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user" element={
                <RouteProtegee>
                    <UserPage />
                </RouteProtegee>
            } />
            <Route path="/magasins" element={
                <RouteProtegee>
                    <Magasin />
                </RouteProtegee>
            } />
            <Route path="/utilisateurs" element={
                <RouteProtegee>
                    <Utilisateurs />
                </RouteProtegee>
            } />
            <Route path="/modifier/:id" element={
                <RouteProtegee>
                    <Modifournisseur />
                </RouteProtegee>
            } />
            <Route path="/fournisseur/modifier/:id" element={
                <RouteProtegee>
                    <Modifournisseur />
                </RouteProtegee>
            } />
                <Route path="*" element={
                        <RouteProtegee>
                                <Page404 />
                        </RouteProtegee>} />


        </Routes>

    );
}

export default App;
