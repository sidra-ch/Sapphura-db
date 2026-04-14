# Sapphura Laravel cPanel Deployment

## 1) Prepare Build Artifacts

1. Build frontend in project root:
   - `npm ci`
   - `npm run build`
2. Export/copy your React static output into Laravel public directory:
   - target: `laravel-migrated/public/storefront`
   - required entry file: `laravel-migrated/public/storefront/index.html`

## 2) Upload Laravel to cPanel

1. Upload full `laravel-migrated` directory to cPanel (outside `public_html`).
2. Point domain document root to `laravel-migrated/public`.
3. Or copy `laravel-migrated/public/*` to `public_html` and update `index.php` path references.

## 3) Environment Configuration

1. Copy `.env.example` to `.env`.
2. Configure:
   - `APP_ENV=production`
   - `APP_DEBUG=false`
   - `APP_URL=https://your-domain.com`
   - MySQL credentials (`DB_*`)
   - payment/cloudinary/stripe secrets.

## 4) Install Dependencies & Key

Run inside `laravel-migrated`:

- `composer install --no-dev --optimize-autoloader`
- `php artisan key:generate`
- `php artisan migrate --force`

## 5) Production Optimization

- `php artisan config:cache`
- `php artisan route:cache`
- `php artisan view:cache`

## 6) Required Writable Paths

Ensure write permissions for:

- `storage/`
- `bootstrap/cache/`

## 7) Cron (for payment reconciliation)

### With SSH access:
Add cron entry:
```
* * * * * php /home/USER/laravel-migrated/artisan schedule:run >> /dev/null 2>&1
```

### Without SSH access (cPanel Cron Jobs):
1. Go to cPanel → Cron Jobs
2. Add new cron job with command:
   ```
   php /home/USER/laravel-migrated/artisan schedule:run
   ```
3. Set interval: every minute (`* * * * *`) or every 5 minutes for lower-traffic sites.

Alternatively, trigger reconciliation manually via HTTP:
```
curl -X POST https://yourdomain.com/api/payments/reconcile \
  -H "x-reconcile-key: YOUR_RECONCILE_KEY"
```

## 8) API and SPA Routing

- API endpoints are under `/api/*`.
- Catch-all web route serves frontend from `public/storefront/index.html`.

## 9) Deployment WITHOUT SSH Access

If you have no SSH access, follow these steps:

1. **Local preparation:**
   ```
   composer install --no-dev --optimize-autoloader
   php artisan key:generate
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
2. **Upload** the entire `laravel-migrated/` directory via cPanel File Manager or FTP.
3. **Folder structure on server:**
   ```
   /home/USER/laravel-migrated/       ← Laravel project (outside public_html)
   /home/USER/public_html/            ← Symlink or copy of laravel-migrated/public/
   ```
4. **Option A – Symlink (if supported):**
   Delete `public_html` and create a symlink:
   ```
   ln -s /home/USER/laravel-migrated/public /home/USER/public_html
   ```
5. **Option B – .htaccess redirect:**
   Upload Laravel project to `/home/USER/laravel-migrated/`.
   In `/home/USER/public_html/`, create `.htaccess`:
   ```apache
   RewriteEngine On
   RewriteRule ^(.*)$ /home/USER/laravel-migrated/public/$1 [L]
   ```
6. **Option C – Copy public folder:**
   Copy contents of `laravel-migrated/public/` into `public_html/`.
   Edit `public_html/index.php` and update path references:
   ```php
   require __DIR__.'/../laravel-migrated/vendor/autoload.php';
   $app = require_once __DIR__.'/../laravel-migrated/bootstrap/app.php';
   ```
7. **Database:** Use cPanel → MySQL Databases to create DB and user, then update `.env`.
8. **Migrations:** Use cPanel → Terminal (if available) or import SQL directly via phpMyAdmin.

## 10) Stripe SDK

This project requires `stripe/stripe-php`. Run `composer install` to install it.
The dependency is already declared in `composer.json`.
