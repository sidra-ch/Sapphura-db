# Sapphura Deployment Standard

This document defines the preferred deployment structure for this repository.

## 1. Primary Production Target

The root application is a Next.js app.

Standard production target:

1. Vercel for the root app
2. Custom domain attached through Vercel
3. Production environment variables managed in Vercel

Current live domain:

1. `https://sapphura.com`

## 2. cPanel Policy

cPanel is a fallback path, not the default path, for the root app.

Use cPanel only when all of these are true:

1. Hosting supports `Setup Node.js App`
2. Node.js version is 20 or newer
3. You can run `npm install` on the server
4. You can run `npm run build` on the server
5. You can run `npm run start` or use `app.js` as startup

Do not deploy the root Next.js app by only extracting files into `public_html`.

## 3. Legacy Laravel Folder

The `laravel-migrated/` folder is not the standard Vercel deployment target for the storefront.

Treat it as one of these:

1. Legacy migration reference
2. Separate hosting target if needed
3. Local/server-side admin or migration workspace

Do not include `laravel-migrated/` in the Vercel deployment payload for the root app.

## 4. Git Standard

Keep the GitHub repository focused on source code and deployment config.

Do commit:

1. App source code
2. Config files
3. Production-safe docs
4. Deployment docs
5. Ignore rules

Do not commit:

1. `*.zip`
2. `*.sql`
3. `*.csv`
4. `.next/`
5. `node_modules/`
6. local debug helper files
7. generated export files

## 5. Required Ignore Rules

### Git

Keep these ignored in `.gitignore`:

1. archives
2. SQL exports
3. CSV exports
4. local helper scripts that are not part of real production code
5. generated build output

### Vercel

Keep these excluded in `.vercelignore`:

1. `laravel-migrated/`
2. `*.zip`
3. `.next/`
4. other local-only deployment artifacts

## 6. Release Gate

No release should go out without these commands passing from the root app:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## 7. Environment Ownership

### Vercel

Vercel should hold:

1. production env vars for the root app
2. domain alias setup
3. production deployment history

### cPanel

cPanel should hold:

1. env vars only for the app actually hosted there
2. Node app settings if fallback deployment is used
3. server-specific runtime config

## 8. Operational Rule

When in doubt:

1. Push code to GitHub
2. Deploy root app to Vercel
3. Use cPanel only for infrastructure that truly belongs there

This keeps the production path simple, repeatable, and less error-prone.
