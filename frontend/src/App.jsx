// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CommandPage from  "./components/CreerCommandePage";

function App() {
    return (

            <Routes>
           {/*     <Route path="/" element={<LoginPage />} />*/}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/create-commands" element={<CommandPage/>}/>
            </Routes>

    );
}

export default App;
