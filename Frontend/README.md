# Système de Gestion d'Inventaire

Un système complet de gestion d'inventaire avec interface utilisateur moderne, développé avec React et Vite. Ce projet permet de suivre les stocks, gérer les produits, visualiser les tendances et effectuer des transactions (entrées/sorties).

![Logo du Projet](/public/clipboard-logo.svg)

# 📋 Table des matières

- [Technologies Utilisées](#technologies-utilisées)
- [Structure du Projet](#structure-du-projet)
- [Pages et Fonctionnalités](#pages-et-fonctionnalités)
- [Installation et Démarrage](#installation-et-démarrage)
- [Données et Stockage](#données-et-stockage)
- [Fonctionnalités à Venir](#fonctionnalités-à-venir)

# 🚀 Technologies Utilisées

# Langages et Frameworks
- **React 18** - Bibliothèque UI pour la construction d'interfaces
- **JavaScript (ES6+)** - Langage de programmation principal
- **Vite** - Outil de build et serveur de développement
- **Tailwind CSS** - Framework CSS utilitaire pour le design

# Bibliothèques principales
- **React Router Dom (v6)** - Gestion des routes et de la navigation
- **React Icons** - Collection d'icônes populaires
- **Chart.js / React-Chartjs-2** - Création de graphiques interactifs

### Outils de Développement
- **Bun** - Gestionnaire de paquets et exécuteur JavaScript
- **ESLint** - Outil d'analyse statique du code
- **Git** - Gestion de versions

## 📁 Structure du Projet

```
inventory-management-system/
├── public/                    # Ressources statiques
│   └── clipboard-logo.svg     # Logo de l'application
├── src/                       # Code source
│   ├── components/            # Composants réutilisables
│   │   └── Layout.jsx         # Mise en page principale avec barre latérale
│   ├── pages/                 # Pages de l'application
│   │   ├── Login.jsx          # Page de connexion
│   │   ├── Register.jsx       # Page d'inscription
│   │   ├── Dashboard.jsx      # Tableau de bord principal
│   │   ├── Inventory.jsx      # Liste des produits en inventaire
│   │   ├── ItemDetail.jsx     # Détails d'un produit spécifique
│   │   ├── AddItem.jsx        # Formulaire d'ajout de produit
│   │   └── NotFound.jsx       # Page 404 non trouvée
│   ├── App.jsx                # Configuration des routes
│   ├── main.jsx               # Point d'entrée de l'application
│   └── index.css              # Styles globaux et configuration Tailwind
├── package.json               # Dépendances et scripts
├── postcss.config.js          # Configuration de PostCSS pour Tailwind
├── tailwind.config.js         # Configuration de Tailwind CSS
└── vite.config.js             # Configuration de Vite
```

## 📱 Pages et Fonctionnalités

### Page de Connexion (`Login.jsx`)
- **Fonction**: Authentification des utilisateurs pour accéder au système
- **Fonctionnalités**:
  - Formulaire de connexion par email/mot de passe
  - Option "Se souvenir de moi"
  - Lien vers la page d'inscription
  - Lien "Mot de passe oublié"
- **Note**: Pour cette démo, l'authentification est simulée (pas de vérification réelle)

### Page d'Inscription (`Register.jsx`)
- **Fonction**: Création de nouveaux comptes utilisateurs
- **Fonctionnalités**:
  - Formulaire d'inscription avec informations personnelles
  - Téléchargement de photo de profil
  - Acceptation des conditions d'utilisation
  - Redirection vers la page de connexion

### Tableau de Bord (`Dashboard.jsx`)
- **Fonction**: Vue d'ensemble des statistiques et métriques clés de l'inventaire
- **Fonctionnalités**:
  - Cartes de résumé (total d'articles, articles à faible stock, commandes récentes, valeur totale)
  - Graphique linéaire des tendances de valeur d'inventaire
  - Graphique en anneau de la répartition par catégorie
  - Graphique à barres des transactions hebdomadaires
  - Liste des activités récentes

### Liste d'Inventaire (`Inventory.jsx`)
- **Fonction**: Affichage et gestion de tous les produits en stock
- **Fonctionnalités**:
  - Tableau d'inventaire avec tri des colonnes
  - Recherche de produits
  - Filtrage par catégorie
  - Actions rapides (voir, modifier, supprimer)
  - Mise en évidence des produits à faible stock
  - Bouton d'ajout de nouveau produit

### Détails du Produit (`ItemDetail.jsx`)
- **Fonction**: Affichage détaillé d'un produit spécifique
- **Fonctionnalités**:
  - Informations complètes sur le produit
  - Image du produit
  - Historique des transactions du stock
  - Boutons d'action (entrée de stock, sortie de stock, modification)
  - Navigation vers la liste d'inventaire

### Ajout de Produit (`AddItem.jsx`)
- **Fonction**: Formulaire pour ajouter de nouveaux produits à l'inventaire
- **Fonctionnalités**:
  - Saisie des informations de base (nom, SKU, catégorie, prix)
  - Saisie des informations d'inventaire (stock, niveau minimum, emplacement)
  - Validation des champs
  - Téléchargement d'image de produit

### Page 404 (`NotFound.jsx`)
- **Fonction**: Gestion des routes non trouvées
- **Fonctionnalités**:
  - Message d'erreur convivial
  - Liens de navigation vers les pages principales

## 🔧 Installation et Démarrage

```bash
# Cloner le dépôt
git clone https://github.com/votre-compte/inventory-management-system.git

# Naviguer dans le répertoire
cd inventory-management-system

# Installer les dépendances
bun install

# Démarrer le serveur de développement
bun run dev

# Construire pour la production
bun run build
```

## 💾 Données et Stockage

Dans la version actuelle, le système utilise des **données factices** générées dans les composants. Il n'y a pas de base de données réelle connectée au projet. Les actions comme l'ajout, la modification ou la suppression de produits ne sont que simulées.

Pour une implémentation en production, il serait recommandé d'intégrer:
- Une **base de données** (MongoDB, PostgreSQL, etc.)
- Une **API backend** (Node.js avec Express, ou un service similaire)
- Un **système d'authentification** réel (JWT, OAuth, etc.)

## 🔮 Fonctionnalités à Venir

- **Mode sombre** - Thème visuel alternatif pour l'interface
- **Stockage local** - Persistance des données entre les sessions via localStorage
- **Gestion des catégories** - Page d'administration des catégories de produits
- **Profil utilisateur** - Page de gestion des paramètres du compte
- **Export de données** - Génération de rapports CSV/PDF
- **Gestion des fournisseurs** - Ajout et suivi des fournisseurs
- **Notifications** - Alertes pour les stocks faibles et autres événements importants

---

Développé avec ❤️ par mercleo
