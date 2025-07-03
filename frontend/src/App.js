// import logo from './logo.svg';
import './style/styles.css';
import './style/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
// import RouteProtegee from "./components/ProtectedRoute";
import React from "react";

import ProductPage from "./pages/ProductPage";
import Commande from "./pages/Commande";

import Analyse from "./pages/Analyse";

import Fournisseur from './pages/Fournisseur';
import StockAlerts from "./pages/Notification";

import RegisterPage from './pages/RegisterPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import UserPage from "./pages/UserPage";
import Utilisateurs from './pages/User';
import Magasin from "./pages/MagasinsPage";
import Modifournisseur from "./pages/ModiFournisseur";
import Page404 from "./pages/Error404.jsx";
import RouteProtegee from "./components/ProtectedRoute";
import {ToastContainer} from "react-toastify";
import UserHistory from "./pages/UserHistory";
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
                    <ToastContainer />
                </RouteProtegee>
            } />
            <Route path="/command" element={
                <RouteProtegee>
                    <Commande />
                    <ToastContainer />
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
                    <ToastContainer />
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
                    <ToastContainer />
                </RouteProtegee>
            } />
            <Route path="/modifier/:id" element={
                <RouteProtegee>
                    <Modifournisseur />
                    <ToastContainer />
                </RouteProtegee>
            } />
            <Route path="/fournisseur/modifier/:id" element={
                <RouteProtegee>
                    <Modifournisseur />
                </RouteProtegee>
            } />


            <Route path="/UserHistory/:id" element={
                <RouteProtegee>
                    <UserHistory />
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
