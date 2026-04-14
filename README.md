# Gestion Dépenses - Application Mobile

Application mobile React Native + Expo pour la gestion des dépenses d'entreprise, connectée à une API Laravel.

## Fonctionnalités

### Employé
- Connexion et inscription
- Création de dépenses avec justificatif
- Consultation de ses dépenses
- Voir les statuts (en attente, approuvée, refusée, payée)

### Administrateur
- Vue globale de toutes les dépenses
- Approuver/refuser les dépenses
- Marquer les dépenses comme payées
- Filtres et recherche

## Structure du Projet

```
src/
  screens/           # Écrans de l'application
    LoginScreen.tsx
    RegisterScreen.tsx
    DashboardScreen.tsx
    CreateExpenseScreen.tsx
    MyExpensesScreen.tsx
    ExpenseDetailScreen.tsx
    AllExpensesScreen.tsx
    AdminExpenseDetailScreen.tsx
    ProfileScreen.tsx
  
  components/         # Composants réutilisables
  
  services/          # Services API
    api.ts           # Service de communication avec l'API Laravel
  
  navigation/        # Navigation
    AuthNavigator.tsx
    AppNavigator.tsx
  
  context/           # Contexte React
    AuthContext.tsx   # Gestion de l'authentification
  
  types/             # Types TypeScript
    index.ts         # Définition des types User, Expense, etc.
  
  hooks/             # Hooks personnalisés
```

## Installation

1. Cloner le projet
2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Démarrer l'application :
   ```bash
   npm start
   ```

## Configuration API

Modifier l'URL de l'API dans `src/services/api.ts` :

```typescript
const API_BASE_URL = 'http://votre-api-url:8000/api';
```

## Dépendances Principales

- React Native + Expo
- React Navigation (Stack, Bottom Tabs)
- Axios (pour les appels API)
- Expo Image Picker (pour l'upload d'images)
- AsyncStorage (pour le stockage local)

## Flux Utilisateur

### Employé
1. Connexion
2. Dashboard (vue d'ensemble)
3. Créer une dépense
4. Voir ses dépenses et leurs statuts

### Administrateur
1. Connexion
2. Dashboard (statistiques globales)
3. Voir toutes les dépenses
4. Approuver/refuser/marquer comme payé

## Couleurs des Statuts

- **PENDING** (En attente) : Orange (#FFA500)
- **APPROVED** (Approuvée) : Vert (#32CD32)
- **REJECTED** (Refusée) : Rouge (#FF0000)
- **PAID** (Payée) : Bleu (#007AFF)

## Tests Scénarios

1. **Login** : Connexion avec email/mot de passe
2. **Création dépense** : Formulaire avec image optionnelle
3. **Liste dépenses** : Affichage avec filtres
4. **Actions admin** : Approbation/refus/paiement
5. **Upload image** : Prise de photo ou sélection galerie

## Points d'Attention

- L'API doit être accessible et configurée
- Les permissions caméra/galerie sont nécessaires
- Le token d'authentification est stocké localement
- L'application fonctionne en ligne uniquement (V1)

## Évolutions Possibles

- Mode hors ligne
- Notifications push
- Multi-entreprise
- Export PDF
- Validation automatique
