import axios from 'axios';

const API_URL = 'http://localhost:5000/api/produits';  // Remplace par l'URL de ton backend

export const getProduits = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des produits', error);
        throw error;
    }
};

export const addProduit = async (produit) => {
    try {
        const response = await axios.post(API_URL, produit);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit', error);
        throw error;
    }
};

// Ajoute d'autres méthodes pour PUT, DELETE si nécessaire
