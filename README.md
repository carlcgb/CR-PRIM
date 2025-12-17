# CRM - Agences de Placement

Application CRM moderne pour gérer vos leads d'agences de placement, créée avec Vite, React et Node.js/Express avec base de données SQLite.

## Fonctionnalités

- ✅ **Gestion des leads** : Ajouter, modifier, supprimer des agences
- ✅ **Base de données réelle** : SQLite pour la persistance des données
- ✅ **Recherche et filtres** : Recherche par nom, description, secteur et filtrage par statut
- ✅ **Statuts CRM** : Nouveau, Contacté, En négociation, Accord verbal, Gagné, Perdu
- ✅ **Dashboard** : Vue d'ensemble avec filtres (Toutes, Actives, En attente, Accord verbal)
- ✅ **Notes** : Ajoutez des notes personnalisées à chaque agence
- ✅ **Informations de contact** : Email, téléphone, personne contact
- ✅ **Envoi d'email** : Bouton pour ouvrir votre client email avec le destinataire pré-rempli
- ✅ **Statistiques** : Vue d'ensemble des leads par statut
- ✅ **Interface moderne** : Design responsive et intuitif

## Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

## Installation

```bash
# Installer les dépendances
npm install
```

## Démarrage

### Option 1 : Démarrer le serveur et le frontend séparément

```bash
# Terminal 1 - Démarrer le serveur backend (port 3001)
npm run dev:server

# Terminal 2 - Démarrer le frontend (port 5173)
npm run dev
```

### Option 2 : Démarrer les deux en même temps (recommandé)

```bash
npm run dev:all
```

L'application sera accessible sur `http://localhost:5173`

## Structure du projet

```
crm-agences/
├── server.js              # Serveur Express avec API REST
├── agences.db             # Base de données SQLite (créée automatiquement)
├── src/
│   ├── components/        # Composants React
│   │   ├── AgencyCard.jsx      # Carte d'affichage d'une agence
│   │   ├── AgencyDetail.jsx    # Vue détaillée d'une agence
│   │   ├── AgencyForm.jsx      # Formulaire d'ajout/modification
│   │   ├── Dashboard.jsx       # Dashboard avec vues filtrées
│   │   └── SearchAndFilters.jsx # Barre de recherche et filtres
│   ├── data/              # Données initiales
│   │   └── initialData.js # Liste des agences et options
│   ├── hooks/             # Hooks personnalisés
│   │   └── useLocalStorage.js # Hook pour le stockage local (déprécié)
│   ├── services/          # Services API
│   │   └── api.js         # Client API pour communiquer avec le backend
│   ├── utils/             # Utilitaires
│   │   └── parseHTML.js   # Parser pour extraire les données du HTML
│   ├── App.jsx            # Composant principal
│   └── App.css            # Styles principaux
├── public/                # Fichiers statiques
└── package.json
```

## API Endpoints

Le serveur backend expose les endpoints suivants :

- `GET /api/agencies` - Récupérer toutes les agences
- `GET /api/agencies/:id` - Récupérer une agence par ID
- `POST /api/agencies` - Créer une nouvelle agence
- `PUT /api/agencies/:id` - Mettre à jour une agence
- `DELETE /api/agencies/:id` - Supprimer une agence
- `GET /api/stats` - Récupérer les statistiques

## Utilisation

### Ajouter une agence

1. Cliquez sur le bouton "+ Nouvelle agence"
2. Remplissez le formulaire (nom et URL sont obligatoires)
3. Ajoutez des informations de contact (email, téléphone, personne contact)
4. Cliquez sur "Créer"

### Voir les détails

- Cliquez sur une carte d'agence pour voir les détails complets

### Modifier

- Cliquez sur "Modifier" dans la carte ou la vue détaillée
- Modifiez les informations et cliquez sur "Enregistrer"

### Rechercher et filtrer

- Utilisez la barre de recherche en haut pour rechercher par nom, description ou secteur
- Utilisez les menus déroulants pour filtrer par statut ou secteur

### Dashboard

- Cliquez sur l'onglet "Dashboard" pour voir une vue d'ensemble
- Utilisez les boutons pour filtrer : Toutes, Actives, En attente, Accord verbal
- Les statistiques sont affichées en haut

### Envoyer un email

- Si une agence a un email enregistré, un bouton "📧 Email" apparaît
- Cliquez dessus pour ouvrir votre client email avec le destinataire, sujet et corps pré-remplis

## Base de données

La base de données SQLite (`agences.db`) est créée automatiquement au premier démarrage du serveur. Elle contient une table `agencies` avec les champs suivants :

- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `url` (TEXT)
- `description` (TEXT)
- `sector` (TEXT)
- `status` (TEXT)
- `notes` (TEXT)
- `email` (TEXT)
- `phone` (TEXT)
- `contact_person` (TEXT)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

## Build pour production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`.

## Technologies utilisées

- **Frontend** : React 19, Vite
- **Backend** : Node.js, Express
- **Base de données** : SQLite3
- **Styling** : CSS3 avec design moderne et responsive

## Notes importantes

- Le serveur backend doit être démarré pour que l'application fonctionne
- La base de données est créée automatiquement au premier démarrage
- Les données sont persistées dans le fichier `agences.db`
- Le fichier `.gitignore` exclut la base de données du contrôle de version

## Support

Pour toute question ou problème, vérifiez que :
1. Le serveur backend est démarré (port 3001)
2. Le frontend est démarré (port 5173)
3. Les ports ne sont pas utilisés par d'autres applications
