EAGER LOADING AUDIT — Quick fixes to avoid N+1 queries

Overview
--------
This file lists controller/service locations where model queries may cause N+1 problems or would benefit from eager-loading. For each entry I recommend specific `with(...)` additions. Apply changes incrementally and run `npx tsc` / PHP unit tests where applicable.

High-value fixes
----------------
- `app/Http/Controllers/StoreController.php`
  - Line: product lists / related products (`related = Product::where('category_id', ...)`)
  - Recommendation: add `with(['category','variants'])` when returning product collections used in views.

- `app/Http/Controllers/AdminController.php`
  - Line: `$recentOrders = Order::with('user')->latest()->take(10)->get();` (good)
  - Line: other product/order counts are fine, but for product lists add `with('category')` where missing.

- `app/Http/Controllers/Api/LegacyBridgeController.php`
  - Several spots fetch `Product`, `Order`, `OrderItem`, `ProductVariant` in loops. Suggest:
    - When returning product lists: use `with('category','variants')`.
    - When returning orders: use `with(['user','items.product','items.product.variants'])`.
  - Specific lines: (examples from scan) near lines ~748, ~763, ~980, ~1090, ~1160 where orders and products are fetched inside loops.

- `app/Http/Controllers/AdminProductImportController.php`
  - Bulk lookups like `Product::withTrashed()->pluck('slug')` are ok; ensure any per-row `Product::where(...)` inside loops are batched (collect ids then query once).

- `app/Http/Controllers/AccountController.php`
  - `$orders = Order::where('user_id', $user->id)->with('items.product')->latest()->take(25)->get();` (already uses eager-loading) — no change.

Medium-value fixes
------------------
- `app/Http/Controllers/AdminController.php` customers listing: when loading customers and then per-customer orders, use `withCount('orders')` (already used) and eager load in single query when showing details.
- `app/Http/Controllers/StoreController.php` reviews: `Review::where('product_id', $product->id)->with('user')->latest()->take(10)->get();` (already uses with)

General recommendations
-----------------------
- Replace per-item queries inside loops with a single batched query using `whereIn` and `with(...)`.
- Use `withCount` for counts shown in listings rather than N queries (already used in some places: `withCount('products')`).
- Audit Blade partials (e.g., `resources/views/partials/product-card.blade.php`) to see which relations are accessed (category, variants, reviews) and ensure controllers return them eager-loaded.

Suggested next actions (one-by-one)
----------------------------------
1. Update `StoreController::index`/list methods to ensure product collections include `with(['category','variants'])` before paginate/get. (small)
2. Update `Api/LegacyBridgeController` endpoints that return orders/products to `with()` their relations. (medium)
3. Search for `->where('product_id',` within loops and batch them. (medium)
4. Run a quick load-test or profiler while browsing product lists to confirm reduced queries. (optional)

If you want, I can implement Step 1 now (edit `StoreController.php` to add recommended `with()` calls). Approve and I'll patch the file.
