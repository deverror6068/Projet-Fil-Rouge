// pages/DashboardPage.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import SalesData from "../components/SalesData";
import TopProducts from "../components/TopProducts"; // N'oublie pas de l'importer si ce n'était pas le cas
import StockProduct from "../components/StockProduct"; // Si tu as un composant pour afficher les produits en stock
const DashboardPage = () => {
  return (
    <>
      <Sidebar /> {/* Il doit être en dehors de la section home-section */}
      <section className="home-section">
        <Navbar />
        <div className="home-content">
          <StatsCards />
          <div className="sales-layout">
            <div className="sales-boxes stock-center" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <StockProduct />
            </div>

            <div className=" sales-boxes sales-bottom">
              <SalesData />
              <TopProducts />
            </div>
          </div>

        </div>
       
      </section>
      <div className="footer">
          <p>© 2023 D-CLIC. Tous droits réservés.</p>
      </div>
    </>
  );
};

export default DashboardPage;
