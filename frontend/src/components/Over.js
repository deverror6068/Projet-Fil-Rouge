import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const Off = () => {
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {

                const response = await fetch('http://localhost:5000/api/commandes', {
               credentials:'include'
                });
                const orders = await response.json();
                console.log("qseswfrddresg",orders)

                // Regrouper les commandes par utilisateur
                const userStatsMap = {};

                orders.forEach(order => {
                    const userId = order.vendeur_id;
                    if (!userStatsMap[userId]) {
                        userStatsMap[userId] = {
                            utilisateur: `Utilisateur ${userId}`,
                            nombreCommandes: 0,
                            totalProduits: 0,
                            typesProduits: new Set(),
                            montantTotal: 0
                        };
                    }

                    const userStats = userStatsMap[userId];
                    userStats.nombreCommandes += 1;

                    order.lignes.forEach(produit => {
                        userStats.totalProduits += produit.quantite;
                        userStats.typesProduits.add(produit.id_produit);
                        userStats.montantTotal += produit.quantite * produit.prix_unitaire;
                    });
                });

                // Convertir les ensembles en nombres et préparer les données pour le graphique
                const chartData = Object.values(userStatsMap).map(user => ({
                    utilisateur: user.utilisateur,
                    nombreCommandes: user.nombreCommandes,
                    totalProduits: user.totalProduits,
                    typesProduits: user.typesProduits.size,
                    montantTotal: user.montantTotal.toFixed(2)
                }));

                setOrderData(chartData);
            } catch (error) {
                console.error('Erreur lors de la récupération des commandes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <h2>📈 Statistiques des commandes par utilisateur</h2>
            {loading ? (
                <p>Chargement des données...</p>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={orderData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="utilisateur" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="nombreCommandes" fill="#8884d8" name="Nombre de commandes" />
                        <Bar dataKey="totalProduits" fill="#82ca9d" name="Total de produits" />
                        <Bar dataKey="typesProduits" fill="#ffc658" name="Types de produits" />
                        <Bar dataKey="montantTotal" fill="#ff8042" name="Montant total (€)" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default Off;
