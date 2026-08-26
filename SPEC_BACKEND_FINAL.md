# Depensys - Specifications Backend Completes

## Contexte

Ce document liste tous les endpoints, tables et formats de donnees que le backend doit fournir pour que le frontend fonctionne correctement. Le frontend est termine et fonctionne - il appelle ces endpoints. Ceux qui existent deja sont marques avec un O, ceux a creer sont marques avec un X.

---

## 1. AUTHENTIFICATION

### 1.1 POST /api/login - Connexion [EXISTE]

Request:
- email: string (required)
- password: string (required)

Response 200:
```json
{
  "success": true,
  "message": "...",
  "data": {
    "user": {
      "id": 1,
      "reference": "uuid",
      "name": "string",
      "email": "string",
      "role": "admin | employee | manager"
    },
    "token": "string"
  }
}
```

---

### 1.2 POST /api/register - Inscription [EXISTE]

Meme forme que login. Cree un compte et retourne user + token.

---

### 1.3 POST /api/logout - Deconnexion [EXISTE]

Headers: Authorization: Bearer {token}

Response 200:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.4 PUT /api/change-password - Changer son mot de passe [A CREER]

Headers: Authorization: Bearer {token}

Request:
```json
{
  "current_password": "string",
  "new_password": "string"
}
```

Validations:
- current_password: required, doit correspondre au mot de passe actuel
- new_password: required, min 6 caracteres

Response 200:
```json
{
  "success": true,
  "message": "Mot de passe modifie avec succes"
}
```

Erreurs:
- 422: current_password incorrect
- 422: new_password trop court

---

### 1.5 POST /api/forgot-password - Demande de reinitialisation [A CREER]

Request:
```json
{
  "email": "string"
}
```

Validations:
- email: required, email valide

Logique:
- Generer un token de reinitialisation (la table password_reset_tokens existe deja)
- Envoyer un email avec le lien de reinitialisation
- Toujours retourner 200 meme si l email n existe pas (securite)

Response 200:
```json
{
  "success": true,
  "message": "Un email de reinitialisation a ete envoye"
}
```

---

### 1.6 POST /api/reset-password - Reinitialiser le mot de passe [A CREER]

Request:
```json
{
  "email": "string",
  "token": "string",
  "password": "string",
  "password_confirmation": "string"
}
```

Validations:
- email: required
- token: required, doit correspondre au token stocke (non expire, max 60 min)
- password: required, min 6, confirmed

Response 200:
```json
{
  "success": true,
  "message": "Mot de passe reinitialise avec succes"
}
```

---

## 2. PROFIL UTILISATEUR

### 2.1 GET /api/profile - Recuperer son profil [EXISTE]

Response 200:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "reference": "uuid",
    "name": "string",
    "email": "string",
    "role": "admin | employee | manager",
    "created_at": "datetime",
    "updated_at": "datetime",
    "last_login_at": "datetime | null"
  }
}
```

---

### 2.2 PUT /api/profile - Modifier son profil [EXISTE]

Request:
- name: string (optionnel)
- email: email (optionnel, unique sauf soi-meme)

---

## 3. UTILISATEURS (admin)

### 3.1 GET /api/users - Liste paginee [EXISTE]

Query params: ?page=1&per_page=10

Response 200:
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "reference": "uuid",
        "name": "string",
        "email": "string",
        "role": "admin | employee | manager",
        "created_at": "datetime"
      }
    ],
    "current_page": 1,
    "last_page": 3,
    "per_page": 10,
    "total": 25
  }
}
```

Note: Le frontend supporte le role manager. L enum devrait etre admin/manager/employee.

---

### 3.2 GET /api/users/{reference} - Detail d un utilisateur [EXISTE]

Response: objet user dans data.

---

## 4. DEPENSES

### 4.1 GET /api/expenses - Liste paginee [EXISTE]

Query params: page, per_page, status, date_from, date_to, amount_min, amount_max

