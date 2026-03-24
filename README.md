# Claude Subscription Clone

Clone de la page d'abonnement de [claude.ai](https://claude.ai) avec un système de paiement Stripe fonctionnel. Deux plans (Pro et Max), facturation mensuelle ou annuelle, upgrade, annulation, et gestion complète via webhooks.

## Stack technique

- **Next.js 16** + React 19 (App Router)
- **Stripe** (abonnements, checkout, webhooks, portail client)
- **Prisma 6** + PostgreSQL (base de données)
- **Tailwind CSS v4** (styling)

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose
- [Stripe CLI](https://docs.stripe.com/stripe-cli) (pour les webhooks en local)
- Un [compte Stripe](https://dashboard.stripe.com/register) (gratuit)

---

## Installation pas-à-pas

### 1. Cloner le projet et installer les dépendances

```bash
git clone https://github.com/ethan-frot/Claude-Pricing-Clone
cd Claude-Pricing-Clone
npm install
```

### 2. Lancer la base de données

```bash
docker compose up -d
```

Cela démarre :

- **PostgreSQL** sur `localhost:5432`
- **Adminer** (interface web pour visualiser la BDD) sur [http://localhost:8080](http://localhost:8080)

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Ouvre le fichier `.env` et remplis les valeurs en suivant les étapes ci-dessous.

---

## Configuration Stripe (mode Test)

Toute la configuration se fait dans le [Dashboard Stripe](https://dashboard.stripe.com). Assure-toi d'être en **mode Test** (toggle en haut à droite du dashboard).

### Étape A — Récupérer la clé API secrète

1. Va dans **Developers** (menu de gauche) > **API keys**
2. Copie la **Secret key** (commence par `sk_test_`)
3. Colle-la dans `.env` :
   ```
   STRIPE_SECRET_KEY=sk_test_ta_cle_ici
   ```

### Étape B — Créer le produit "Pro"

1. Va dans **Product catalog** > **+ Add product**
2. Remplis :
   - **Name** : `Pro`
   - **Description** : `Research, code, and organize`
3. Ajoute **2 prix** :
   - **Prix 1** : `18.00 EUR` — Recurring — `Monthly`
   - **Prix 2** : `180.00 EUR` — Recurring — `Yearly`
4. Clique sur **Add product**
5. Ouvre le produit créé, clique sur chaque prix pour voir son **Price ID** (commence par `price_` en haut à droite)
6. Copie-les dans `.env` :
   ```
   STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
   STRIPE_PRO_YEARLY_PRICE_ID=price_xxx
   ```

### Étape C — Créer le produit "Max"

1. Va dans **Product catalog** > **+ Add product**
2. Remplis :
   - **Name** : `Max`
   - **Description** : `Higher limits, priority access`
3. Ajoute **2 prix** :
   - **Prix 1** : `90.00 EUR` — Recurring — `Monthly`
   - **Prix 2** : `900.00 EUR` — Recurring — `Yearly`
4. Clique sur **Add product**
5. Récupère les Price IDs comme à l'étape B :
   ```
   STRIPE_MAX_MONTHLY_PRICE_ID=price_xxx
   STRIPE_MAX_YEARLY_PRICE_ID=price_xxx
   ```

### Étape D — Configurer le webhook (Stripe CLI)

1. Installe la [Stripe CLI](https://docs.stripe.com/stripe-cli) si ce n'est pas déjà fait
2. Connecte-toi :
   ```bash
   stripe login
   ```
3. Lance le listener de webhooks :
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. La commande affiche un **webhook signing secret** (commence par `whsec_`). Copie-le dans `.env` :
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

> **Important** : Le listener doit tourner dans un terminal séparé pendant tout le développement. Sans lui, Stripe ne peut pas notifier l'app des paiements et changements d'abonnement.

---

## Lancer le projet

### 4. Appliquer le schéma à la base de données

```bash
npx prisma migrate dev --name init
```

> Si Prisma demande de reset la base, accepte (c'est normal au premier lancement).

### 5. Lancer le serveur

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

---

## Tester le parcours complet

L'app utilise un utilisateur unique défini dans le `.env` (`USER_EMAIL` et `USER_NAME`). Pas besoin de créer de compte.

### Souscription

1. Va sur [http://localhost:3000](http://localhost:3000) — tu arrives directement sur la page pricing
2. Choisis **Monthly** ou **Yearly** avec le toggle (en haut à droite de la carte Pro)
3. Clique sur **Subscribe to Pro** (ou Max)
4. Utilise la carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Expiration : n'importe quelle date future (ex: `01/60`)
   - CVC : n'importe quels 3 chiffres (ex: `042`)
   - Cardholder name : n'importe quoi (ex: `Demo`)
   - Country or region : `France`
5. Après le paiement, tu es redirigé vers une page de confirmation

### Upgrade Pro → Max

1. Depuis le dashboard, clique sur **Upgrade to Max**
2. Ou depuis la page pricing, clique sur **Upgrade to Max**
3. L'upgrade est immédiat avec prorata (Stripe calcule la différence)

### Annulation

1. Depuis le dashboard, clique sur **Cancel subscription**
2. Confirme l'annulation
3. L'accès est maintenu jusqu'à la fin de la période payée
4. Le statut passe à "Your subscription will be canceled at the end of the current period"

### Gestion de la facturation

- Le bouton **Manage billing** ouvre le portail Stripe (changer de carte, voir les factures, etc.)

---

## Structure du projet

```
├── prisma/
│   └── schema.prisma              # Schéma de la base de données
├── src/
│   ├── app/
│   │   ├── api/stripe/
│   │   │   ├── checkout/          # Création de session de paiement
│   │   │   ├── cancel/            # Annulation d'abonnement
│   │   │   ├── upgrade/           # Upgrade de plan (Pro → Max)
│   │   │   ├── portal/            # Portail de facturation Stripe
│   │   │   └── webhook/           # Réception des événements Stripe
│   │   ├── dashboard/             # Dashboard utilisateur
│   │   │   ├── page.tsx           # Page principale + statut abo
│   │   │   └── subscription-status.tsx
│   │   ├── pricing/               # Page de tarification (clone Claude)
│   │   │   ├── page.tsx           # Server component
│   │   │   └── pricing-content.tsx # Client component (UI)
│   │   ├── layout.tsx             # Layout racine
│   │   ├── page.tsx               # Redirect → /pricing
│   │   └── globals.css
│   └── lib/
│       ├── db.ts                  # Client Prisma (singleton)
│       ├── plans.ts               # Configuration des plans
│       ├── stripe.ts              # Instance Stripe
│       └── user.ts                # Utilisateur unique (depuis .env)
├── docker-compose.yml             # PostgreSQL + Adminer
├── .env.example                   # Template des variables d'environnement
└── package.json
```

## Commandes utiles

| Commande                                                       | Description                    |
| -------------------------------------------------------------- | ------------------------------ |
| `docker compose up -d`                                         | Démarrer PostgreSQL + Adminer  |
| `docker compose down`                                          | Arrêter les conteneurs         |
| `stripe listen --forward-to localhost:3000/api/stripe/webhook` | Écouter les webhooks Stripe    |
| `npx prisma migrate dev`                                       | Appliquer les migrations       |
| `npx prisma generate`                                          | Régénérer le client Prisma     |
| `npx prisma studio`                                            | Interface visuelle pour la BDD |
| `npm run dev`                                                  | Serveur de développement       |
| `npm run build`                                                | Build de production            |
