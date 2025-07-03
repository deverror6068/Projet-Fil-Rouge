
#  D-Stock – Application de Gestion de Stock

**D-Stock** est une application web  de gestion des stocks pour une chaîne de magasins. Elle permet la gestion  des produits, fournisseurs, commandes et utilisateurs avec des rôles différenciés ( `responsable`, `utilisateur`). Le tout est épaulé par des dashboards  et des statistiques visuelles pour un suivi optimal.

## ✨ Fonctionnalités principales

-  **Gestion des utilisateurs**
  - Connexion sécurisée avec rôles ( `responsable`, `utilisateur`)
  - Affichage personnalisé selon le rôle

-  **Gestion des produits**
  - CRUD complet
  - Visualisation des produits disponibles
  - Alerte stock faible (moins de 5 unités restantes)

-  **Gestion des fournisseurs**
  - Ajout, modification et suppression
  - Association produit ↔ fournisseur

-  **Gestion des commandes**
  - Création de commande (choix du fournisseur)
  - Suivi du statut (`enregistrée`, `livrée`, etc.)

-  **Dashboard & Statistiques**
  - Nombre total de commandes, produits, fournisseurs
  - Graphiques (stats visuelles)
  - Liste des produits en stock critique
  - Produits les plus populaires (à venir)

##  Interface utilisateur

L’interface est construite avec React, pensée pour une expérience fluide et responsive :
- Sidebar latéral pour la navigation
- Dashboard principal avec KPIs et tableaux
- Composants dynamiques (modales, scrolls, formulaires, etc.)

##  Stack technique

- **Frontend** : React, HTML, CSS
- **Backend** : Node.js, Express.js,Axios pour certaine requetes
- **Base de données** : SQL
- **Auth** : Sessions avec cookie sécurisé
- **PHPmyAdmin** et **WampServer**  : pour  l'administration de la base de donnée 



##  Lancement du projet

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


##  Fonctionnalités futures

- Authentification JWT
- Gestion des retours produit
- Système de notifications (rupture, commande livrée)
- Ajout des tests unitaires
- Ajout du role `admin`

##  Auteurs

Projet développé par **Pélagie-AINTANGAR et  Alexandre-PHAM**  dans le cadre du projet `Fil-Rouge`




# Documentation Technique du Projet

## Présentation Générale

Ce projet est une application web de gestion (stock, commandes, utilisateurs, etc.) composée d’un backend Node.js/Express et d’un frontend React avec un support d'Axios dans certaines requetes.

---

## 1. Backend (Node.js/Express)

### Structure des dossiers
- `controllers/` : Logique métier pour chaque ressource (utilisateur, produit, commande, etc.)
- `models/` : Accès aux données (DB)
- `routes/` : Définition des endpoints API
- `middlewares/` : Middlewares Express (authentification, etc.)

### Principales routes API (Express)

#### Utilisateurs (`/api/utilisateurs`)
| Méthode | Endpoint                       | Arguments (body/params)         | Utilité                                      |
|---------|-------------------------------|---------------------------------|-----------------------------------------------|
| GET     | `/`                           | Header: Auth                    | Liste tous les utilisateurs                   |
| GET     | `/me`                         | Header: Auth                    | Infos de l'utilisateur connecté               |
| POST    | `/`                           | Header: Auth, body: user data   | Créer un utilisateur                          |
| POST    | `/register`                   | body: user data                 | Inscription d'un nouvel utilisateur           |
| DELETE  | `/:id`                        | Header: Auth, param: id         | Supprimer un utilisateur                      |
| PUT     | `/:id`                        | Header: Auth, param: id, body   | Modifier un utilisateur                       |
| GET     | `/connexion/:id`              | Header: Auth, param: id         | Vérifier le statut de connexion d'un user     |
| GET     | `/number`                     | Header: Auth                    | Nombre total d'utilisateurs                   |
| GET     | `/connexion-history/:id`      | Header: Auth, param: id         | Historique de connexion d'un utilisateur      |

**Exemple Express :**
```js
router.get('/', requireLogin, utilisateurController.getAllUtilisateurs);
router.post('/register', utilisateurController.RegisterUser);
router.delete('/:id', requireLogin, utilisateurController.deleteUtilisateur);
```

#### Produits (`/api/produits`)
| Méthode | Endpoint                       | Arguments (body/params)         | Utilité                                      |
|---------|-------------------------------|---------------------------------|-----------------------------------------------|
| GET     | `/`                           | Header: Auth                    | Liste tous les produits                       |
| GET     | `/list`                       | Header: Auth                    | Liste simplifiée des produits                 |
| POST    | `/`                           | Header: Auth, body: produit     | Ajouter un produit                            |
| POST    | `/simple/`                    | Header: Auth, body: produit     | Ajouter un produit simple                     |
| DELETE  | `/:id`                        | Header: Auth, param: id         | Supprimer un produit                          |
| PUT     | `/:id`                        | Header: Auth, param: id, body   | Modifier un produit                           |
| PUT     | `/:id/seuil`                  | param: id, body: seuil          | Définir le seuil minimum d'un produit         |
| GET     | `/:id/quantite`               | param: id                       | Quantité disponible pour un produit           |
| GET     | `/rupture`                    |                                 | Liste des produits en rupture de stock        |

**Exemple Express :**
```js
router.get('/', requireLogin, produitsController.getProduits);
router.post('/', requireLogin, produitsController.ajouterProduit);
router.put('/:id', requireLogin, produitsController.mettreAJourProduit);
```

