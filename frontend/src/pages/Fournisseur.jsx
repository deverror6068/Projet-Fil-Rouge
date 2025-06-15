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
  // Charger les produits depuis l'API
  // useEffect(() => {
  //   fetch("/api/fournisseurs")
  //     .then((res) => res.json())
  //     .then(setProducts)
  //     .catch((err) => console.error("Erreur chargement produits", err));
  // }, [refresh]);

  // const handleAdd = async (product) => {
  //   await fetch("/api/fournisseurs", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(product),
  //   });
  //   setRefresh(!refresh);
  // };

  // const handleEdit = async (product) => {
  //   await fetch(`/api/fournisseurs/${product.id}`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(product),
  //   });
  //   setEditingProduct(null);
  //   setRefresh(!refresh);
  // };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Supprimer ce produit ?")) return;
  //   await fetch(`/api/fournisseurs/${id}`, { method: "DELETE" });
  //   setRefresh(!refresh);
  // };

  return (
    <>
      <Sidebar />
      <section className="home-section">
        <Navbar />
        <div className="home-content" style={{position: "fixed"}}>
          <h2>Gestion des Fournisseurs</h2>
          {/* <ProductForm
            onAdd={handleAdd}
            onEdit={handleEdit}
            editingProduct={editingProduct}
          /> */}
          {/* <ProductTable
            products={products}
            onDelete={handleDelete}
            onEditClick={setEditingProduct}
          /> */}
          {/* {utilisateur?.role !== "responsable" && (
            <CreateFournisseur onAdd={handleAdd} onEdit={handleEdit} editingProduct={editingProduct} />
          )} */}
          <div className="product-actions" style={{ display: "flex", gap: "9rem" }}>
            <CreateFournisseur/>
            <div className="sales-boxes" style={{ width: "90%" }}> 
              <Fournisseur/>
            </div>
          </div>
        </div>
        
      </section>
    </>
  );
};

export default Fournipage;
