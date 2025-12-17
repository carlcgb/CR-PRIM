# Guide de Configuration Cloudflare pour CRM Agences

Ce guide vous explique comment déployer votre application CRM sur Cloudflare. Il existe plusieurs approches selon vos besoins.

## Vue d'ensemble de l'application

- **Frontend**: React + Vite (port 5173 en développement)
- **Backend**: Express + SQLite (port 3001)
- **Base de données**: SQLite (fichier `agences.db`)

## Option 1: Cloudflare Pages + Workers + D1 (Recommandé pour production)

Cette option déploie le frontend sur Cloudflare Pages et convertit le backend en Cloudflare Workers avec D1 (base de données SQLite gérée par Cloudflare).

### Avantages
- ✅ Performance optimale (CDN global)
- ✅ Base de données D1 (SQLite géré par Cloudflare)
- ✅ Pas de serveur à maintenir
- ✅ Scaling automatique
- ✅ Gratuit jusqu'à 100,000 requêtes/jour

### Étapes

#### 1. Installer Wrangler CLI

```bash
npm install -g wrangler
# ou
npm install --save-dev wrangler
```

#### 2. Se connecter à Cloudflare

```bash
wrangler login
```

#### 3. Créer une base de données D1

```bash
wrangler d1 create crm-agences-db
```

Notez le `database_id` et `database_name` retournés.

#### 4. Configurer Wrangler

Créez un fichier `wrangler.toml` à la racine du projet (voir le fichier fourni).

#### 5. Migrer la base de données vers D1

```bash
# Créer le schéma SQL
wrangler d1 execute crm-agences-db --file=./migrations/schema.sql --remote

# (Optionnel) Importer les données existantes
wrangler d1 execute crm-agences-db --file=./migrations/seed.sql --remote
```

#### 6. Déployer le Worker backend

```bash
wrangler deploy
```

#### 7. Déployer le frontend sur Cloudflare Pages

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sélectionnez "Pages" dans le menu
3. Cliquez sur "Create a project"
4. Connectez votre repository GitHub
5. Configuration du build:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (racine du projet)

#### 8. Mettre à jour l'URL de l'API dans le frontend

Modifiez `src/services/api.js` pour utiliser l'URL de votre Worker au lieu de `localhost:3001`.

---

## Option 2: Cloudflare Pages + Cloudflare Tunnel (Plus simple, pour développement/test)

Cette option déploie le frontend sur Cloudflare Pages et utilise Cloudflare Tunnel pour exposer votre serveur backend local.

### Avantages
- ✅ Facile à configurer
- ✅ Pas besoin de modifier le backend
- ✅ Idéal pour le développement et les tests

### Étapes

#### 1. Installer cloudflared

Téléchargez depuis: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

#### 2. Créer un tunnel

```bash
cloudflared tunnel create crm-agences-tunnel
```

Notez le `Tunnel ID`.

#### 3. Configurer le tunnel

Créez un fichier de configuration (voir `cloudflare-tunnel-config.yml` fourni).

#### 4. Exécuter le tunnel

```bash
cloudflared tunnel run crm-agences-tunnel
```

#### 5. Déployer le frontend sur Cloudflare Pages

Suivez les étapes 7 de l'Option 1, mais mettez à jour `src/services/api.js` pour pointer vers l'URL du tunnel.

---

## Option 3: Cloudflare Pages uniquement (Frontend statique)

Si vous voulez juste déployer le frontend et garder le backend ailleurs:

### Étapes

1. Suivez les étapes de déploiement du frontend (Option 1, étape 7)
2. Mettez à jour `src/services/api.js` avec l'URL de votre backend (où qu'il soit hébergé)

---

## Configuration des variables d'environnement

### Pour Cloudflare Pages

Dans les paramètres du projet Pages:
- **Environment Variables**:
  - `VITE_API_URL`: URL de votre backend (Worker ou autre)

### Pour Cloudflare Workers

Dans `wrangler.toml`:
```toml
[vars]
API_URL = "https://your-worker.your-subdomain.workers.dev"
```

---

## Migration de la base de données vers D1

Si vous choisissez l'Option 1, vous devrez:

1. Créer les fichiers de migration SQL (voir `migrations/` fourni)
2. Exécuter les migrations:
   ```bash
   wrangler d1 execute crm-agences-db --file=./migrations/schema.sql --remote
   ```
3. (Optionnel) Importer vos données existantes

---

## URLs et domaines personnalisés

### Cloudflare Pages
- URL par défaut: `https://your-project.pages.dev`
- Vous pouvez ajouter un domaine personnalisé dans les paramètres

### Cloudflare Workers
- URL par défaut: `https://crm-agences-api.your-subdomain.workers.dev`
- Vous pouvez ajouter un domaine personnalisé dans les paramètres

---

## Support et ressources

- [Documentation Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Documentation Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Documentation D1](https://developers.cloudflare.com/d1/)
- [Documentation Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)

---

## Notes importantes

⚠️ **Sécurité**: Assurez-vous de configurer CORS correctement dans votre Worker
⚠️ **Base de données**: D1 est en lecture locale et écriture globale (latence possible)
⚠️ **Limites**: Vérifiez les limites de votre plan Cloudflare (gratuit ou payant)

