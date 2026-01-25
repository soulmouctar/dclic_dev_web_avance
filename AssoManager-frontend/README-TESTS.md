# Tests Frontend - AssoManager

## 🧪 Configuration des Tests

Le projet utilise **Vitest** avec **React Testing Library** pour les tests unitaires et d'intégration.

### Outils de test installés :
- **Vitest** : Framework de test rapide basé sur Vite
- **React Testing Library** : Utilitaires pour tester les composants React
- **Jest DOM** : Matchers personnalisés pour les assertions DOM
- **jsdom** : Environnement DOM simulé pour les tests
- **@vitest/ui** : Interface graphique pour les tests
- **@vitest/coverage-v8** : Rapports de couverture de code

## 📁 Structure des Tests

```
src/test/
├── setup.ts                    # Configuration globale des tests
├── utils/
│   └── testUtils.tsx           # Utilitaires de test personnalisés
├── components/
│   └── Header.test.tsx         # Tests du composant Header
├── pages/
│   └── Dashboard.test.tsx      # Tests de la page Dashboard
└── services/
    └── memberService.test.ts   # Tests du service memberService
```

## 🚀 Commandes de Test

### Exécuter les tests
```bash
npm run test
```

### Exécuter les tests avec interface graphique
```bash
npm run test:ui
```

### Générer un rapport de couverture
```bash
npm run test:coverage
```

### Mode watch (surveillance des changements)
```bash
npm run test -- --watch
```

## 📝 Types de Tests Implémentés

### 1. Tests de Composants
- **Header.test.tsx** : Tests du composant Header
  - Rendu du logo et titre
  - Affichage conditionnel (connecté/non connecté)
  - Fonctionnalité de déconnexion
  - Menu mobile

### 2. Tests de Pages
- **Dashboard.test.tsx** : Tests de la page Dashboard Admin
  - État de chargement
  - Affichage des statistiques
  - Gestion des erreurs
  - Boutons de navigation
  - Activités récentes

### 3. Tests de Services
- **memberService.test.ts** : Tests du service API
  - Récupération des membres
  - Statistiques admin
  - Création de membres
  - Gestion des erreurs API

## 🔧 Configuration

### vite.config.ts
```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
  css: true,
}
```

### setup.ts
- Configuration de Jest DOM
- Mocks globaux (ResizeObserver, matchMedia, IntersectionObserver)
- Utilitaires Vitest

## 📊 Bonnes Pratiques

### 1. Nommage des Tests
```typescript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Test implementation
  })
})
```

### 2. Mocking des Services
```typescript
vi.mock('@/app/services/memberService', () => ({
  memberService: {
    getAdminStats: vi.fn(),
  },
}))
```

### 3. Tests d'Intégration
```typescript
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}
```

### 4. Assertions Courantes
```typescript
// Présence d'éléments
expect(screen.getByText('Dashboard')).toBeInTheDocument()

// Appels de fonctions
expect(mockFunction).toHaveBeenCalledWith(expectedArgs)

// États asynchrones
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

## 🎯 Couverture de Test

Les tests couvrent :
- ✅ Composants UI principaux
- ✅ Pages admin critiques
- ✅ Services API
- ✅ Gestion des erreurs
- ✅ États de chargement
- ✅ Interactions utilisateur

## 🚀 Installation des Dépendances

Si vous clonez le projet, installez les dépendances de test :

```bash
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest @vitest/coverage-v8 @vitest/ui jsdom vitest
```

## 📈 Prochaines Étapes

1. Ajouter des tests E2E avec Playwright
2. Tests de performance avec Lighthouse CI
3. Tests d'accessibilité avec axe-core
4. Tests visuels avec Chromatic
5. Intégration CI/CD avec GitHub Actions

## 🐛 Debugging des Tests

### Problèmes Courants
1. **Erreurs de modules** : Vérifier les imports et mocks
2. **Tests asynchrones** : Utiliser `waitFor` et `findBy*`
3. **Erreurs DOM** : Vérifier que jsdom est configuré
4. **Mocks** : S'assurer que les mocks sont correctement définis

### Debug Mode
```bash
npm run test -- --reporter=verbose
```
