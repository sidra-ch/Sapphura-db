# cPanel Environment Variables

Add these variables in cPanel `Setup Node.js App` under `Environment Variables`.

Do not upload your `.env` file if you are adding values here manually.

## Required

1. `APP_URL=https://sapphura.com`
2. `NODE_ENV=production`
3. `DATABASE_URL=your_neon_database_url`
4. `JWT_SECRET=your_jwt_secret`
5. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key`
6. `CLERK_SECRET_KEY=your_clerk_secret_key`
7. `CLERK_ADMIN_EMAILS=your_admin_email`
8. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_live_stripe_publishable_key`
9. `STRIPE_SECRET_KEY=your_live_stripe_secret_key`
10. `STRIPE_WEBHOOK_SECRET=your_live_stripe_webhook_secret`
11. `SMTP_HOST=smtp.gmail.com`
12. `SMTP_PORT=587`
13. `SMTP_USER=your_email@gmail.com`
14. `SMTP_PASSWORD=your_email_app_password`
15. `SMTP_FROM=Sapphura <your_email@gmail.com>`
16. `CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name`
17. `CLOUDINARY_API_KEY=your_cloudinary_api_key`
18. `CLOUDINARY_API_SECRET=your_cloudinary_api_secret`
19. `OTP_EMAIL_ONLY_MODE=false`

## Optional

1. `CLOUDINARY_URL=your_cloudinary_url`
2. `ADMIN_EMAILS=your_admin_email`
3. `EASYPAISA_INITIATE_URL=...`
4. `EASYPAISA_STATUS_URL=...`
5. `EASYPAISA_SECRET=...`
6. `JAZZCASH_INITIATE_URL=...`
7. `JAZZCASH_STATUS_URL=...`
8. `JAZZCASH_INTEGRITY_SALT=...`
9. `PAYMENT_RECONCILE_KEY=...`
10. `PAYMENT_DEBUG_KEY=...`
11. `NEXT_PUBLIC_META_PIXEL_ID=...`
12. `FRAUD_PROVIDER_ENDPOINT=...`
13. `FRAUD_PROVIDER_API_KEY=...`
14. `ADMIN_DEFAULT_EMAIL=...`
15. `ADMIN_DEFAULT_PASSWORD=...`
16. `ADMIN_DEFAULT_NAME=...`
17. `ADMIN_DEFAULT_PHONE=...`

## Notes

1. `CLOUDINARY_URL` alone is not enough for this project. Keep the separate Cloudinary variables too.
2. Stripe and Clerk should use production values before going live.
3. After adding or editing env vars, restart the Node.js app in cPanel.
4. If payments are not configured yet, keep wallet-related variables empty and do not enable those payment methods.