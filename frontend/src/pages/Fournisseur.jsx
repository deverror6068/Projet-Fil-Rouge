import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
// import ProductForm from "../components/ProductForm";
// import ProductTable from "../components/ProductTable";
import Fournisseur from "../components/Fournisseur";
import { useAuth } from "../contexts/AuthContext";
import CreateFournisseur from "../components/CreateFournisseur";

const Fournipage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const { utilisateur } = useAuth();
  const [fournisseurs, setFournisseurs] = useState([]);
  const handleRefresh = () => setRefresh(prev => !prev);


  useEffect(() => {
    fetch("/api/fournisseurs")
      .then((res) => res.json())
      .then(setFournisseurs)
      .catch((err) => console.error("Erreur chargement fournisseurs", err));
  }, [refresh]);

  
  return (
    <>
      <Sidebar />
      <section className="home-section">
        <Navbar />
        <div className="home-content" style={{position: "fixed"}}>
          <h2>Gestion des Fournisseurs</h2>
          <div className="product-actions" style={{ display: "flex", gap: "4rem" }}>
            <CreateFournisseur onAdd={handleRefresh}    refresh={refresh}/>


            <div className="sales-boxes" style={{ width: "90%" }}> 
            {/* <Fournisseur refresh={refresh} setRefresh={setRefresh}/> */}
              <Fournisseur
                fournisseurs={fournisseurs}
                refresh={refresh}
                onRefresh={handleRefresh}
              />
            </div>
          </div>
        </div>
        
      </section>
    </>
  );
};

export default Fournipage;
