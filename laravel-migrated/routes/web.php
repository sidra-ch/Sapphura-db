<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminMediaController;
use App\Http\Controllers\AdminProductImportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\StoreController;
use App\Models\Category;
use App\Models\Product;
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
Route::redirect('/login', '/sign-in', 301)->name('login');
Route::redirect('/admin/login', '/sign-in', 301);
Route::get('/sign-in', [AuthController::class, 'showSignIn'])->name('sign-in');
Route::post('/sign-in', [AuthController::class, 'signIn']);
Route::get('/sign-up', [AuthController::class, 'showSignUp'])->name('sign-up');
Route::post('/sign-up', [AuthController::class, 'signUp']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('forgot-password');
Route::post('/forgot-password', [AuthController::class, 'sendResetLink']);
Route::get('/reset-password', [AuthController::class, 'showResetPassword'])->name('reset-password');
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

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
Route::get('/stitching', [PageController::class, 'stitching'])->name('stitching');
Route::post('/stitching-request', [PageController::class, 'stitchingRequest'])->name('stitching.request');

Route::get('/sitemap.xml', function () {
    $pages = [
        '/',
        '/collections',
        '/about',
        '/contact',
        '/faq',
        '/blogs',
        '/track-order',
        '/how-to-order',
        '/shipping-rates',
        '/terms-of-service',
        '/refund-policy',
        '/exchange-policy',
        '/stitching',
        '/search',
    ];

    $urls = [];
    foreach ($pages as $path) {
        $urls[] = [
            'loc' => url($path),
            'lastmod' => now()->toAtomString(),
            'changefreq' => 'weekly',
            'priority' => $path === '/' ? '1.0' : '0.7',
        ];
    }

    $categories = Category::select(['slug', 'updated_at'])->get();
    foreach ($categories as $category) {
        $slug = trim((string) ($category->slug ?? ''));
        if ($slug === '') {
            continue;
        }

        $urls[] = [
            'loc' => url('/collections?category=' . urlencode($slug)),
            'lastmod' => optional($category->updated_at)->toAtomString() ?? now()->toAtomString(),
            'changefreq' => 'weekly',
            'priority' => '0.8',
        ];
    }

    $products = Product::where('status', '=', 'active', 'and')->select(['slug', 'updated_at'])->get();
    foreach ($products as $product) {
        $slug = trim((string) ($product->slug ?? ''));
        if ($slug === '') {
            continue;
        }

        $urls[] = [
            'loc' => url('/product/' . $slug),
            'lastmod' => optional($product->updated_at)->toAtomString() ?? now()->toAtomString(),
            'changefreq' => 'daily',
            'priority' => '0.9',
        ];
    }

    $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    $xml .= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
    foreach ($urls as $entry) {
        $xml .= "  <url>\n";
        $xml .= '    <loc>' . e((string) ($entry['loc'] ?? '')) . "</loc>\n";
        $xml .= '    <lastmod>' . e((string) ($entry['lastmod'] ?? '')) . "</lastmod>\n";
        $xml .= '    <changefreq>' . e((string) ($entry['changefreq'] ?? 'weekly')) . "</changefreq>\n";
        $xml .= '    <priority>' . e((string) ($entry['priority'] ?? '0.7')) . "</priority>\n";
        $xml .= "  </url>\n";
    }
    $xml .= '</urlset>';

    return response($xml, 200)->header('Content-Type', 'application/xml');
})->name('sitemap');

// Admin (protected)
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/products', [AdminController::class, 'products'])->name('admin.products');
    Route::get('/bulk-import-products', [AdminProductImportController::class, 'showForm'])->name('admin.products.import.form');
    Route::post('/bulk-import-products/preview', [AdminProductImportController::class, 'preview'])->name('admin.products.import.preview');
    Route::post('/bulk-import-products/commit', [AdminProductImportController::class, 'commit'])->name('admin.products.import.commit');
    Route::get('/bulk-import-products/template', [AdminProductImportController::class, 'downloadTemplate'])->name('admin.products.import.template');
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
    Route::get('/categories/create', fn() => redirect()->route('admin.categories'))->name('admin.categories.create');
    Route::post('/categories', [AdminController::class, 'storeCategory'])->name('admin.categories.store');
    Route::put('/categories/{id}/rename', [AdminController::class, 'updateCategory'])->name('admin.categories.rename');
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
    Route::get('/media-library', [AdminMediaController::class, 'index'])->name('admin.media.library');
    Route::get('/media-library/list', [AdminMediaController::class, 'list'])->name('admin.media.list');
    Route::post('/media-library/upload', [AdminMediaController::class, 'upload'])->name('admin.media.upload');
    Route::delete('/media-library', [AdminMediaController::class, 'bulkDestroy'])->name('admin.media.bulk-destroy');
    Route::patch('/media-library/{id}/category', [AdminMediaController::class, 'updateCategory'])->name('admin.media.category.update');
    Route::patch('/media-library/{id}/caption', [AdminMediaController::class, 'updateCaption'])->name('admin.media.caption.update');
    Route::delete('/media-library/{id}', [AdminMediaController::class, 'destroy'])->name('admin.media.destroy');
});
