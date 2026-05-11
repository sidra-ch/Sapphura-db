# Sapphura Release Checklist

Use this checklist before every production release.

## 1. Working Tree

1. Confirm you are on the correct branch:
   `git branch --show-current`
2. Confirm the repo is clean before starting:
   `git status -sb`
3. Do not commit local archives, SQL exports, CSV dumps, or temporary helper files.

## 2. Code Quality

Run these from the project root:

```bash
npm install
npm run lint
npx tsc --noEmit
npm run build
```

Notes:

1. This repo skips some checks during normal Next build, so `npm run build` alone is not enough.
2. If Stripe is not configured locally, keep runtime initialization guarded so the build does not crash.

## 3. Environment Review

Before production, confirm these are correct in the target environment:

1. `APP_URL`
2. `DATABASE_URL`
3. `JWT_SECRET`
4. Clerk keys
5. Stripe keys
6. `STRIPE_WEBHOOK_SECRET`
7. SMTP credentials
8. Cloudinary credentials
9. Payment gateway credentials, if enabled

## 4. Functional Smoke Tests

Verify these flows manually:

1. Homepage loads
2. Product listing loads
3. Product detail loads
4. Sign-in works
5. Sign-up works
6. Admin access works
7. Cart works
8. Checkout works
9. OTP send works
10. OTP verify works
11. Stripe payment works
12. Order confirmation page works

## 5. Repo Hygiene

Before pushing:

1. Check `.gitignore` still excludes large local artifacts
2. Check `.vercelignore` still excludes non-deploy files
3. Confirm these are not being committed:
   1. `*.zip`
   2. `*.sql`
   3. `*.csv`
   4. `.next/`
   5. `node_modules/`
4. If large files were accidentally committed locally, clean them before pushing

## 6. Git Release Steps

Use this flow:

```bash
git status -sb
git add -A
git commit -m "your release message"
git push origin main
```

After push:

```bash
git status -sb
git ls-remote --heads origin main
```

Confirm local `main` matches `origin/main`.

## 7. Vercel Release

Standard production path for the root Next.js app:

```bash
npx vercel --prod --yes
```

After deploy:

1. Open the inspect URL
2. Open the production URL
3. Confirm domain alias is correct
4. Confirm SSL is issued for the live domain

## 8. cPanel Release

Use cPanel only if Node.js app hosting is supported.

Required cPanel checks:

1. Node.js 20+
2. `Setup Node.js App` available
3. `npm install` works on server
4. `npm run build` works on server
5. `npm run start` or `app.js` startup works
6. Domain is attached to the Node app, not just `public_html`

## 9. Post-Release Check

After deployment, verify:

1. Live homepage
2. Live sign-in
3. Live admin
4. Live checkout
5. Live payment webhook
6. Live email delivery
7. Browser console has no blocking errors
8. Server logs show no startup crash
