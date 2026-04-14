<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\AdminNotification;
use App\Models\Category;
use App\Models\Company;
use App\Models\Coupon;
use App\Models\InventoryLog;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\PaymentTransaction;
use App\Models\Permission;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Review;
use App\Models\Role;
use App\Models\Setting;
use App\Models\Subcategory;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    // ─── Helper: log activity ───
    private function logActivity(string $action, string $module, string $description, ?array $properties = null): void
    {
        ActivityLog::create([
            'admin_user_id' => Auth::id(),
            'action' => $action,
            'module' => $module,
            'description' => $description,
            'ip_address' => request()->ip(),
            'properties' => $properties,
        ]);
    }

    // ─── Helper: create notification ───
    private function notify(string $type, string $title, string $message, ?string $link = null): void
    {
        $adminIds = User::where('role', 'admin')->pluck('id');
        foreach ($adminIds as $id) {
            AdminNotification::create([
                'type' => $type, 'title' => $title, 'message' => $message,
                'link' => $link, 'user_id' => $id,
            ]);
        }
    }
    // ════════════════════════════════════════════
    // 1. DASHBOARD
    // ════════════════════════════════════════════
    public function dashboard()
    {
        $lowStockThreshold = (int) Setting::get('low_stock_threshold', 5);

        $stats = [
            'revenue' => Order::whereIn('status', ['delivered','completed'])->sum('total'),
            'products' => Product::count(),
            'featured' => Product::where('is_featured', true)->count(),
            'orders' => Order::count(),
            'pending' => Order::where('status', 'pending')->count(),
            'confirmed' => Order::where('status', 'confirmed')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
            'customers' => User::where('role', 'customer')->count(),
            'companies' => Company::count(),
            'reviews' => Review::count(),
            'lowStock' => Product::where('stock', '<', $lowStockThreshold)->where('stock', '>', 0)->where('status', 'active')->count(),
            'outOfStock' => Product::where('stock', 0)->where('status', 'active')->count(),
            'todayOrders' => Order::whereDate('created_at', today())->count(),
            'todayRevenue' => Order::whereDate('created_at', today())->whereIn('status', ['delivered','completed'])->sum('total'),
        ];

        $revenueChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $revenueChart[] = [
                'date' => $date->format('d M'),
                'revenue' => Order::whereDate('created_at', $date)->whereIn('status', ['delivered','completed','processing','shipped'])->sum('total'),
                'orders' => Order::whereDate('created_at', $date)->count(),
            ];
        }

        $statusDistribution = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')->pluck('count', 'status')->toArray();

        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select('products.id', 'products.name', 'products.images',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.price * order_items.quantity) as total_revenue'))
            ->groupBy('products.id', 'products.name', 'products.images')
            ->orderByDesc('total_sold')->limit(5)->get();

        $lowStockProducts = Product::where('stock', '<', $lowStockThreshold)->where('status', 'active')->orderBy('stock')->limit(5)->get();
        $recentOrders = Order::with('user')->latest()->take(10)->get();
        $unreadNotifications = AdminNotification::where('user_id', Auth::id())->unread()->count();

        return view('admin.dashboard', compact(
            'stats', 'recentOrders', 'revenueChart', 'statusDistribution',
            'topProducts', 'lowStockProducts', 'unreadNotifications'
        ));
    }

    // Products
    public function products(Request $request)
    {
        $query = Product::with('category');
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('stock')) {
            if ($request->stock === 'low') $query->where('stock', '<', 5);
            elseif ($request->stock === 'out') $query->where('stock', 0);
        }
        $products = $query->latest()->paginate(15)->withQueryString();
        $categories = Category::orderBy('name')->get();
        return view('admin.products', compact('products', 'categories'));
    }

    public function createProduct()
    {
        $categories = Category::orderBy('name')->get();
        return view('admin.product-form', ['product' => null, 'categories' => $categories]);
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
        ]);

        $images = $request->images ?? '[]';
        if (is_string($images) && !str_starts_with(trim($images), '[')) {
            $images = json_encode(array_filter(array_map('trim', explode("\n", $images))));
        }

        Product::create([
            'public_id' => (string) Str::uuid(),
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'price' => $request->price,
            'sale_price' => $request->sale_price,
            'sku' => $request->sku,
            'stock' => $request->stock ?? 0,
            'status' => $request->status ?? 'active',
            'is_featured' => $request->boolean('is_featured'),
            'images' => $images,
            'category_id' => $request->category_id,
        ]);

        return redirect('/admin/products')->with('success', 'Product created.');
    }

    public function editProduct(int $id)
    {
        $product = Product::findOrFail($id);
        $categories = Category::orderBy('name')->get();
        return view('admin.product-form', compact('product', 'categories'));
    }

    public function updateProduct(Request $request, int $id)
    {
        $product = Product::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
        ]);

        $images = $request->images ?? $product->images;
        if (is_string($images) && !str_starts_with(trim($images), '[')) {
            $images = json_encode(array_filter(array_map('trim', explode("\n", $images))));
        }

        $product->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'price' => $request->price,
            'sale_price' => $request->sale_price,
            'sku' => $request->sku,
            'stock' => $request->stock ?? $product->stock,
            'status' => $request->status ?? $product->status,
            'is_featured' => $request->boolean('is_featured'),
            'images' => $images,
            'category_id' => $request->category_id,
        ]);

        return redirect('/admin/products')->with('success', 'Product updated.');
    }

    public function deleteProduct(int $id)
    {
        Product::findOrFail($id)->delete();
        return redirect('/admin/products')->with('success', 'Product deleted.');
    }

    // Orders
    public function orders(Request $request)
    {
        $query = Order::with('user');
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('payment')) {
            $query->where('payment_method', $request->payment);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn ($q) => $q->where('public_id', 'like', "%{$s}%")
                ->orWhere('id', 'like', "%{$s}%")
                ->orWhere('shipping_name', 'like', "%{$s}%")
                ->orWhere('shipping_phone', 'like', "%{$s}%")
                ->orWhere('tracking_number', 'like', "%{$s}%")
                ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")));
        }
        $orders = $query->latest()->paginate(15)->withQueryString();
        return view('admin.orders', compact('orders'));
    }

    public function showOrder(int $id)
    {
        $order = Order::with(['user', 'items.product', 'paymentTransactions', 'statusHistory.changedByUser'])->findOrFail($id);
        return view('admin.order-detail', compact('order'));
    }

    public function updateOrderStatus(Request $request, int $id)
    {
        $order = Order::findOrFail($id);
        $oldStatus = $order->status;
        $newStatus = $request->status;

        $order->update(['status' => $newStatus]);

        // Log status change
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'from_status' => $oldStatus,
            'to_status' => $newStatus,
            'changed_by' => Auth::id(),
            'note' => $request->input('status_note'),
        ]);

        return back()->with('success', 'Order status updated to ' . ucfirst($newStatus) . '.');
    }

    public function updateOrderTracking(Request $request, int $id)
    {
        $order = Order::findOrFail($id);
        $order->update([
            'tracking_number' => $request->tracking_number,
            'tracking_carrier' => $request->tracking_carrier,
        ]);
        return back()->with('success', 'Tracking information updated.');
    }

    public function updateOrderNotes(Request $request, int $id)
    {
        $order = Order::findOrFail($id);
        $order->update(['admin_notes' => $request->admin_notes]);
        return back()->with('success', 'Notes saved.');
    }

    // Categories
    public function categories()
    {
        $categories = Category::withCount('products')->orderBy('name')->get();
        return view('admin.categories', compact('categories'));
    }

    public function storeCategory(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:categories,name']);
        Category::create(['name' => $request->name]);
        return back()->with('success', 'Category created.');
    }

    public function deleteCategory(int $id)
    {
        $category = Category::findOrFail($id);
        if ($category->products()->exists()) {
            return back()->with('error', 'Cannot delete category with products.');
        }
        $category->delete();
        return back()->with('success', 'Category deleted.');
    }

    // Customers
    public function customers(Request $request)
    {
        $query = User::withCount('orders')->withSum('orders', 'total');
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn ($q) => $q->where('name', 'like', "%{$s}%")
                ->orWhere('email', 'like', "%{$s}%")
                ->orWhere('phone', 'like', "%{$s}%"));
        }
        $customers = $query->latest()->paginate(15)->withQueryString();
        return view('admin.customers', compact('customers'));
    }

    public function showCustomer(int $id)
    {
        $customer = User::withCount('orders')->withSum('orders', 'total')->findOrFail($id);
        $orders = Order::where('user_id', $id)->latest()->paginate(10);
        return view('admin.customer-detail', compact('customer', 'orders'));
    }

    // Reviews
    public function reviews()
    {
        $reviews = Review::with(['user', 'product'])->latest('created_at')->paginate(15);
        return view('admin.reviews', compact('reviews'));
    }

    public function toggleReview(int $id)
    {
        $review = Review::findOrFail($id);
        $review->update(['is_approved' => !$review->is_approved]);
        return back()->with('success', $review->is_approved ? 'Review approved.' : 'Review hidden.');
    }

    public function deleteReview(int $id)
    {
        Review::findOrFail($id)->delete();
        return back()->with('success', 'Review deleted.');
    }

    // Coupons
    public function coupons()
    {
        $coupons = Coupon::latest()->paginate(15);
        return view('admin.coupons', compact('coupons'));
    }

    public function createCoupon()
    {
        return view('admin.coupon-form', ['coupon' => null]);
    }

    public function storeCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code',
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric|min:0',
        ]);

        Coupon::create([
            'code' => strtoupper(trim($request->code)),
            'description' => $request->description,
            'type' => $request->type,
            'value' => $request->value,
            'min_order' => $request->min_order ?? 0,
            'max_uses' => $request->max_uses,
            'valid_from' => $request->valid_from,
            'valid_until' => $request->valid_until,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect('/admin/coupons')->with('success', 'Coupon created.');
    }

    public function editCoupon(int $id)
    {
        $coupon = Coupon::findOrFail($id);
        return view('admin.coupon-form', compact('coupon'));
    }

    public function updateCoupon(Request $request, int $id)
    {
        $coupon = Coupon::findOrFail($id);
        $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code,' . $id,
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric|min:0',
        ]);

        $coupon->update([
            'code' => strtoupper(trim($request->code)),
            'description' => $request->description,
            'type' => $request->type,
            'value' => $request->value,
            'min_order' => $request->min_order ?? 0,
            'max_uses' => $request->max_uses,
            'valid_from' => $request->valid_from,
            'valid_until' => $request->valid_until,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect('/admin/coupons')->with('success', 'Coupon updated.');
    }

    public function deleteCoupon(int $id)
    {
        Coupon::findOrFail($id)->delete();
        return redirect('/admin/coupons')->with('success', 'Coupon deleted.');
    }

    // Settings
    public function settings()
    {
        return view('admin.settings');
    }
}
