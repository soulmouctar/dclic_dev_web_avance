# AssoManager - API Backend

## Description

API REST Laravel pour la gestion d'une association conforme au cahier des charges DSF.

### Fonctionnalités implémentées (V1)

- ✅ Authentification (inscription, connexion, déconnexion)
- ✅ Gestion des utilisateurs avec rôles (ADMIN/MEMBER)
- ✅ Gestion des cotisations mensuelles
- ✅ Validation des données et contraintes métier
- ✅ Pagination et recherche
- ✅ Protection des routes par rôles

## Installation et Configuration

### Prérequis

- PHP 8.2+
- Composer
- MySQL
- Node.js + npm

### Installation

1. **Cloner le projet et installer les dépendances**
```bash
composer install
npm install
```

2. **Configuration de l'environnement**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Configuration de la base de données**
Modifier le fichier `.env` :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestionassosclic
DB_USERNAME=root
DB_PASSWORD=
```

4. **Exécuter les migrations et seeders**
```bash
php artisan migrate
php artisan db:seed --class=AdminUserSeeder
```

5. **Lancer le serveur**
```bash
php artisan serve
```

L'API sera accessible sur `http://localhost:8000`

## Compte Admin par défaut

- **Email**: admin@assomanager.com
- **Mot de passe**: admin123

## Structure de l'API

### Endpoints publics

#### Inscription (Membre)
```http
POST /api/register
Content-Type: application/json

{
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean.dupont@email.com",
    "password": "motdepasse123"
}
```

#### Connexion
```http
POST /api/login
Content-Type: application/json

{
    "email": "admin@assomanager.com",
    "password": "admin123"
}
```

### Endpoints protégés (authentification requise)

Ajouter le header d'authentification :
```http
Authorization: Bearer {token}
```

#### Déconnexion
```http
POST /api/logout
```

#### Profil utilisateur
```http
GET /api/me
```

#### Statut cotisation (Membre)
```http
GET /api/contributions/current-status
```

#### Historique cotisations
```http
GET /api/contributions?year=2026&month=1
```

### Endpoints Admin uniquement

#### Liste des membres
```http
GET /api/members?search=jean&page=1
```

#### Détails d'un membre
```http
GET /api/members/{id}
```

#### Modifier le statut d'un membre
```http
PUT /api/members/{id}
Content-Type: application/json

{
    "status": "INACTIVE"
}
```

#### Enregistrer un paiement
```http
POST /api/contributions
Content-Type: application/json

{
    "user_id": 1,
    "year": 2026,
    "month": 1,
    "amount": 5000,
    "payment_date": "2026-01-22",
    "payment_method": "CASH",
    "reference": "REF001"
}
```

#### Statistiques admin
```http
GET /api/admin/stats
```

## Modèle de données

### User
- `id` (Primary Key)
- `first_name` (string)
- `last_name` (string)
- `email` (string, unique)
- `password` (hash)
- `role` (ADMIN|MEMBER)
- `status` (ACTIVE|INACTIVE)
- `created_at`, `updated_at`

### ContributionPayment
- `id` (Primary Key)
- `user_id` (Foreign Key -> users.id)
- `year` (integer)
- `month` (integer 1-12)
- `amount` (decimal)
- `payment_date` (date)
- `payment_method` (CASH|TRANSFER|OTHER)
- `reference` (string, nullable)
- `created_at`, `updated_at`
- **Contrainte unique** : (user_id, year, month)

## Règles métier implémentées

1. **Inscription** : Seuls les membres peuvent s'inscrire (role=MEMBER par défaut)
2. **Connexion** : Vérification du statut ACTIVE
3. **Cotisations** : Un seul paiement par membre par mois/année
4. **Accès Admin** : Routes protégées par middleware
5. **Validation** : Tous les champs obligatoires et formats validés

## Codes de réponse HTTP

- `200` : Succès
- `201` : Créé avec succès
- `401` : Non authentifié
- `403` : Accès refusé (droits insuffisants)
- `422` : Erreurs de validation
- `500` : Erreur serveur

## Exemples de réponses

### Connexion réussie
```json
{
    "message": "Connexion réussie",
    "user": {
        "id": 1,
        "first_name": "Admin",
        "last_name": "AssoManager",
        "email": "admin@assomanager.com",
        "role": "ADMIN",
        "status": "ACTIVE"
    },
    "token": "1|abc123..."
}
```

### Erreur de validation
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["L'email est obligatoire."],
        "password": ["Le mot de passe doit contenir au moins 8 caractères."]
    }
}
```

### Statistiques admin
```json
{
    "total_members": 15,
    "paid_this_month": 12,
    "unpaid_this_month": 3,
    "total_amount_this_month": 60000,
    "current_month": 1,
    "current_year": 2026
}
```

## Tests manuels recommandés

1. **Inscription** → Connexion → Dashboard selon rôle
2. **Admin** : Liste membres → Détail membre → Ajouter paiement
3. **Membre** : Dashboard → Mes cotisations
4. **Validation** : Tentative doublon paiement (doit échouer)
5. **Sécurité** : Accès routes admin avec compte membre (doit échouer)

## Développement

### Lancer en mode développement
```bash
php artisan serve
```

### Réinitialiser la base de données
```bash
php artisan migrate:fresh --seed
```

### Voir les routes
```bash
php artisan route:list
```

## Architecture

- **Framework** : Laravel 12
- **Authentification** : Laravel Sanctum (tokens)
- **Base de données** : MySQL
- **Validation** : Form Requests
- **Middleware** : Protection des routes par rôles
- **Structure** : API REST avec réponses JSON

## Conformité au cahier des charges

✅ Toutes les spécifications du DSF sont implémentées :
- Modèle de données exact
- Endpoints conformes aux besoins
- Validation et sécurité
- Gestion des rôles et permissions
- Contraintes métier respectées
