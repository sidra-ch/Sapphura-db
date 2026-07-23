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
        $categories = Category::withCount(['products' => fn ($q) => $q->where('status', '=', 'active', 'and')])->orderBy('name', 'asc')->get();
        $featured = Product::where('status', '=', 'active', 'and')->where('is_featured', '=', true, 'and')->with(['category','variants'])->latest()->take(8)->get();
        $latest = Product::where('status', '=', 'active', 'and')->with(['category','variants'])->latest()->take(8)->get();
        return view('store.home', compact('categories', 'featured', 'latest'));
    }

    public function collections(Request $request)
    {
        $query = Product::where('status', '=', 'active', 'and')->with(['category','variants']);

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('name', '=', $request->category, 'and'));
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        if ($request->filled('search')) {
            $query->where(function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('on_sale')) {
            $query->whereNotNull('sale_price')->whereColumn('sale_price', '<', 'price');
        }

        $sort = $request->get('sort', 'newest');
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'best_sellers' => $query->where('is_featured', '=', true, 'and')->latest('created_at'),
            default => $query->orderByDesc('created_at'),
        };

        $products = $query->paginate(12)->withQueryString();
        $categories = Category::orderBy('name', 'asc')->get();

        return view('store.collections', compact('products', 'categories'));
    }

    public function product(string $slug)
    {
        $product = Product::where('slug', '=', $slug, 'and')->where('status', '=', 'active', 'and')->with(['category', 'variants'])->firstOrFail();
        $reviews = Review::where('product_id', '=', $product->id, 'and')->where('is_approved', '=', true, 'and')->with('user')->latest('created_at')->take(10)->get();
        $related = Product::where('category_id', '=', $product->category_id, 'and')->where('id', '!=', $product->id, 'and')->where('status', '=', 'active', 'and')->with(['category','variants'])->take(4)->get();
        return view('store.product', compact('product', 'reviews', 'related'));
    }

    public function search(Request $request)
    {
        $q = $request->get('q', '');
        $products = collect();
        if (strlen($q) >= 2) {
            $products = Product::where('status', '=', 'active', 'and')
                ->where(fn ($query) => $query->where('name', 'like', "%{$q}%", 'and')->orWhere('description', 'like', "%{$q}%"))
                ->with(['category','variants'])->take(20)->get();
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
