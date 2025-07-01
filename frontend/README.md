
# 📦 D-Stock – Application de Gestion de Stock

**D-Stock** est une plateforme web moderne de gestion des stocks pour une chaîne de magasins. Elle permet la gestion complète des produits, fournisseurs, commandes et utilisateurs avec des rôles différenciés (`admin`, `responsable`, `utilisateur`). Le tout est enrichi par des dashboards clairs et des statistiques visuelles pour un suivi optimal.

## ✨ Fonctionnalités principales

- 🔐 **Gestion des utilisateurs**
  - Connexion sécurisée avec rôles (`admin`, `responsable`, `utilisateur`)
  - Affichage personnalisé selon le rôle

- 📦 **Gestion des produits**
  - CRUD complet
  - Visualisation des produits disponibles
  - Alerte stock faible (moins de 5 unités restantes)

- 🧾 **Gestion des fournisseurs**
  - Ajout, modification et suppression
  - Association produit ↔ fournisseur

- 📋 **Gestion des commandes**
  - Création de commande (choix du fournisseur)
  - Suivi du statut (`enregistrée`, `livrée`, etc.)

- 📊 **Dashboard & Statistiques**
  - Nombre total de commandes, produits, fournisseurs
  - Graphiques (stats visuelles)
  - Liste des produits en stock critique
  - Produits les plus populaires (à venir)

## 🖥️ Interface utilisateur

L’interface est construite avec React, pensée pour une expérience fluide et responsive :
- Sidebar latéral pour la navigation
- Dashboard principal avec KPIs et tableaux
- Composants dynamiques (modales, scrolls, formulaires, etc.)

## 🛠️ Stack technique

- **Frontend** : React, HTML, CSS
- **Backend** : Node.js, Express.js
- **Base de données** : SQL
- **Auth** : Sessions avec cookie sécurisé


## 🚀 Lancement du projet

### 1. Backend
```bash
cd backend
npm install
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
npm npm start
```


## 📦 Fonctionnalités futures

- Authentification JWT
- Gestion des retours produit
- Système de notifications (rupture, commande livrée)
- Ajout des tests unitaires

## 👨‍💻 Auteur

Projet développé par **Pélagie-AINTANGAR&Alexandre-PHAM** – Fullstack Developer (React / Node)
