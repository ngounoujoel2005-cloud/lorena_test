# Lorena : architecture technique (React + Next.js + PostgreSQL)

Ce guide complète `lorena-schema.sql` et le cahier des charges v1.1. Il suppose un **monorepo pnpm** avec trois paquets : le front React, l'API Next.js et un paquet partagé pour les schémas de validation.

> **Note sur le cahier des charges** : sa section 8 (pile technologique) prévoit Laravel pour le back. Si vous partez sur Next.js, mettez cette section à jour (je peux le faire).

---

## 1. Principe

| Élément | Choix | Raison |
|---|---|---|
| Front | React 18 + Vite + TypeScript | Application mobile-first installable (PWA), rapide sur 4G |
| Back | Next.js 15 (App Router) utilisé **comme API seulement** (`route.ts`) | Une seule techno (TypeScript) du front au back |
| Base | PostgreSQL 16 | Transactions, contraintes, index partiels (anti-survente, anti double encaissement) |
| Accès base | Prisma (ou SQL direct) | Typage ; le schéma SQL fourni reste la source de vérité |
| Tâches de fond | BullMQ + Redis, processus Node séparé | Expiration des réservations, SMS, rapprochement quotidien |
| Recherche | Meilisearch | Tolérance aux fautes, rapide, simple à héberger |
| Fichiers | Stockage compatible S3 + `sharp` | Photos produits en WebP, factures PDF |

Deux règles à ne jamais casser : **tous les prix sont recalculés côté serveur** (CMD-02) et **un paiement n'est validé que par la notification signée du prestataire** (PAY-06).

---

## 2. Dépendances à installer

### Racine du monorepo
```bash
mkdir lorena && cd lorena
corepack enable && pnpm init
# pnpm-workspace.yaml : packages: ["apps/*", "packages/*"]
pnpm add -Dw typescript prettier eslint husky lint-staged
```

### Paquet partagé `packages/shared`
```bash
pnpm --filter @lorena/shared add zod
```

### API : `apps/api` (Next.js)
```bash
pnpm create next-app@latest apps/api --ts --app --no-tailwind --src-dir --eslint

# Données et sécurité
pnpm --filter api add @prisma/client zod jose argon2 otplib libphonenumber-js rate-limiter-flexible
# Redis, tâches, journaux
pnpm --filter api add ioredis bullmq pino
# Fichiers, recherche, notifications, factures
pnpm --filter api add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner sharp meilisearch nodemailer pdfkit
# Utilitaires
pnpm --filter api add slugify date-fns nanoid

# Développement
pnpm --filter api add -D prisma tsx vitest @types/node @types/nodemailer @types/pdfkit
```

| Paquet | Rôle |
|---|---|
| `jose` | Jetons JWT d'accès et de rafraîchissement |
| `argon2` | Hachage des mots de passe et des codes à usage unique |
| `otplib` | Second facteur des administrateurs (BO-01) |
| `libphonenumber-js` | Normalisation des numéros camerounais (+237) |
| `rate-limiter-flexible` | Limitation de fréquence (NFR-09, FRD-04) |
| `bullmq` + `ioredis` | Files de tâches et verrous |
| `sharp` | Conversion et redimensionnement des images |
| `pdfkit` | Génération des factures |

### Front : `apps/web` (React + Vite)
```bash
pnpm create vite apps/web --template react-ts

# Cœur
pnpm --filter web add react-router-dom @tanstack/react-query zustand ky
# Formulaires et validation
pnpm --filter web add react-hook-form @hookform/resolvers zod
# Interface
pnpm --filter web add tailwindcss @tailwindcss/vite lucide-react clsx recharts
# Internationalisation (français puis anglais, P1)
pnpm --filter web add i18next react-i18next
# PWA
pnpm --filter web add -D vite-plugin-pwa
# Tests
pnpm --filter web add -D vitest @testing-library/react @testing-library/jest-dom playwright
```

### Outils locaux (Docker)
`docker-compose.yml` avec : `postgres:16`, `redis:7`, `getmeili/meilisearch`, `minio/minio` (S3 de développement).

---

## 3. Structure du projet

