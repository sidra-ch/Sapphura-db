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

4. Open `http://localhost:3000`.

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