Response 200:
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "reference": "uuid",
        "title": "string",
        "amount": "120.50",
        "description": "string | null",
        "status": "PENDING | APPROVED | REJECTED | PAID | CANCELLED",
        "rejection_reason": "string | null",
        "payment_method": "string | null",
        "paid_at": "datetime | null",
        "expense_date": "2025-08-15",
        "proof_file_path": "string",
        "created_at": "datetime",
        "updated_at": "datetime",
        "user": {
          "id": 2,
          "reference": "uuid",
          "name": "string",
          "email": "string",
          "role": "employee"
        }
      }
    ],
    "current_page": 1,
    "last_page": 3,
    "per_page": 10,
    "total": 28
  }
}
```

---

### 4.2 POST /api/expenses - Creer une depense [EXISTE]

Request (multipart/form-data):
- title: required, string, max 255
- amount: required, numeric, min 0.01
- description: optional, string, max 1000
- expense_date: required, date, <= aujourd hui
- proof: required, file (jpeg/jpg/png/pdf, max 2Mo)
- category_id: OPTIONNEL (pour plus tard)

---

### 4.3 GET /api/expenses/{reference} - Detail [EXISTE]

Response: objet expense avec relation user chargee.

---

### 4.4 PUT /api/expenses/{reference} - Modifier [EXISTE]

Acces: Proprietaire UNIQUEMENT, statut = PENDING uniquement.

---

### 4.5 DELETE /api/expenses/{reference} - Annuler [EXISTE]

Met le statut a CANCELLED. Proprietaire si PENDING.

---

### 4.6 POST /api/expenses/{reference}/approve - Approuver [EXISTE]

Acces: admin uniquement. PENDING -> APPROVED.

---

### 4.7 POST /api/expenses/{reference}/reject - Rejeter [EXISTE]

Acces: admin uniquement. PENDING -> REJECTED.

Request:
```json
{
  "reason": "string (required, max 500)"
}
```

---

### 4.8 POST /api/expenses/{reference}/pay - Marquer paye [EXISTE]

Acces: admin uniquement. APPROVED -> PAID.

Request:
```json
{
  "payment_method": "cash | mobile_money | transfer",
  "reference": "string (optionnel)",
  "paid_at": "date (optionnel, defaut now)"
}
```

---

## 5. STATISTIQUES

### 5.1 GET /api/stats - Tableau de bord [EXISTE]

Admin Response 200:
```json
{
  "success": true,
  "data": {
    "total_expenses": 45,
    "pending_expenses": 12,
    "approved_expenses": 15,
    "rejected_expenses": 3,
    "paid_expenses": 10,
    "cancelled_expenses": 5,
    "total_amount_pending": "2400.00",
    "total_amount_approved": "3100.50",
    "total_amount_paid": "1800.00"
  }
}
```

Employee Response 200:
```json
{
  "success": true,
  "data": {
    "total_expenses": 8,
    "pending_expenses": 3,
    "approved_expenses": 2,
    "rejected_expenses": 1,
    "paid_expenses": 2,
    "cancelled_expenses": 0,
    "total_amount": "960.00",
    "total_amount_paid": "450.00"
  }
}
```
# Depensys - Specifications Backend (Partie 2)

## 6. CATEGORIES [A CREER]

Le frontend a une page Categories qui gere actuellement les donnees en localStorage. Il faut creer le CRUD complet cote backend.

### 6.1 Migration

```
categories:
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  name          VARCHAR(255) NOT NULL
  created_at    TIMESTAMP NULL
  updated_at    TIMESTAMP NULL
```

Optionnel pour plus tard (liaison depenses <-> categories):
```
ALTER TABLE expenses ADD COLUMN category_id BIGINT UNSIGNED NULL;
ALTER TABLE expenses ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
```

### 6.2 Modele Category

```php
class Category extends Model {
    protected $fillable = ['name'];

    public function expenses() {
        return $this->hasMany(Expense::class);
    }
}
```

### 6.3 Routes a ajouter dans routes/api.php

```php
Route::middleware('auth:sanctum')->group(function () {
    // ... routes existantes ...
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store'])->middleware('role:admin');
    Route::put('/categories/{id}', [CategoryController::class, 'update'])->middleware('role:admin');
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->middleware('role:admin');
});
```

### 6.4 Endpoints

#### GET /api/categories - Liste toutes les categories [A CREER]

Response 200:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Transport",
      "expenses_count": 12,
      "total_amount": "1450.00",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```

Note: expenses_count et total_amount sont optionnels mais fortement recommandes. Si le backend ne les calcule pas, le frontend affichera 0.

---

#### POST /api/categories - Creer une categorie [A CREER]

Acces: admin uniquement.

Request:
```json
{
  "name": "string (required, max 255, unique)"
}
```

Response 201:
```json
{
  "success": true,
  "data": { "id": 2, "name": "Nourriture", "created_at": "..." }
}
```

