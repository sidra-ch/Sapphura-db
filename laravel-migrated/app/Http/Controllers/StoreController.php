<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function home()
    {
        $categories = Category::withCount(['products' => fn ($q) => $q->where('status', 'active')])->orderBy('name')->get();
        $featured = Product::where('status', 'active')->where('is_featured', true)->with('category')->latest()->take(8)->get();
        $latest = Product::where('status', 'active')->with('category')->latest()->take(8)->get();
        return view('store.home', compact('categories', 'featured', 'latest'));
    }

    public function collections(Request $request)
    {
        $query = Product::where('status', 'active')->with('category');

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('name', $request->category));
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $sort = $request->get('sort', 'newest');
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            default => $query->orderByDesc('created_at'),
        };

        $products = $query->paginate(12)->withQueryString();
        $categories = Category::orderBy('name')->get();

        return view('store.collections', compact('products', 'categories'));
    }

    public function product(string $slug)
    {
        $product = Product::where('slug', $slug)->where('status', 'active')->with(['category', 'variants'])->firstOrFail();
        $reviews = Review::where('product_id', $product->id)->where('is_approved', true)->with('user')->latest('created_at')->take(10)->get();
        $related = Product::where('category_id', $product->category_id)->where('id', '!=', $product->id)->where('status', 'active')->take(4)->get();
        return view('store.product', compact('product', 'reviews', 'related'));
    }

    public function search(Request $request)
    {
        $q = $request->get('q', '');
        $products = collect();
        if (strlen($q) >= 2) {
            $products = Product::where('status', 'active')
                ->where(fn ($query) => $query->where('name', 'like', "%{$q}%")->orWhere('description', 'like', "%{$q}%"))
                ->with('category')->take(20)->get();
        }
        return view('store.search', compact('q', 'products'));
    }

    public function cart()
    {
        return view('store.cart');
    }

    public function checkout()
    {
        return view('store.checkout');
    }

    public function wishlist()
    {
        return view('store.wishlist');
    }

    public function orderConfirmation(Request $request)
    {
        return view('store.order-confirmation');
    }
}
