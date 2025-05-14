import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import RouteProtegee from "./components/ProtectedRoute";
import React from "react";
import CommandPage from "./components/CreerCommandePage";
function App() {
    return (
        <Routes>
          {/*  <Route path="/" element={<LoginPage />} />*/}
            <Route path="/dashboard" element={
                <RouteProtegee>
                    <Dashboard />
                </RouteProtegee>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-commands" element={
                <RouteProtegee>
                    <CommandPage />
                </RouteProtegee>
            } />

        </Routes>

    );
}

export default App;
