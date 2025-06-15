// frontend/src/pages/MagasinsPage.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MagasinList from "../components/MagasinList";

const MagasinsPage = () => {
  return (
    <>
      <Sidebar />
      <section className="home-section">
        <Navbar />
        <div className="home-content">
          <h2>Gestion des Magasins</h2>
          <MagasinList />
        </div>
      </section>
    </>
  );
};

export default MagasinsPage;
