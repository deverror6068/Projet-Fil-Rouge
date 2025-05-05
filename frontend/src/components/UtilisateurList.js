import React, { useEffect, useState } from 'react';

const UtilisateursList = () => {
    // État pour stocker les utilisateurs
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [error, setError] = useState(null);

    // Récupération des utilisateurs depuis l'API
    useEffect(() => {
        const fetchUtilisateurs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/utilisateurs');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des utilisateurs');
                }
                const data = await response.json();
                setUtilisateurs(data); // Mettre à jour l'état avec les données
            } catch (error) {
                setError(error.message); // Gérer l'erreur
            }
        };

        fetchUtilisateurs();
    }, []);

    return (
        <div>
            <h1>Liste des Utilisateurs</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Afficher les erreurs */}
            <ul>
                {utilisateurs.map((utilisateur) => (
                    <li key={utilisateur.id_utilisateur}>
                        {utilisateur.nom} {utilisateur.prenom} - {utilisateur.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UtilisateursList;
