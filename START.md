# Guide de démarrage rapide

## Problème : Erreur lors de l'ajout de note

Si vous voyez l'erreur "Erreur lors de l'ajout de la note", c'est probablement parce que le serveur backend n'est pas démarré.

## Solution : Démarrer le serveur backend

### Option 1 : Démarrer les deux en même temps (recommandé)

```bash
cd crm-agences
npm run dev:all
```

Cette commande démarre automatiquement :
- Le serveur backend sur http://localhost:3001
- Le frontend sur http://localhost:5173

### Option 2 : Démarrer séparément

**Terminal 1 - Backend :**
```bash
cd crm-agences
npm run dev:server
```

Vous devriez voir :
```
Serveur API démarré sur http://localhost:3001
Base de données SQLite connectée
```

**Terminal 2 - Frontend :**
```bash
cd crm-agences
npm run dev
```

## Vérifier que le serveur fonctionne

Ouvrez votre navigateur et allez sur : http://localhost:3001/api/agencies

Vous devriez voir une liste JSON des agences. Si vous voyez une erreur, le serveur n'est pas démarré correctement.

## Ports utilisés

- **Backend API** : Port 3001
- **Frontend** : Port 5173 (ou 5174 si 5173 est occupé)

Si ces ports sont déjà utilisés, vous devrez modifier les configurations.

