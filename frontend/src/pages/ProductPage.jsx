import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import { useAuth } from "../contexts/AuthContext";
import CreateProFornisseur from "../components/CreateProFornisseur";
import AssocierProductFor from "../components/AssocierProductFor";
const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const { utilisateur } = useAuth();

  // Charger les produits depuis l'API
  useEffect(() => {
    fetch("/api/produits")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error("Erreur chargement produits", err));
  }, [refresh]);

  const handleAdd = async (product) => {
    await fetch("/api/produits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    setRefresh(!refresh);
  };

  const handleEdit = async (product) => {
    await fetch(`/api/produits/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    setEditingProduct(null);
    setRefresh(!refresh);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    await fetch(`/api/produits/${id}`, { method: "DELETE" });
    setRefresh(!refresh);
  };

  const handleRefresh = () => setRefresh(prev => !prev);


  return (
    <>
      <Sidebar />
      <section className="home-section">
        <Navbar />
        <div className="home-content">
          <h2 style={{marginLeft: "2rem"}}>Gestion des Produits</h2>
          {/* {utilisateur?.role !== "responsable" && (
            <ProductForm
              onAdd={handleAdd}
              onEdit={handleEdit}
              editingProduct={editingProduct}
            />
          )} */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              padding: "2rem",
              alignItems: "flex-start", // pour aligner en haut
              flexWrap: "wrap" // au cas où l'écran est petit
            }}
          >
            <div className="product-actions" style={{ display: "flex" , marginTop: "2rem"}}>
              {/* <ProductForm
                onAdd={handleAdd}
                onEdit={handleEdit}
                editingProduct={editingProduct}
              /> */}
              <ProductForm onAdd={handleRefresh} />
              <CreateProFornisseur
                onAdd={handleAdd} 
                onEdit={handleEdit}
                editingProduct={editingProduct}
              />
              <AssocierProductFor
                onAdd={handleAdd}
                onEdit={handleEdit}
                editingProduct={editingProduct}
              />
            </div>

            <div className="sales-boxes" style={{ marginTop: "3rem", flex: 1 }}> 
                {/* <ProductTable/> */}
                <ProductTable refresh={refresh} setRefresh={setRefresh} />

            </div>
          </div>
        </div>
        
      </section>
    </>
  );
};

export default ProductPage;
