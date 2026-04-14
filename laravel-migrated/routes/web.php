<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

// Store pages
Route::get('/', [StoreController::class, 'home'])->name('home');
Route::get('/collections', [StoreController::class, 'collections'])->name('collections');
Route::get('/product/{slug}', [StoreController::class, 'product'])->name('product');
Route::get('/search', [StoreController::class, 'search'])->name('search');
Route::get('/cart', [StoreController::class, 'cart'])->name('cart');
Route::get('/checkout', [StoreController::class, 'checkout'])->name('checkout');
Route::get('/wishlist', [StoreController::class, 'wishlist'])->name('wishlist');
Route::get('/order-confirmation', [StoreController::class, 'orderConfirmation'])->name('order-confirmation');

// Auth
Route::get('/sign-in', [AuthController::class, 'showSignIn'])->name('sign-in');
Route::post('/sign-in', [AuthController::class, 'signIn']);
Route::get('/sign-up', [AuthController::class, 'showSignUp'])->name('sign-up');
Route::post('/sign-up', [AuthController::class, 'signUp']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Account (protected)
Route::middleware('auth')->group(function () {
    Route::get('/account', [AccountController::class, 'index'])->name('account');
});

// Static pages
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/blogs', [PageController::class, 'blogs'])->name('blogs');
Route::get('/track-order', [PageController::class, 'trackOrder'])->name('track-order');
Route::get('/how-to-order', [PageController::class, 'howToOrder'])->name('how-to-order');
Route::get('/shipping-rates', [PageController::class, 'shippingRates'])->name('shipping-rates');
Route::get('/terms-of-service', [PageController::class, 'termsOfService'])->name('terms-of-service');
Route::get('/refund-policy', [PageController::class, 'refundPolicy'])->name('refund-policy');
Route::get('/exchange-policy', [PageController::class, 'exchangePolicy'])->name('exchange-policy');

// Admin (protected)
Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/products', [AdminController::class, 'products'])->name('admin.products');
    Route::get('/products/create', [AdminController::class, 'createProduct'])->name('admin.products.create');
    Route::post('/products', [AdminController::class, 'storeProduct'])->name('admin.products.store');
    Route::get('/products/{id}/edit', [AdminController::class, 'editProduct'])->name('admin.products.edit');
    Route::put('/products/{id}', [AdminController::class, 'updateProduct'])->name('admin.products.update');
    Route::delete('/products/{id}', [AdminController::class, 'deleteProduct'])->name('admin.products.delete');
    Route::get('/orders', [AdminController::class, 'orders'])->name('admin.orders');
    Route::get('/orders/{id}', [AdminController::class, 'showOrder'])->name('admin.orders.show');
    Route::patch('/orders/{id}/status', [AdminController::class, 'updateOrderStatus'])->name('admin.orders.status');
    Route::patch('/orders/{id}/tracking', [AdminController::class, 'updateOrderTracking'])->name('admin.orders.tracking');
    Route::patch('/orders/{id}/notes', [AdminController::class, 'updateOrderNotes'])->name('admin.orders.notes');
    Route::get('/categories', [AdminController::class, 'categories'])->name('admin.categories');
    Route::post('/categories', [AdminController::class, 'storeCategory'])->name('admin.categories.store');
    Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory'])->name('admin.categories.delete');
    Route::get('/customers', [AdminController::class, 'customers'])->name('admin.customers');
    Route::get('/customers/{id}', [AdminController::class, 'showCustomer'])->name('admin.customers.show');
    Route::get('/reviews', [AdminController::class, 'reviews'])->name('admin.reviews');
    Route::patch('/reviews/{id}/toggle', [AdminController::class, 'toggleReview'])->name('admin.reviews.toggle');
    Route::delete('/reviews/{id}', [AdminController::class, 'deleteReview'])->name('admin.reviews.delete');
    Route::get('/coupons', [AdminController::class, 'coupons'])->name('admin.coupons');
    Route::get('/coupons/create', [AdminController::class, 'createCoupon'])->name('admin.coupons.create');
    Route::post('/coupons', [AdminController::class, 'storeCoupon'])->name('admin.coupons.store');
    Route::get('/coupons/{id}/edit', [AdminController::class, 'editCoupon'])->name('admin.coupons.edit');
    Route::put('/coupons/{id}', [AdminController::class, 'updateCoupon'])->name('admin.coupons.update');
    Route::delete('/coupons/{id}', [AdminController::class, 'deleteCoupon'])->name('admin.coupons.delete');
    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings');
});
