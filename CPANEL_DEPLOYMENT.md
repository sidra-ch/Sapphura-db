# Sapphura cPanel Deployment Guide

This project is a Next.js Node application. It will not go live by only extracting a zip into `public_html`.

## 1. Confirm Hosting Support

Your hosting must support all of these:

1. `Setup Node.js App` in cPanel
2. Node.js 20 or newer
3. Running `npm install`
4. Running `npm run build`
5. Running `npm run start` or a startup file such as `app.js`
6. Outbound connection to Neon, Clerk, Stripe, Cloudinary, and SMTP

If `Setup Node.js App` is missing in cPanel, this project should be deployed on Vercel or a VPS instead.

## 2. Files To Upload

Upload these files and folders:

1. `app/`
2. `components/`
3. `lib/`
4. `prisma/`
5. `public/`
6. `src/`
7. `store/`
8. `app.js`
9. `package.json`
10. `package-lock.json`
11. `next.config.ts`
12. `tsconfig.json`
13. `prisma.config.ts`
14. `postcss.config.mjs`
15. `next-env.d.ts`

Do not upload these:

1. `node_modules/`
2. `.next/`
3. `.git/`
4. `.vercel/`
5. local env files (add them via cPanel UI instead)

> [!CAUTION]
> **CRITICAL: DO NOT UPLOAD `node_modules` MANUALLY.**
> Uploading `node_modules` from Windows to Linux will cause "503 Service Unavailable" or "Invalid ELF Header" errors because of OS-specific binaries. Always run `npm install` on the server terminal instead.

## 3. Recommended Folder Location

Do not treat this as a static site.

Recommended layout:

1. Put the project in a folder such as `/home/USERNAME/sapphura`
2. Use cPanel Node.js app settings to point the application root to that folder
3. Point the domain or subdomain to the Node.js app

## 4. Exact cPanel Steps

1. Open cPanel
2. Open `Setup Node.js App`
3. Click `Create Application`
4. Choose Node.js version `20` or newer
5. Set application root to your uploaded project folder
6. Set application URL to your domain or subdomain
7. If cPanel asks for startup file, use `app.js`
8. Save the app
9. Open the app terminal or SSH shell
10. Run `npm install`
11. Run `npm run build`
12. Start or restart the application

If cPanel uses a startup command instead of startup file, use:

```bash
npm run start
```

## 5. Environment Variables

Add these in cPanel Node.js app environment settings.

Required:

1. `APP_URL=https://sapphura.com`
2. `NODE_ENV=production`
3. `DATABASE_URL=...`
4. `JWT_SECRET=...`
5. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...`
6. `CLERK_SECRET_KEY=...`
7. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...`
8. `STRIPE_SECRET_KEY=...`
9. `STRIPE_WEBHOOK_SECRET=...`
10. `SMTP_HOST=...`
11. `SMTP_PORT=587`
12. `SMTP_USER=...`
13. `SMTP_PASSWORD=...`
14. `SMTP_FROM=...`
15. `CLOUDINARY_CLOUD_NAME=...`
16. `CLOUDINARY_API_KEY=...`
17. `CLOUDINARY_API_SECRET=...`

Usually needed:

1. `CLERK_ADMIN_EMAILS=your-email@example.com`
2. `OTP_EMAIL_ONLY_MODE=false`

Optional features:

1. `EASYPAISA_INITIATE_URL=...`
2. `EASYPAISA_STATUS_URL=...`
3. `EASYPAISA_SECRET=...`
4. `JAZZCASH_INITIATE_URL=...`
5. `JAZZCASH_STATUS_URL=...`
6. `JAZZCASH_INTEGRITY_SALT=...`
7. `PAYMENT_RECONCILE_KEY=...`
8. `PAYMENT_DEBUG_KEY=...`
9. `NEXT_PUBLIC_META_PIXEL_ID=...`
10. `FRAUD_PROVIDER_ENDPOINT=...`
11. `FRAUD_PROVIDER_API_KEY=...`

Use `.env.example` only as a reference template. Real env variables do not get uploaded automatically.

## 6. Do Not Depend On Local `.env`

This repo ignores env files in `.gitignore`, so hosting will not automatically receive them.

Preferred method:

1. Add all env vars manually in cPanel environment settings

Fallback method:

1. Put a server-side `.env` in the application root only if cPanel does not provide env management

Never expose env files inside `public_html`.

## 7. Current Project Status

This codebase passed these checks locally:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. `npm run start`

That means the project itself is buildable and bootable.

## 8. Current Production Risks

These should be fixed before going live:

1. Stripe keys appear to be test keys, not live keys
2. Clerk keys appear to be non-production keys
3. `STRIPE_WEBHOOK_SECRET` still needs to be added for live payment webhooks
4. If wallet payments are not configured, keep them disabled or leave those env vars unset intentionally

## 9. After Deployment Test These Routes

1. `/`
2. `/collections`
3. `/product/[slug]`
4. `/sign-in/[[...sign-in]]`
5. `/checkout`
6. `/admin`
7. `/api/payments/providers`
8. `/api/otp/channels`

## 10. If Site Still Does Not Show

Check these in order:

1. `Setup Node.js App` is available in hosting
2. Node version is `20+`
3. Application root points to the correct folder
4. Startup file is `app.js` or startup command is `npm run start`
5. `npm install` completed without error
6. `npm run build` completed without error
7. The app is restarted after env changes
8. Domain is attached to the Node.js app, not only to `public_html`
9. SSL is enabled for `https://sapphura.com`
10. Environment variables are added in cPanel

## 11. Detailed 503 Troubleshooting

If you see "503 Service Unavailable", the app is crashing. Follow these steps:

1.  **Check `startup_error.log`**: Find this file in your app root. It contains the exact crash reason.
2.  **Delete `node_modules`**: If you uploaded them from your PC, delete the folder completely on the server.
3.  **Terminal Check**: Open the Terminal in cPanel and run:
    ```bash
    # Navigate to your app folder
    cd /home/YOUR_USERNAME/sapphura
    
    # Clean and install (Ensures Linux-compatible binaries)
    rm -rf node_modules
    npm install
    
    # Build on server
    npm run build
    ```
4.  **Prisma Check**: If Prisma fails, run `npx prisma generate` in the terminal to download the correct Linux engine.
5.  **Restart App**: Go back to `Setup Node.js App` and click **Restart**.

## 12. Quick Verdict

The project is deployable.

If the site is still not showing after upload, the likely issue is cPanel hosting configuration, not missing application code.