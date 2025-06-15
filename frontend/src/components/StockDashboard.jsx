import React from "react";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell,
  LineChart, Line, Legend
} from "recharts";

// Couleurs pour les graphiques
const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#FF6384", "#36A2EB"];

const StockDashboard = () => {

  const [commandesParJour, setCommandesParJour] = useState([]);
  const [quantiteParProduit, setQuantiteParProduit] = useState([]);
  const [produitsEnRupture, setProduitsEnRupture] = useState([]);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const res = await fetch("/api/commandes/date", {
          credentials: "include",
        });
        const data = await res.json();
        console.log("✅ Données reçues du backend :", data);

        const formate = data.map(c => ({
          date: new Date(c.date_commande).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit"
          }),
          total: c.nombre_commandes
        }));
        setCommandesParJour(formate);
      } catch (err) {
        console.error("Erreur chargement statistiques commandes :", err);
      }
    };

    fetchCommandes();
  }, []);

  useEffect(() => {
    const fetchProduitsEtQuantites = async () => {
      try {
        // Étape 1 : récupérer tous les produits
        const resProduits = await fetch("/api/produits", {
          credentials: "include"
        });
        const produits = await resProduits.json();

        // Étape 2 : pour chaque produit, récupérer sa quantité dispo
        const quantites = await Promise.all(
          produits.map(async (produit) => {
            const res = await fetch(`/api/produits/${produit.id_produit}/quantite`, {
              credentials: "include"
            });
            const data = await res.json();
            return {
              nom: produit.nom,
              quantite: data.quantite_disponible ?? 0
            };
          })
        );

        setQuantiteParProduit(quantites);
      } catch (error) {
        console.error("Erreur chargement quantités :", error);
      }
    };

    fetchProduitsEtQuantites();
  }, []);

  useEffect(() => {
    const fetchProduitsEnRupture = async () => {
      try {
        const res = await fetch("/api/produits/rupture", {
          credentials: "include"
        });
        const data = await res.json();
        setProduitsEnRupture(data);
      } catch (err) {
        console.error("Erreur chargement produits en rupture :", err);
      }
    };
  
    fetchProduitsEnRupture();
  }, []);
  // 1. Quantité disponible par produit (BarChart)
  // const quantiteParProduit = [
  //   { nom: "Ordinateur", quantite: 120 },
  //   { nom: "Clavier", quantite: 80 },
  //   { nom: "Souris", quantite: 40 },
  //   { nom: "Écran", quantite: 20 },
  // ];

  // 2. Produits en rupture (PieChart)
  // const produitsEnRupture = [
  //   { nom: "Souris", valeur: 4 },
  //   { nom: "Écran", valeur: 2 },
  // ];

  // 3. Historique du stock (LineChart)
  const stockParJour = [
    { date: "01/05", quantite: 50 },
    { date: "02/05", quantite: 60 },
    { date: "03/05", quantite: 45 },
    { date: "04/05", quantite: 70 },
    { date: "05/05", quantite: 55 },
  ];

  // 4. Commandes par mois (BarChart ou LineChart)
  // const commandesMois = [
  //   { mois: "Jan", total: 10 },
  //   { mois: "Fév", total: 14 },
  //   { mois: "Mar", total: 18 },
  //   { mois: "Avr", total: 9 },
  //   { mois: "Mai", total: 21 },
  // ];

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Quantité disponible par produit</h2>
      <BarChart width={600} height={300} data={quantiteParProduit}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nom" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="quantite" fill="#8884d8" />
      </BarChart>

      <h2 style={{ marginTop: "3rem" }}>Produits en rupture</h2>
      <p>Toucher pour voir les produits en stocks</p>
      <PieChart width={400} height={300}>
        <Pie
          data={produitsEnRupture}
          dataKey="valeur"
          nameKey="nom"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {produitsEnRupture.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <h2 style={{ marginTop: "3rem" }}>Historique du stock</h2>
      <LineChart width={700} height={300} data={stockParJour}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="quantite" stroke="#ff7300" />
      </LineChart>

      <h2 style={{ marginTop: "3rem" }}>Commandes par jour</h2>
      <BarChart width={600} height={300} data={commandesParJour}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#00C49F" />
      </BarChart>
    </div>
  );
};

export default StockDashboard;