#### Commandes (`/api/commandes`)
| Méthode | Endpoint                       | Arguments (body/params)         | Utilité                                      |
|---------|-------------------------------|---------------------------------|-----------------------------------------------|
| POST    | `/`                           | Header: Auth, body: commande    | Créer une commande                            |
| GET     | `/`                           | Header: Auth                    | Lister toutes les commandes                   |
| DELETE  | `/:id`                        | Header: Auth, param: id         | Supprimer une commande                        |
| PUT     | `/statut/:id`                 | Header: Auth, param: id, body   | Mettre à jour le statut d'une commande        |
| GET     | `/:id`                        | Header: Auth, param: id         | Détails d'une commande                        |

**Exemple Express :**
```js
router.post('/', requireLogin, commandesController.creerCommande);
router.get('/', requireLogin, commandesController.listerCommandes);
router.delete('/:id', requireLogin, commandesController.supprimerCommande);
```

#### Fournisseurs (`/api/fournisseurs`)
| Méthode | Endpoint                       | Arguments (body/params)         | Utilité                                      |
|---------|-------------------------------|---------------------------------|-----------------------------------------------|
| GET     | `/`                           | Header: Auth                    | Liste tous les fournisseurs                   |
| GET     | `/fournisseur/:id_fournisseur`| Header: Auth, param: id         | Produits d'un fournisseur                     |
| GET     | `/:id`                        | Header: Auth, param: id         | Détails d'un fournisseur                      |
| POST    | `/`                           | Header: Auth, body: fournisseur | Ajouter un fournisseur                        |
| PUT     | `/:id`                        | Header: Auth, param: id, body   | Modifier un fournisseur                       |
| DELETE  | `/:id`                        | Header: Auth, param: id         | Supprimer un fournisseur                      |

**Exemple Express :**
```js
router.get('/', requireLogin, fournisseursController.getFournisseurs);
router.post('/', requireLogin, fournisseursController.ajouterFournisseur);
router.delete('/:id', requireLogin, fournisseursController.supprimerFournisseur);
```



---

## 2. Frontend (React)

### Structure des dossiers
- `src/pages/` : Pages principales (Dashboard, Produits, Commandes, etc.)
- `src/components/` : Composants réutilisables (Sidebar, Navbar, Tableaux, etc.)
- `src/contexts/` : Contexts React (authentification, etc.)
- `src/services/` : Services pour les appels API
- `src/style/` : Fichiers CSS

### Fonctionnement général
- Utilisation de React Router pour la navigation entre pages.
- Authentification gérée via un Context (`AuthContext`).
- Les routes sont protégées par le composant `RouteProtegee` qui redirige vers `/login` si l'utilisateur n'est pas authentifié.

**Exemple de protection de route :**
```jsx
<Route path="/dashboard" element={
  <RouteProtegee>
    <Dashboard />
  </RouteProtegee>
} />
```

### Détail des pages principales

- **Dashboard** (`Dashboard.jsx`) : Vue d'ensemble avec statistiques, stocks, top produits. Utilise des composants comme `StatsCards`, `StockProduct`, `SalesData`, `TopProducts`.
- **ProductPage** (`ProductPage.jsx`) : Gestion des produits (ajout, édition, suppression, association à un fournisseur). Utilise `ProductForm`, `ProductTable`, `CreateProFornisseur`, `AssocierProductFor`.
- **Commande** (`Commande.jsx`) : Gestion des commandes (création, édition, suppression, affichage). Utilise `CreateCommande`, `CommandeList`, `CommandDetails`.
- **Stock** (`Stock.jsx`) : Visualisation du stock du magasin. Utilise `StockList`.
- **Fournisseur** (`Fournisseur.jsx`) : Gestion des fournisseurs (ajout, édition, suppression). Utilise `CreateFournisseur`, `Fournisseur` (composant).
- **UserPage** (`UserPage.jsx`) : Affichage du profil utilisateur connecté. Utilise `UserProfile`.
- **User** (`User.jsx`) : Gestion des utilisateurs (création, liste). Utilise `CreateUser`, `UtilisateurList`.
- **Analyse** (`Analyse.jsx`) : Analyses et rapports sur le stock. Utilise `StockDashboard`, `Over`.
- **Notification** (`Notification.jsx`) : Affichage des alertes de rupture ou de seuil bas de stock.
- **UserHistory** (`UserHistory.jsx`) : Affichage de l'historique des connexions d'un utilisateur.
- **Error404** (`Error404.jsx`) : Page d'erreur pour les routes non trouvées.

### Composants clés
- **Sidebar** : Menu latéral de navigation.
- **Navbar** : Barre de navigation supérieure.
- **StatsCards** : Cartes de statistiques sur le dashboard.
- **ProductForm** : Formulaire d'ajout/édition de produit.
- **ProductTable** : Tableau listant les produits.
- **CreateCommande** : Formulaire de création de commande.
- **CommandeList** : Liste des commandes existantes.
- **StockList** : Liste des stocks disponibles.
- **CreateFournisseur** : Formulaire d'ajout de fournisseur.
- **Fournisseur** : Liste des fournisseurs.
- **UserProfile** : Affichage des informations de l'utilisateur connecté.
- **CreateUser** : Formulaire de création d'utilisateur.
- **UtilisateurList** : Liste des utilisateurs.
- **StockDashboard** : Visualisation graphique des stocks.
- **Over** : Analyse avancée sur les stocks.
### Exemple d'appel API côté frontend
```js
// Exemple d'ajout de produit
await fetch("/api/produits", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(product),
});
```