```
lorena/
├─ package.json
├─ pnpm-workspace.yaml
├─ docker-compose.yml
├─ .env.example
├─ .gitignore
├─ README.md
│
├─ packages/
│  └─ shared/
│     ├─ package.json
│     └─ src/
│        ├─ index.ts
│        ├─ constants.ts            # statuts, rôles, seuils de risque, devise XAF
│        ├─ schemas/                # schémas zod partagés front et back
│        │  ├─ auth.ts
│        │  ├─ catalog.ts
│        │  ├─ checkout.ts
│        │  ├─ payment.ts
│        │  ├─ returns.ts
│        │  └─ admin.ts
│        └─ types.ts
│
├─ apps/
│  ├─ api/                          # Next.js (API seulement)
│  │  ├─ package.json
│  │  ├─ next.config.ts             # CORS, en-têtes de sécurité
│  │  ├─ tsconfig.json
│  │  ├─ prisma/
│  │  │  ├─ schema.prisma           # généré avec `prisma db pull` depuis lorena-schema.sql
│  │  │  ├─ migrations/             # 0001_init.sql = lorena-schema.sql
│  │  │  └─ seed.ts                 # catégories, zones, modèles de messages, compte admin
│  │  └─ src/
│  │     ├─ middleware.ts           # CORS, limitation de fréquence globale
│  │     ├─ app/api/                # routes HTTP (voir section 4)
│  │     ├─ modules/                # logique métier, un dossier par module du cahier des charges
│  │     │  ├─ auth/
│  │     │  ├─ catalog/
│  │     │  ├─ cart/
│  │     │  ├─ orders/
│  │     │  ├─ payments/
│  │     │  │  └─ providers/
│  │     │  │     ├─ mtn.ts
│  │     │  │     ├─ orange.ts
│  │     │  │     └─ index.ts
│  │     │  ├─ stock/
│  │     │  ├─ shipping/
│  │     │  ├─ returns/
│  │     │  ├─ support/
│  │     │  ├─ fraud/
│  │     │  ├─ notifications/
│  │     │  ├─ analytics/
│  │     │  └─ admin/
│  │     ├─ lib/
│  │     │  ├─ db.ts               # client Prisma + helper de transaction
│  │     │  ├─ redis.ts
│  │     │  ├─ env.ts              # validation des variables d'environnement (zod)
│  │     │  ├─ logger.ts
│  │     │  ├─ errors.ts           # AppError, codes d'erreur
│  │     │  ├─ http.ts             # enveloppe de route : validation, erreurs, journaux
│  │     │  ├─ auth-guard.ts       # lecture du jeton + contrôle des rôles (côté serveur)
│  │     │  ├─ rate-limit.ts
│  │     │  ├─ storage.ts          # S3
│  │     │  ├─ search.ts           # Meilisearch
│  │     │  ├─ pdf.ts              # factures
│  │     │  ├─ phone.ts            # normalisation E.164
│  │     │  └─ audit.ts            # écriture dans audit_log
│  │     ├─ jobs/                  # processus séparé : `pnpm --filter api worker`
│  │     │  ├─ worker.ts
│  │     │  ├─ expire-reservations.ts
│  │     │  ├─ send-notification.ts
│  │     │  ├─ reconcile-payments.ts
│  │     │  ├─ refresh-zone-stats.ts
│  │     │  └─ sync-search-index.ts
│  │     └─ tests/                  # TST-01 à TST-25 automatisables
│  │
│  └─ web/                          # React + Vite
│     ├─ package.json
│     ├─ index.html
│     ├─ vite.config.ts             # proxy /api, PWA
│     ├─ public/                    # icônes, manifest
│     └─ src/
│        ├─ main.tsx
│        ├─ App.tsx
│        ├─ routes.tsx
│        ├─ api/
│        │  ├─ client.ts           # ky + rafraîchissement du jeton
│        │  └─ hooks/              # useProducts, useCart, useOrders, ...
│        ├─ store/
│        │  ├─ cart.ts             # zustand
│        │  └─ auth.ts
│        ├─ components/
│        │  ├─ ui/                 # Button, Input, Modal, Badge, Toast, Skeleton
│        │  ├─ layout/             # Header, Footer, MobileNav, AdminLayout
│        │  ├─ catalog/            # ProductCard, ProductGallery, Filters, SearchBar
│        │  ├─ cart/               # CartLine, CartSummary
│        │  ├─ checkout/           # AddressForm, DeliveryChoice, PaymentChoice, MomoPending
│        │  ├─ account/            # OrderList, ReturnForm, AddressBook
│        │  └─ admin/              # DataTable, StatCard, OrderStatusStepper
│        ├─ pages/
│        │  ├─ public/             # Home, Category, Product, Search, Cart, Checkout,
│        │  │                      #   OrderConfirmation, Tracking, Login, Register, Help, Legal
│        │  ├─ account/            # Profile, Orders, OrderDetail, Returns, Addresses
│        │  └─ admin/              # Dashboard, Products, Inventory, Orders, Shipments,
│        │                         #   Returns, Tickets, Zones, Settings, Audit, Watchlist
│        ├─ hooks/                 # useDebounce, useMediaQuery
│        ├─ lib/                   # format.ts (XAF), phone.ts, analytics.ts (consentement)
│        ├─ i18n/                  # fr.json, en.json
│        └─ styles/index.css       # variables : jaune #FFD700, noir, texte noir sur jaune
```

---

## 4. Routes de l'API (`apps/api/src/app/api/`)

