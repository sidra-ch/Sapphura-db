# SECURITY HARDENING CHECKLIST — SAPPHURA (laravel-migrated)

This file lists non-invasive, high-priority hardening steps. Follow these before deploying to production.

1) DO NOT commit secrets
  - Ensure `.env` is git-ignored. Use `.env.example` for placeholders only.
  - Rotate any credentials that were previously committed.

2) Application key
  - Run `php artisan key:generate` on the deployment host; never store `APP_KEY` in repo.

3) Production config
  - `APP_ENV=production`, `APP_DEBUG=false`.
  - Run `php artisan config:cache` and `php artisan route:cache` in deploy pipeline.

4) Secure cookies & sessions
  - Set `session.cookie_secure = true` and `session.same_site = 'strict'` in `config/session.php`.
  - Use `redis` for session and cache in production.

5) Enforce HTTPS and headers
  - Enable HSTS and a restrictive CSP via middleware.
  - Set `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy` headers.

6) File uploads
  - Validate MIME types, file size, and use signed Cloudinary or presigned S3 URLs.
  - Store uploads outside webroot when possible and use a CDN.

7) Secrets management
  - Use a secrets manager (Vault, AWS Secrets Manager, GitHub Secrets) for production values.

8) Repo scanning & CI
  - Add secret scanning in CI and enable GitHub secret scanning if available.
  - Add tests that fail CI on leaked secrets/config drift.

9) Access control
  - Harden admin area with IP allowlist + role-based policies.
  - Add rate-limiting on auth endpoints (login/otp) and brute-force protection.

10) Monitoring & backups
  - Configure Sentry/Log aggregation and DB backups with regular restore tests.

11) Deployment checklist (minimum)
  - Ensure migrations are run in a maintenance window.
  - Run `php artisan migrate --force` and `php artisan config:cache` on deploy.
  - Ensure queue workers are running (Supervisor/Horizon).

If you want, I can: (A) open PRs that add `.env.example` (done), (B) add a GitHub Action to scan for leaked secrets, (C) add middleware skeletons for CSP/HSTS, or (D) implement login throttling in `AuthController`. Which should I do next?