---

#### PUT /api/categories/{id} - Modifier une categorie [A CREER]

Acces: admin uniquement.

Request:
```json
{
  "name": "string (required, max 255)"
}
```

Response 200:
```json
{
  "success": true,
  "data": { "id": 1, "name": "Transport updated", "updated_at": "..." }
}
```

---

#### DELETE /api/categories/{id} - Supprimer une categorie [A CREER]

Acces: admin uniquement.

Response 200:
```json
{
  "success": true,
  "message": "Categorie supprimee"
}
```

---

## 7. NOTIFICATIONS [A CREER]

Le composant Topbar du frontend affiche des notifications avec un badge non-lues. Actuellement les donnees sont hardcodees. Il faut creer un mini-systeme de notifications.

### 7.1 Migration

```
notifications:
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  user_id       BIGINT UNSIGNED NOT NULL (FK -> users.id, CASCADE)
  type          VARCHAR(50) NOT NULL
  title         VARCHAR(255) NOT NULL
  message       TEXT NOT NULL
  data          JSON NULL
  read_at       TIMESTAMP NULL
  created_at    TIMESTAMP NULL
  updated_at    TIMESTAMP NULL
```

### 7.2 Modele Notification

```php
class Notification extends Model {
    protected $fillable = ['user_id', 'type', 'title', 'message', 'data', 'read_at'];
    protected $casts = ['data' => 'array', 'read_at' => 'datetime'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
```

### 7.3 Routes a ajouter dans routes/api.php

```php
Route::middleware('auth:sanctum')->group(function () {
    // ... routes existantes ...
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
});
```

### 7.4 Endpoints

#### GET /api/notifications - Liste les notifications de l utilisateur [A CREER]

Response 200:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "expense",
      "title": "Nouvelle depense soumise",
      "message": "Une depense de 120 EUR necessite votre validation.",
      "data": { "expense_reference": "uuid" },
      "read_at": null,
      "created_at": "2025-08-20T10:30:00Z"
    }
  ]
}
```

---

#### POST /api/notifications/{id}/read - Marquer une notification comme lue [A CREER]

Response 200:
```json
{
  "success": true,
  "message": "Notification marquee comme lue"
}
```

---

#### POST /api/notifications/read-all - Marquer toutes comme lues [A CREER]

Response 200:
```json
{
  "success": true,
  "message": "Toutes les notifications marquees comme lues"
}
```

---

### 7.5 Generation automatique des notifications [A CREER]

Le backend doit automatiquement creer des notifications lors des evenements suivants:

| Evenement | type | Destinataire | title | message |
|-----------|------|-------------|-------|---------|
| Employee cree une depense | expense | Tous les admins | Nouvelle depense soumise | Une depense de {amount} EUR necessite votre validation. |
| Admin approuve une depense | approved | Proprietaire | Depense approuvee | Votre depense {reference} a ete approuvee. |
| Admin rejette une depense | rejected | Proprietaire | Depense rejetee | Votre depense {reference} a ete rejetee. Raison: {reason} |
| Admin paie une depense | paid | Proprietaire | Depense payee | Votre depense {reference} a ete marquee comme payee. |
| Nouvel utilisateur inscrit | user | Tous les admins | Nouvel utilisateur | {name} a rejoint l organisation. |

L implementation recommandee: creer un service NotificationService et l appeler dans les controllers existants (ExpenseController, AdminExpenseController, AuthController register).

---

## 8. PARAMETRES [A CREER]

Le frontend a une page Parametres (admin) qui gere actuellement le nom de l organisation et les preferences de notification en localStorage.

### 8.1 Migration

```
settings:
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
  key_name      VARCHAR(100) NOT NULL UNIQUE
  value         TEXT NULL
  created_at    TIMESTAMP NULL
  updated_at    TIMESTAMP NULL