| Dossier | Fichiers `route.ts` | Exigences |
|---|---|---|
| `auth/` | `register`, `login`, `refresh`, `logout`, `otp/request`, `otp/verify`, `password/reset` | CLI-01 à 03, BO-01 |
| `catalog/` | `products`, `products/[slug]`, `categories`, `search`, `suggestions` | CAT-01 à 12 |
| `cart/` | `route.ts`, `items/route.ts`, `items/[variantId]/route.ts` | CMD-01 |
| `checkout/` | `quote` (recalcul serveur), `orders` (création + réservation de stock) | CMD-02 à 06, FRD-01 |
| `orders/` | `[id]/route.ts`, `[id]/cancel`, `[id]/tracking` | CMD-09, LIV-07 |
| `payments/` | `attempts`, `[id]/status`, `webhooks/mtn`, `webhooks/orange` | PAY-01 à 09 |
| `me/` | `profile`, `addresses`, `orders`, `invoices/[id]`, `data-requests` | CLI-04 à 08 |
| `returns/` | `route.ts`, `[id]/route.ts`, `[id]/attachments` | RET-01 à 06 |
| `support/` | `tickets`, `tickets/[id]/messages` | BO-06 |
| `courier/` | `missions`, `missions/[id]/deliver` (code SMS), `missions/[id]/fail` | LIV-06 à 09 |
| `admin/` | `products`, `variants`, `categories`, `inventory`, `orders`, `shipments`, `returns`, `tickets`, `users`, `zones`, `settings`, `audit`, `watchlist`, `reports/dashboard`, `content` | BO-01 à 08, STK, FRD-02 |
| `health/` | `route.ts` | NFR-18 |

---

## 5. Fichiers clés à écrire en premier

1. **`lib/env.ts`** : lit et valide `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `MTN_*`, `ORANGE_*`, `SMS_*`, `S3_*`. L'application refuse de démarrer si une valeur manque.
2. **`lib/http.ts`** : enveloppe commune des routes (validation zod, erreurs normalisées, journal, limitation de fréquence).
3. **`lib/auth-guard.ts`** : `requireRole('admin', 'advisor')`. Le contrôle est **côté serveur** (BO-02).
4. **`modules/orders/create-order.ts`** : une seule transaction SQL qui recalcule les prix, réserve le stock et crée la commande.

   ```sql
   -- réservation atomique : zéro ligne modifiée = stock insuffisant
   UPDATE inventory SET qty_reserved = qty_reserved + $qty
   WHERE variant_id = $variant AND warehouse_id = $wh
     AND qty_on_hand - qty_reserved >= $qty;
   ```
5. **`modules/payments/providers/*.ts`** : création de la demande de paiement, vérification de la signature, lecture du statut.
6. **`app/api/payments/webhooks/*/route.ts`** : enregistre l'événement dans `payment_events` (clé unique = idempotence), vérifie signature, montant et devise, puis change l'état.
7. **`modules/fraud/score.ts`** : calcule le score à partir des signaux du tableau 4.15 ; seuils lus dans `settings.risk_thresholds`.
8. **`jobs/expire-reservations.ts`** : toutes les minutes, libère les réservations `ACTIVE` échues (`idx_resv_expiry`).
9. **`jobs/reconcile-payments.ts`** : chaque nuit, compare `payment_attempts` au relevé du prestataire (PAY-12).
10. **Front : `api/client.ts`**, `store/cart.ts`, `pages/public/Checkout.tsx` et `components/checkout/MomoPending.tsx` (interrogation du statut jusqu'à la confirmation).

---

## 6. Variables d'environnement (`.env.example`)

```
DATABASE_URL=postgresql://lorena:lorena@localhost:5432/lorena
REDIS_URL=redis://localhost:6379
JWT_SECRET=
JWT_REFRESH_SECRET=
WEB_ORIGIN=http://localhost:5173
MTN_MOMO_BASE_URL=
MTN_MOMO_API_KEY=
MTN_MOMO_WEBHOOK_SECRET=
ORANGE_MONEY_BASE_URL=
ORANGE_MONEY_API_KEY=
ORANGE_MONEY_WEBHOOK_SECRET=
SMS_PROVIDER_URL=
SMS_PROVIDER_KEY=
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=lorena
S3_ACCESS_KEY=
S3_SECRET_KEY=
MEILI_URL=http://localhost:7700
MEILI_KEY=
```

---

## 7. Ordre de réalisation conseillé (lot 1 puis lot 2)

1. Docker, base de données (`lorena-schema.sql`), `lib/env.ts`, `lib/db.ts`.
2. Authentification et rôles, puis catalogue et recherche.
3. Panier, devis serveur, création de commande avec réservation de stock.
4. Paiement Mobile Money en bac à sable, webhooks, tâche d'expiration. **Fin du lot 1.**
5. Livraison, espèces, retours, support, score de risque, tableau de bord. **Fin du lot 2.**

Les critères de chaque exigence sont dans la section 4.19 du cahier des charges.
