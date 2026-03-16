# Project Guidelines

## Code Style
- Use TypeScript and Next.js App Router patterns used across this repo.
- Prefer Server Components by default in `app/**`; add `"use client"` only when browser APIs, local state, or effects are required.
- Keep edits small and consistent with nearby code style (imports, quote style, and component structure).
- For API handlers, keep route-level orchestration in `app/api/**/route.ts` and shared logic in `lib/**`.

## Architecture
- Frontend routes live in `app/**` (public storefront, `app/store/**`, and admin routes under `app/admin/**`).
- Shared UI lives in `components/**`; cross-page providers are composed in `components/Providers.tsx` and mounted in `app/layout.tsx`.
- Data access uses Prisma with PostgreSQL via `lib/db.ts` and schema in `prisma/schema.prisma`.
- Auth is JWT-based (`lib/auth.ts`) with request guards in `lib/middleware.ts`; protected API behavior should be enforced server-side.
- Client state currently uses both Context providers (`components/**/Context`) and Zustand (`store/**`). Reuse existing patterns instead of introducing a third state mechanism.

## Build and Test
- Install dependencies: `npm install`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`
- No test script is defined. If a task risks type regressions, run `npx tsc --noEmit` manually.
- Prisma config is in `prisma.config.ts`. Common workflows are `npx prisma migrate dev` and `npx prisma db seed`.

## Conventions
- Keep environment-sensitive code explicit. Common required env vars include `DATABASE_URL`, `JWT_SECRET`, Stripe keys, Cloudinary keys, and SMTP credentials.
- OTP channels may rely on Twilio credentials: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, and `TWILIO_SMS_FROM`.
- This repo contains both `next.config.ts` and `next.config.js`. Treat `next.config.ts` as the primary config and avoid splitting settings between both files.
- `next.config.ts` currently allows builds with TS/ESLint errors; do not assume `npm run build` means code is lint-clean or type-safe.
- Path alias `@/*` maps to `src/*`, but most code is in root-level `app`, `components`, and `lib`. Follow local import patterns in the area you edit.
- For database changes, update Prisma schema first, then create/apply migrations in `prisma/migrations/**`.
