import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StockList from "../components/StockList";

const StockPage = () => {
  return (
    <>
      <Sidebar />
      <section className="home-section">
        <Navbar />
        <div className="home-content">
          <StockList />
        </div>
      </section>
    </>
  );
};

export default StockPage;