```

Donnees initiales (seed):
```php
['key_name' => 'organization_name', 'value' => 'Depensys'],
['key_name' => 'notifications_enabled', 'value' => 'true'],
```

### 8.2 Routes a ajouter dans routes/api.php

```php
Route::middleware('auth:sanctum')->group(function () {
    // ... routes existantes ...
    Route::get('/settings', [SettingsController::class, 'index'])->middleware('role:admin');
    Route::put('/settings', [SettingsController::class, 'update'])->middleware('role:admin');
});
```

### 8.3 Endpoints

#### GET /api/settings - Recuperer tous les parametres [A CREER]

Acces: admin uniquement.

Response 200:
```json
{
  "success": true,
  "data": {
    "organization_name": "Depensys",
    "notifications_enabled": true
  }
}
```

---

#### PUT /api/settings - Mettre a jour les parametres [A CREER]

Acces: admin uniquement.

Request:
```json
{
  "organization_name": "string",
  "notifications_enabled": true
}
```

Response 200:
```json
{
  "success": true,
  "message": "Parametres enregistres",
  "data": {
    "organization_name": "Nouveau nom",
    "notifications_enabled": false
  }
}
```

---

## 9. FORMAT DE REPONSE GENERAL

Toutes les reponses API doivent suivre cet enveloppe:

Succes:
```json
{
  "success": true,
  "message": "Description du resultat",
  "data": { "..." }
}
```

Erreur:
```json
{
  "success": false,
  "message": "Description de l erreur",
  "error": "Details techniques"
}
```

Codes HTTP:
- 200: Succes (lecture, mise a jour)
- 201: Creation reussie
- 422: Validation error / donnees invalides
- 403: Acces interdit
- 404: Ressource introuvable
- 500: Erreur serveur

---

## 10. ROUTES API COMPLETES

Voici le fichier routes/api.php cible avec toutes les routes:

```php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\AdminExpenseController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SettingsController;

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);

    // Users (admin)
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{userReference}', [UserController::class, 'show'])->middleware('uuid:userReference');
    });

    // Expenses
    Route::get('/expenses', [ExpenseController::class, 'index']);
    Route::post('/expenses', [ExpenseController::class, 'store']);
    Route::get('/expenses/{expenseReference}', [ExpenseController::class, 'show'])->middleware('uuid:expenseReference');
    Route::put('/expenses/{expenseReference}', [ExpenseController::class, 'update'])->middleware('uuid:expenseReference');
    Route::delete('/expenses/{expenseReference}', [ExpenseController::class, 'destroy'])->middleware('uuid:expenseReference');

    Route::middleware('role:admin')->prefix('expenses/{expenseReference}')->middleware('uuid:expenseReference')->group(function () {
        Route::post('/approve', [AdminExpenseController::class, 'approve']);
        Route::post('/reject', [AdminExpenseController::class, 'reject']);
        Route::post('/pay', [AdminExpenseController::class, 'pay']);
    });

    // Stats
    Route::get('/stats', [StatsController::class, 'index']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    });

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    // Settings (admin)
    Route::middleware('role:admin')->group(function () {
        Route::get('/settings', [SettingsController::class, 'index']);
        Route::put('/settings', [SettingsController::class, 'update']);
    });
});
```

---

## 11. RESUME DES NOUVEAUTES

### Tables a creer:
1. categories (id, name, timestamps)
2. notifications (id, user_id, type, title, message, data JSON, read_at, timestamps)
3. settings (id, key_name, value, timestamps)

### Controllers a creer:
1. CategoryController (index, store, update, destroy)
2. NotificationController (index, markRead, markAllRead)
3. SettingsController (index, update)

### Services a creer:
1. NotificationService (creer des notifications automatiquement)

### Modifications aux controllers existants:
1. AuthController: ajouter changePassword, forgotPassword, resetPassword + creer notification user lors register
2. ExpenseService/ExpenseController: creer notification lors store/approve/reject/pay
3. UserController: creer notification lors register

### Migration optionnelle:
1. Ajouter category_id sur la table expenses (si on veut lier categories aux depenses)

---

## 12. CHECKLIST FINALE POUR LE BACKEND

- [ ] Creer migration categories + model + controller + routes
- [ ] Creer migration notifications + model + controller + routes
- [ ] Creer migration settings + model + controller + routes + seed
- [ ] Ajouter changePassword au AuthController
- [ ] Ajouter forgotPassword au AuthController (utiliser password_reset_tokens)
- [ ] Ajouter resetPassword au AuthController
- [ ] Ajouter generation automatique de notifications dans ExpenseController (store) et AdminExpenseController (approve/reject/pay)
- [ ] Ajouter generation de notification dans AuthController (register)
- [ ] Ajouter le role manager a l enum de la migration users (admin/manager/employee)
- [ ] Modifier la route GET /stats pour inclure les montants manquants si necessaire
- [ ] Tester tous les endpoints avec le frontend
