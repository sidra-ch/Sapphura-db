# Sapphura

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` or `.env` and fill in the real values.

3. Start the dev server:

```bash
npm run dev
```

4. Open `https://sapphura.com`.

## Environment Variables

This project now includes [.env.example](c:/Users/mssid/Desktop/Sapphura/.env.example) with the expected keys.

Minimum production variables:

1. `APP_URL`
2. `DATABASE_URL`
3. `JWT_SECRET`
4. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
5. `CLERK_SECRET_KEY`
6. `CLERK_ADMIN_EMAILS`
7. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
8. `STRIPE_SECRET_KEY`
9. `STRIPE_WEBHOOK_SECRET`
10. `SMTP_HOST`
11. `SMTP_PORT`
12. `SMTP_USER`
13. `SMTP_PASSWORD`
14. `SMTP_FROM`
15. `CLOUDINARY_CLOUD_NAME`
16. `CLOUDINARY_API_KEY`
17. `CLOUDINARY_API_SECRET`

Optional or feature-specific variables:

1. `EASYPAISA_INITIATE_URL`
2. `EASYPAISA_STATUS_URL`
3. `EASYPAISA_SECRET`
4. `JAZZCASH_INITIATE_URL`
5. `JAZZCASH_STATUS_URL`
6. `JAZZCASH_INTEGRITY_SALT`
7. `PAYMENT_RECONCILE_KEY`
8. `PAYMENT_DEBUG_KEY`
9. `NEXT_PUBLIC_META_PIXEL_ID`
10. `FRAUD_PROVIDER_ENDPOINT`
11. `FRAUD_PROVIDER_API_KEY`
12. `OTP_EMAIL_ONLY_MODE`

## cPanel Deployment

This app is a Node.js / Next.js application. Do not deploy it as a static upload to `public_html`.

### Go / No-Go Check

Use cPanel only if your hosting supports all of the following:

1. Node.js application hosting in cPanel
2. Node 20 or newer
3. Running `npm install`, `npm run build`, and `npm run start`
4. Persistent Node process management
5. HTTPS on your real domain
6. Outbound access to Neon, Clerk, Stripe, Cloudinary, and your SMTP provider

If your cPanel plan does not support a real Node app, stay on Vercel.

### cPanel Steps

1. Create a Node.js application in cPanel.
2. Select a Node version compatible with Next 16, ideally Node 20+.
3. Point the app root to your project directory.
4. Upload the project or pull it from GitHub.
5. Add all required environment variables from [.env.example](c:/Users/mssid/Desktop/Sapphura/.env.example) into the cPanel app environment settings.
6. Run `npm install`.
7. Run `npm run build`.
8. Start the app with `npm run start`.
9. Point your domain or subdomain to the Node app.
10. Enable SSL before testing auth or payments.

### Production Domain Changes

Before going live on cPanel, update these integrations to the new domain:

1. Set `APP_URL` to `https://your-real-domain.com`
2. Update Clerk allowed domains, redirect URLs, and webhook settings
3. Update Stripe webhook endpoint to `/api/payments/webhook/stripe`
4. Update Easypaisa and JazzCash callback/return URLs if those gateways are enabled
5. Update any payment provider allowlists that still point to Vercel

### Production Checklist

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. Confirm homepage and collections load
5. Confirm sign-in and sign-up work
6. Confirm admin access works
7. Confirm cart and checkout work
8. Confirm OTP send and verify work
9. Confirm Stripe payment works
10. Confirm Stripe webhook updates the order
11. Confirm wallet payments are either configured or intentionally disabled
12. Confirm confirmation emails send successfully
13. Confirm order confirmation page loads and polling works

## Quality Checks

Run these before shipping changes:

```bash
npm run lint
npx tsc --noEmit
```

## Production Handoff Checklist

1. Set `APP_URL` to the real production domain.
2. Use live Stripe keys instead of test keys.
3. Change Clerk admin access to the client email.
4. Keep secrets only in untracked env files or your hosting provider.
5. Verify sign-in, admin access, checkout, OTP, and contact flows.

## Notes

- Card payments require `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to be set.
- The app uses Clerk for sign-in, so admin credentials must be managed in Clerk.
- Wallet payments require the gateway env vars to be present; otherwise the UI now disables those methods automatically.
