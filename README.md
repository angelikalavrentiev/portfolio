# Portfolio

Portfolio personnel avec backend Symfony et frontend React (interface publique et admin).

## Prérequis

- PHP ≥ 8.1
- Composer
- Node.js ≥ 18
- MySQL/MariaDB
- Symfony CLI

## Installation

### 1. Backend (Symfony)

```bash
cd portfolio-backend
composer install
```

Configurez la base de données dans `.env` :
```
DATABASE_URL="mysql://user:password@127.0.0.1:3306/portfolio"
```

Créez la base de données et appliquez les migrations :
```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

Lancez le serveur Symfony :
```bash
symfony serve
```

Le backend sera disponible sur `http://localhost:8000`

### 2. Frontend Public

```bash
cd portfolio-frontend-public
npm install
npm start
```

Le site public sera disponible sur `http://localhost:3000`

### 3. Frontend Admin

```bash
cd portfolio-frontend-admin
npm install
npm start
```

L'interface admin sera disponible sur `http://localhost:3001`

## Structure du projet

```
Portfolio/
├── portfolio-backend/          # API Symfony
│   ├── src/
│   │   ├── Controller/        # Controllers API
│   │   ├── Entity/            # Entités Doctrine
│   │   └── Repository/        # Repositories
│   └── public/
│       ├── img_projects/      # Images des projets
│       └── uploads/           # CV et photos
│
├── portfolio-frontend-public/  # Site public React
│   └── src/
│       ├── components/        # Composants React
│       ├── pages/             # Pages (Galaxy, About, Contact)
│       └── layout/            # Layout (Navbar, Footer)
│
└── portfolio-frontend-admin/   # Interface admin React
    └── src/
        └── components/        # Gestion projets, compétences, images
```

## Fonctionnalités

### Site Public
- **Galaxy** : Visualisation 3D des projets avec Three.js
- **About** : Présentation et CV
- **Contact** : Formulaire de contact
- Affichage des projets avec images, compétences et lien GitHub

### Interface Admin
- Gestion des projets (CRUD)
- Gestion des compétences
- Gestion des images
- Upload de CV et photo de profil
- Modification du profil

## API Endpoints

### Projets
- `GET /api/projects` - Liste des projets
- `GET /api/projects/{id}` - Détail d'un projet
- `POST /api/projects` - Créer un projet (admin)
- `PUT /api/projects/{id}` - Modifier un projet (admin)
- `DELETE /api/projects/{id}` - Supprimer un projet (admin)

### Profil
- `GET /api/profil` - Récupérer le profil
- `POST /api/profil` - Modifier le profil (admin)

### CV
- `GET /api/admin/view-cv` - Prévisualiser le CV
- `GET /api/admin/download-cv` - Télécharger le CV

### Compétences
- `GET /api/competences` - Liste des compétences
- `POST /api/competences` - Créer une compétence (admin)
- `PUT /api/competences/{id}` - Modifier une compétence (admin)
- `DELETE /api/competences/{id}` - Supprimer une compétence (admin)

## Technologies

**Backend :**
- Symfony 7
- Doctrine ORM
- API Platform

**Frontend :**
- React 18
- Three.js (visualisation 3D)
- React Router
- Fetch API

**Base de données :**
- MySQL/MariaDB
