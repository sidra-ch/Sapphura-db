<?php

use App\Http\Controllers\Api\LegacyBridgeController;
use App\Http\Middleware\AdminApiKey;
use Illuminate\Support\Facades\Route;

// ---------- Public routes ----------

Route::match(['get', 'post'], '/auth', [LegacyBridgeController::class, 'authDeprecated']);

// OTP
Route::post('/otp', [LegacyBridgeController::class, 'otp'])->middleware('throttle:30,1');
Route::get('/otp/channels', [LegacyBridgeController::class, 'otpChannels']);

// Products (read)
Route::get('/products', [LegacyBridgeController::class, 'productsIndex']);
Route::get('/categories', [LegacyBridgeController::class, 'categoriesIndex']);
Route::get('/search', [LegacyBridgeController::class, 'search']);

// Cart
Route::get('/cart', [LegacyBridgeController::class, 'cartGet']);
Route::post('/cart', [LegacyBridgeController::class, 'cartPost']);
Route::delete('/cart', [LegacyBridgeController::class, 'cartDelete']);

// Orders (public)
Route::post('/orders', [LegacyBridgeController::class, 'ordersStore'])->middleware('throttle:20,1');
Route::post('/checkout/confirm', [LegacyBridgeController::class, 'ordersStore'])->middleware('throttle:20,1');
Route::get('/orders/{id}/status', [LegacyBridgeController::class, 'orderStatus']);

// Stripe (public – customer-facing)
Route::post('/stripe', [LegacyBridgeController::class, 'stripeCreateIntent'])->middleware('throttle:20,1');
Route::get('/stripe', [LegacyBridgeController::class, 'stripeGetIntent']);

// Payment initiation (public)
Route::get('/payments/providers', [LegacyBridgeController::class, 'paymentProviders']);
Route::post('/payments/initiate', [LegacyBridgeController::class, 'paymentInitiate'])->middleware('throttle:20,1');

// Payment webhooks (no auth – providers call these)
Route::post('/payments/webhook/stripe', [LegacyBridgeController::class, 'paymentWebhookStripe']);
Route::post('/payments/webhook/jazzcash', [LegacyBridgeController::class, 'paymentWebhookJazzcash']);
Route::post('/payments/webhook/easypaisa', [LegacyBridgeController::class, 'paymentWebhookEasypaisa']);

// Reviews (public read)
Route::get('/reviews', [LegacyBridgeController::class, 'reviewsIndex']);
Route::post('/reviews', [LegacyBridgeController::class, 'reviewsStore'])->middleware('throttle:10,1');

// Coupons (public validation)
Route::post('/coupons/validate', [LegacyBridgeController::class, 'couponValidate'])->middleware('throttle:30,1');

// ---------- Protected routes (server/cron) ----------

// Payment reconciliation (requires x-reconcile-key header – checked inside controller)
Route::post('/payments/reconcile', [LegacyBridgeController::class, 'paymentReconcile']);

// Payment debug (requires x-payment-debug-key header – checked inside controller)
Route::get('/payments/status', [LegacyBridgeController::class, 'paymentStatus']);

// ---------- Admin routes (require ADMIN_API_KEY) ----------

Route::middleware(AdminApiKey::class)->group(function () {
    Route::get('/users', [LegacyBridgeController::class, 'usersIndex']);
    Route::post('/users', [LegacyBridgeController::class, 'usersStore']);

    Route::post('/products', [LegacyBridgeController::class, 'productsStore']);
    Route::patch('/products/{id}', [LegacyBridgeController::class, 'productsUpdate']);
    Route::delete('/products/{id}', [LegacyBridgeController::class, 'productsDestroy']);
    Route::post('/products/import-cloudinary', [LegacyBridgeController::class, 'productsImportCloudinary']);

    Route::get('/orders', [LegacyBridgeController::class, 'ordersIndex']);
    Route::patch('/orders/{id}', [LegacyBridgeController::class, 'ordersUpdate']);

    Route::post('/media/cloudinary/signature', [LegacyBridgeController::class, 'cloudinarySignature']);
    Route::get('/media/cloudinary/assets', [LegacyBridgeController::class, 'cloudinaryAssets']);

    Route::patch('/reviews/{id}', [LegacyBridgeController::class, 'reviewsUpdate']);
    Route::delete('/reviews/{id}', [LegacyBridgeController::class, 'reviewsDestroy']);
});
