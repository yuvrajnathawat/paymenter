## Bazzar Deployment Guide (PostgreSQL + Serverless)

This document explains how to deploy Bazzar with PostgreSQL and optional serverless functions on Vercel or Netlify.

---

## 1. Database: PostgreSQL

Bazzar is configured to use PostgreSQL via:

- `config/database.php` → `pgsql` connection (using `DB_URL` / `DATABASE_URL`).
- `.env` / `.env.example`:
  - `DB_CONNECTION=pgsql`
  - `DB_URL=${DATABASE_URL}`
  - `DATABASE_URL=postgresql://username:password@hostname:5432/dbname`

### Recommended providers

- **Neon.tech** – serverless PostgreSQL, free 0.5GB.
- **Supabase** – PostgreSQL with auth/storage, free 500MB.
- **Railway** – managed PostgreSQL (free tier, requires card).

Example Neon connection string (do not commit real secrets):

```text
postgresql://neondb_owner:password@ep-flat-brook-a1wu8rjr-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Update your `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/bazzar?sslmode=require
DB_CONNECTION=pgsql
DB_URL=${DATABASE_URL}
```

---

## 2. Prisma setup (schema & migrations)

Prisma is configured under:

- `prisma/schema.prisma`
- `package.json` scripts:
  - `npm run prisma:generate`
  - `npm run prisma:migrate:dev`
  - `npm run prisma:migrate:deploy`
  - `npm run prisma:studio`

### 2.1 Install dependencies

From the project root:

```bash
npm install
```

This installs `prisma` and `@prisma/client`.

### 2.2 Introspect the existing schema

`schema.prisma` is intentionally minimal. To generate models that match your existing PostgreSQL schema:

```bash
npx prisma db pull
npm run prisma:generate
```

This will:

- Read the schema from the PostgreSQL database pointed to by `DATABASE_URL`.
- Populate models in `prisma/schema.prisma`.
- Generate Prisma Client for use in serverless functions.

### 2.3 Running migrations

If you maintain your schema in Prisma (optional, in addition to Laravel migrations), you can:

```bash
npm run prisma:migrate:dev      # dev
npm run prisma:migrate:deploy   # production
```

---

## 3. Laravel configuration

Laravel continues to run as the primary application:

- `.env`:
  - `APP_NAME=Bazzar`
  - `DB_CONNECTION=pgsql`
  - `DB_URL=${DATABASE_URL}`
- `config/database.php`:
  - Uses the `pgsql` connection when `DB_CONNECTION=pgsql`.

To run Laravel locally with PostgreSQL:

```bash
php artisan migrate
php artisan serve
```

Ensure your PostgreSQL credentials in `.env` are valid.

---

## 4. Serverless functions (Vercel & Netlify)

Serverless functions provide optional APIs backed by Prisma:

- Shared helpers:
  - `serverless/db.js` – Prisma Client singleton.
  - `serverless/utils/withPrisma.js` – retry wrapper for transient DB errors.
  - `serverless/config/cors.js` – CORS helpers for Vercel and Netlify.

### 4.1 Vercel

Config file:

- `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/node" }
  ],
  "env": {
    "DATABASE_URL": "@database_url"
  }
}
```

Functions (Node, ESM):

- `api/health.js` – health check (`SELECT 1` via Prisma).
- `api/me.js` – example "current user" endpoint (expects `x-user-id` header).
- `api/admin-users.js` – example admin users list (first 50 users, read-only).

> These examples are **not** wired into Laravel auth. Before using in production, add real authentication (JWT, cookies, etc.).

#### Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel:
   - Import the repository.
   - Set environment variables:
     - `DATABASE_URL` with your Postgres URL.
     - `NODE_ENV=production`.
3. Deploy.
4. Test:
   - `GET https://your-vercel-domain/api/health`

---

### 4.2 Netlify

Config file:

- `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[dev]
  command = "npm run dev"
```

Functions:

- `netlify/functions/health.js`
- `netlify/functions/me.js`
- `netlify/functions/admin-users.js`

All functions:

- Use `withPrisma` for DB access.
- Use `applyCorsToNetlify` for CORS headers.

#### Deploying to Netlify

1. Connect the repository in Netlify.
2. Ensure Node is available (Netlify default Node runtime).
3. Set environment variables:
   - `DATABASE_URL`
   - `NODE_ENV=production`
4. Deploy and test:
   - `GET https://your-netlify-site.netlify.app/.netlify/functions/health`

> Note: `publish = "dist"` assumes you will build a static front-end into `dist` with `npm run build`. If you are only using Netlify for functions, you can adjust `publish` to any static directory or a minimal placeholder.

---

## 5. Connection pooling & cold starts

- **Pooling**:
  - Use a provider with a pooled connection string (e.g. Neon "pooler" host).
  - `serverless/db.js` keeps a shared Prisma Client instance to avoid creating new connections on every invocation.

- **Cold starts / transient errors**:
  - `withPrisma` retries transient connection errors a few times with backoff.

---

## 6. Summary of new files for deployment

- Root:
  - `vercel.json`
  - `netlify.toml`
  - `DEPLOY.md`
- Prisma:
  - `prisma/schema.prisma`
- Serverless helpers:
  - `serverless/db.js`
  - `serverless/utils/withPrisma.js`
  - `serverless/config/cors.js`
- Vercel functions:
  - `api/health.js`
  - `api/me.js`
  - `api/admin-users.js`
- Netlify functions:
  - `netlify/functions/health.js`
  - `netlify/functions/me.js`
  - `netlify/functions/admin-users.js`

