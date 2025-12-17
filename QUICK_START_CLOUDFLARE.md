# Guide de Démarrage Rapide - Cloudflare

Ce guide vous permet de déployer rapidement votre application CRM sur Cloudflare.

## Option Recommandée: Cloudflare Pages + Workers + D1

### Étape 1: Installation de Wrangler

```bash
npm install -g wrangler
# ou localement
npm install --save-dev wrangler
```

### Étape 2: Connexion à Cloudflare

```bash
wrangler login
```

Cela ouvrira votre navigateur pour vous authentifier.

### Étape 3: Créer la base de données D1

```bash
wrangler d1 create crm-agences-db
```

**Important**: Copiez le `database_id` retourné. Vous devrez le mettre dans `wrangler.toml`.

### Étape 4: Configurer wrangler.toml

Ouvrez `wrangler.toml` et remplacez `YOUR_DATABASE_ID_HERE` par le `database_id` que vous avez obtenu à l'étape 3.

### Étape 5: Créer le schéma de la base de données

```bash
npm run db:migrate
```

Cela crée la table `agencies` dans votre base de données D1.

### Étape 6: (Optionnel) Importer les données initiales

```bash
npm run db:seed
```

### Étape 7: Déployer le Worker backend

```bash
npm run deploy:worker
```

Notez l'URL retournée (ex: `https://crm-agences-api.your-subdomain.workers.dev`)

### Étape 8: Configurer l'URL de l'API pour le frontend

1. Créez un fichier `.env.local` à la racine du projet:
   ```
   VITE_API_URL=https://crm-agences-api.your-subdomain.workers.dev/api
   ```
   (Remplacez par votre URL de Worker)

2. Ou configurez la variable d'environnement dans Cloudflare Pages (voir ci-dessous)

### Étape 9: Déployer le frontend sur Cloudflare Pages

#### Via le Dashboard Cloudflare:

1. Allez sur https://dash.cloudflare.com/
2. Sélectionnez "Pages" dans le menu
3. Cliquez sur "Create a project"
4. Connectez votre repository GitHub (`carlcgb/CR-PRIM`)
5. Configuration:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

6. Dans "Environment variables", ajoutez:
   - **Variable name**: `VITE_API_URL`
   - **Value**: `https://crm-agences-api.your-subdomain.workers.dev/api`
   - (Remplacez par votre URL de Worker)

7. Cliquez sur "Save and Deploy"

#### Via Wrangler CLI (alternative):

```bash
wrangler pages project create crm-agences-frontend
wrangler pages deploy dist --project-name=crm-agences-frontend
```

### Étape 10: Tester votre application

Une fois déployé, votre application sera accessible sur:
- Frontend: `https://crm-agences-frontend.pages.dev` (ou votre domaine personnalisé)
- Backend: `https://crm-agences-api.your-subdomain.workers.dev`

## Commandes utiles

```bash
# Voir les logs du Worker
wrangler tail

# Exécuter une requête SQL sur D1
wrangler d1 execute crm-agences-db --command="SELECT * FROM agencies LIMIT 5" --remote

# Déployer le Worker
npm run deploy:worker

# Migrer la base de données
npm run db:migrate
```

## Dépannage

### Le frontend ne peut pas se connecter au backend

1. Vérifiez que `VITE_API_URL` est correctement configuré
2. Vérifiez que le Worker est déployé et accessible
3. Vérifiez les logs du Worker avec `wrangler tail`

### Erreurs de base de données

1. Vérifiez que le `database_id` dans `wrangler.toml` est correct
2. Vérifiez que les migrations ont été exécutées: `npm run db:migrate`
3. Vérifiez les données: `wrangler d1 execute crm-agences-db --command="SELECT COUNT(*) FROM agencies" --remote`

### CORS Errors

Le Worker gère déjà CORS, mais si vous avez des problèmes:
1. Vérifiez que les headers CORS sont présents dans `worker.js`
2. Vérifiez que l'origine du frontend est autorisée

## Prochaines étapes

- [ ] Ajouter un domaine personnalisé
- [ ] Configurer l'authentification (si nécessaire)
- [ ] Configurer les limites de rate limiting
- [ ] Activer les analytics Cloudflare

## Support

Pour plus de détails, consultez `CLOUDFLARE_SETUP.md`.

