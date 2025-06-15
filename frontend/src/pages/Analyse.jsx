import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StockDashboard from "../components/StockDashboard";
import Over from "../components/Over";
const Analyse = () => {
  const [stocks, setStocks] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // Charger les produits depuis l'API
  useEffect(() => {
    fetch("/api/stock")
      .then((res) => res.json())
      .then(setStocks)
      .catch((err) => console.error("Erreur chargement produits", err));
  }, [refresh]);

  return (
    <>
      <Sidebar />
      <section className="home-section">
        <Navbar />
        <div className="home-content">
          <StockDashboard stocks={stocks} />
          <Over stocks={stocks} setStocks={setStocks} editingStock={editingStock} setEditingStock={setEditingStock} refresh={refresh} setRefresh={setRefresh} />
        </div>
      </section>
    </>
  );
}
export default Analyse;