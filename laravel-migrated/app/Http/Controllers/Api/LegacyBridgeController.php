<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmationMail;
use App\Mail\OtpMail;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OtpVerification;
use App\Models\PaymentTransaction;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\User;
use App\Services\CloudinaryService;
use App\Services\PaymentProviderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class LegacyBridgeController extends Controller
{
    private function normalizeEmail(string $email): string
    {
        return strtolower(trim($email));
    }

    private function buildOtpProofToken(string $email, string $purpose): string
    {
        $payload = [
            'email' => $email,
            'purpose' => $purpose,
            'scope' => 'payment-otp-proof',
            'exp' => time() + (15 * 60),
        ];
        $body = base64_encode(json_encode($payload));
        $sig = hash_hmac('sha256', $body, (string) env('JWT_SECRET', 'dev-only-sapphura-secret'));
        return $body.'.'.$sig;
    }

    private function verifyOtpProofToken(string $token): ?array
    {
        $parts = explode('.', $token, 2);
        if (count($parts) !== 2) {
            return null;
        }
        [$body, $sig] = $parts;
        $expected = hash_hmac('sha256', $body, (string) env('JWT_SECRET', 'dev-only-sapphura-secret'));
        if (! hash_equals($expected, $sig)) {
            return null;
        }
        $decoded = json_decode(base64_decode($body) ?: '{}', true);
        if (! is_array($decoded) || ($decoded['scope'] ?? '') !== 'payment-otp-proof') {
            return null;
        }
        if (($decoded['exp'] ?? 0) < time()) {
            return null;
        }
        return $decoded;
    }

    public function authDeprecated(): JsonResponse
    {
        return response()->json([
            'error' => 'Legacy auth endpoint has been disabled. Use Clerk routes /sign-in and /sign-up.',
            'signInUrl' => '/sign-in',
            'signUpUrl' => '/sign-up',
        ], 410);
    }

    public function usersIndex(): JsonResponse
    {
        $users = User::query()->orderByDesc('created_at')->get();

        return response()->json([
            'users' => $users->map(fn (User $u) => [
                'id' => $u->public_id ?: (string) $u->id,
                'legacyId' => $u->id,
                'email' => $u->email,
                'name' => $u->name,
                'phone' => $u->phone,
                'role' => $u->role,
                'isActive' => (bool) $u->is_active,
                'createdAt' => $u->created_at,
                'updatedAt' => $u->updated_at,
            ]),
        ]);
    }

    public function usersStore(Request $request): JsonResponse
    {
        $email = strtolower(trim((string) $request->input('email', '')));
        if ($email === '') {
            return response()->json(['error' => 'Email is required.'], 400);
        }

        if (User::where('email', $email)->exists()) {
            return response()->json(['error' => 'A user with this email already exists.'], 409);
        }

        $user = User::create([
            'public_id' => (string) Str::uuid(),
            'email' => $email,
            'name' => trim((string) $request->input('name', '')) ?: null,
            'phone' => trim((string) $request->input('phone', '')) ?: null,
            'password' => 'admin-created-'.time(),
            'role' => 'customer',
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->public_id ?: (string) $user->id,
                'legacyId' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'phone' => $user->phone,
                'role' => $user->role,
                'isActive' => (bool) $user->is_active,
                'createdAt' => $user->created_at,
                'updatedAt' => $user->updated_at,
            ],
        ]);
    }

    public function otpChannels(): JsonResponse
    {
        return response()->json([
            'channels' => ['email' => true, 'sms' => false, 'whatsapp' => false],
            'missing' => ['base' => ['Twilio removed'], 'sms' => ['Twilio removed'], 'whatsapp' => ['Twilio removed']],
            'notes' => ['whatsappFrom' => 'disabled', 'smsFrom' => 'disabled'],
        ]);
    }

    public function otp(Request $request): JsonResponse
    {
        $action = (string) $request->input('action', '');
        $purpose = (string) $request->input('purpose', 'payment');
        $purposeKey = 'payment:'.strtolower($purpose);
        $email = $this->normalizeEmail((string) $request->input('email', ''));
        $phone = preg_replace('/\D+/', '', (string) $request->input('phone', ''));
        $identity = $email !== '' ? $email : ($phone ? "phone-{$phone}@otp.local" : '');

        if ($identity === '') {
            return response()->json(['error' => 'Email or phone is required'], 400);
        }

        $user = User::firstOrCreate(
            ['email' => $identity],
            [
                'public_id' => (string) Str::uuid(),
                'password' => Hash::make('guest-'.microtime(true)),
                'role' => 'customer',
                'is_active' => false,
            ]
        );

        if ($action === 'send') {
            $otp = (string) random_int(100000, 999999);
            $expiresAt = now()->addMinutes(10);

            OtpVerification::where('user_id', $user->id)
                ->where('purpose', $purposeKey)
                ->whereNull('consumed_at')
                ->update(['consumed_at' => now()]);

            OtpVerification::create([
                'user_id' => $user->id,
                'otp_hash' => Hash::make($otp),
                'purpose' => $purposeKey,
                'expires_at' => $expiresAt,
                'attempts' => 0,
                'created_at' => now(),
            ]);

            // Actually send the OTP email
            $customerName = $user->name ?? explode('@', $identity)[0];
            try {
                Mail::to($identity)->send(new OtpMail($otp, $customerName));
                $emailSent = true;
            } catch (\Throwable $e) {
                Log::error('OTP email failed', ['email' => $identity, 'error' => $e->getMessage()]);
                $emailSent = false;
            }

            return response()->json([
                'success' => true,
                'message' => $emailSent ? 'OTP sent via email' : 'OTP created but email delivery failed',
                'identity' => $identity,
                'requestedChannel' => 'email',
                'effectiveChannel' => 'email',
                'channels' => ['email'],
                'delivery' => [['channel' => 'email', 'sent' => $emailSent]],
                'expiry' => $expiresAt->toISOString(),
                'requestId' => $user->id,
                'debugOtp' => app()->environment('local') ? $otp : null,
            ]);
        }

        if ($action === 'verify') {
            $otp = (string) $request->input('otp', '');
            if ($otp === '') {
                return response()->json(['error' => 'OTP is required'], 400);
            }

            $record = OtpVerification::where('user_id', $user->id)
                ->where('purpose', $purposeKey)
                ->whereNull('consumed_at')
                ->orderByDesc('id')
                ->first();

            if (! $record) {
                return response()->json(['error' => 'No active OTP request found'], 404);
            }
            if ($record->expires_at->isPast()) {
                return response()->json(['error' => 'OTP expired. Please request a new code.'], 400);
            }
            if ($record->attempts >= 5) {
                return response()->json(['error' => 'Too many attempts. Please request a new OTP.'], 429);
            }
            if (! Hash::check($otp, $record->otp_hash)) {
                $record->increment('attempts');
                return response()->json(['error' => 'Invalid OTP. 0 attempts remaining.'], 400);
            }

            $record->consumed_at = now();
            $record->attempts = $record->attempts + 1;
            $record->save();

            return response()->json([
                'success' => true,
                'message' => 'OTP verified successfully',
                'orderId' => $request->input('orderId') ?: null,
                'identity' => $identity,
                'verificationToken' => $this->buildOtpProofToken($identity, $purposeKey),
            ]);
        }

        return response()->json(['error' => 'Invalid action'], 400);
    }

    public function categoriesIndex(): JsonResponse
    {
        $categories = Category::query()->withCount(['products' => fn ($q) => $q->where('status', 'active')])->orderBy('name')->get();

        return response()->json([
            'categories' => $categories->map(fn (Category $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'products' => $c->products_count,
                'image' => null,
            ]),
        ]);
    }

    public function productsIndex(Request $request): JsonResponse
    {
        $query = Product::query()->where('status', 'active')->with('category')->orderByDesc('created_at');
        if ($request->query('featured') === '1') {
            $query->where('is_featured', true);
        }
        if ($slug = trim((string) $request->query('slug', ''))) {
            $query->where('slug', $slug);
        }
        if ($limit = (int) $request->query('limit', 0)) {
            $query->limit($limit);
        }

        $products = $query->get();

        return response()->json([
            'products' => $products->map(fn (Product $p) => [
                'id' => $p->public_id ?: (string) $p->id,
                'legacyId' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'description' => $p->description,
                'price' => (float) $p->price,
                'salePrice' => $p->sale_price !== null ? (float) $p->sale_price : null,
                'stock' => $p->stock,
                'status' => $p->status,
                'isFeatured' => (bool) $p->is_featured,
                'category' => optional($p->category)->name ?: '',
                'categoryId' => $p->category_id,
                'inStock' => $p->stock > 0,
                'rating' => 0,
                'reviews' => 0,
                'images' => json_decode($p->images ?: '[]', true) ?: [],
                'image' => (json_decode($p->images ?: '[]', true)[0] ?? null),
                'createdAt' => $p->created_at,
            ]),
        ]);
    }

    public function productsStore(Request $request): JsonResponse
    {
        $name = trim((string) $request->input('name', ''));
        $description = trim((string) $request->input('description', ''));
        $price = (float) $request->input('price');
        $categoryId = (int) $request->input('categoryId');
        if ($name === '' || $description === '' || $price <= 0 || $categoryId <= 0) {
            return response()->json(['error' => 'name, description, price, and categoryId are required'], 400);
        }

        $category = Category::find($categoryId);
        if (! $category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $product = Product::create([
            'public_id' => (string) Str::uuid(),
            'name' => $name,
            'slug' => Str::slug($name).'-'.time(),
            'description' => $description,
            'price' => $price,
            'sale_price' => $request->filled('salePrice') ? (float) $request->input('salePrice') : null,
            'stock' => (int) $request->input('stock', 0),
            'status' => 'active',
            'is_featured' => (bool) $request->boolean('isFeatured'),
            'images' => json_encode(array_values(array_merge($request->input('imageUrls', []), $request->input('videoUrls', [])))),
            'category_id' => $categoryId,
        ]);

        return response()->json(['success' => true, 'product' => ['id' => $product->public_id ?: (string) $product->id, 'legacyId' => $product->id, 'name' => $product->name, 'slug' => $product->slug, 'image' => null, 'images' => json_decode($product->images ?: '[]', true), 'category' => $category->name]]);
    }

    public function productsUpdate(Request $request, string $id): JsonResponse
    {
        $product = Product::where('public_id', $id)->orWhere('id', $id)->first();
        if (! $product) {
            return response()->json(['error' => 'Invalid product ID'], 400);
        }
        $updates = [];
        foreach (['name', 'description', 'status'] as $field) {
            if ($request->has($field)) {
                $updates[$field] = (string) $request->input($field);
            }
        }
        foreach (['price', 'salePrice', 'stock', 'categoryId'] as $field) {
            if ($request->has($field)) {
                $value = $request->input($field);
                if ($field === 'salePrice') {
                    $updates['sale_price'] = $value === null || $value === '' ? null : (float) $value;
                } elseif ($field === 'categoryId') {
                    $updates['category_id'] = (int) $value;
                } else {
                    $updates[strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $field))] = is_numeric($value) ? $value + 0 : $value;
                }
            }
        }
        if ($request->has('isFeatured')) {
            $updates['is_featured'] = (bool) $request->boolean('isFeatured');
        }
        if ($request->has('imageUrls') || $request->has('videoUrls')) {
            $updates['images'] = json_encode(array_values(array_merge($request->input('imageUrls', []), $request->input('videoUrls', []))));
        }
        if (empty($updates)) {
            return response()->json(['error' => 'No valid fields provided for update'], 400);
        }
        $product->update($updates);
        $product->refresh();
        return response()->json(['success' => true, 'product' => ['id' => $product->public_id ?: (string) $product->id, 'legacyId' => $product->id, 'name' => $product->name, 'slug' => $product->slug, 'description' => $product->description, 'price' => $product->price, 'salePrice' => $product->sale_price, 'stock' => $product->stock, 'status' => $product->status, 'isFeatured' => (bool) $product->is_featured, 'categoryId' => $product->category_id, 'images' => json_decode($product->images ?: '[]', true)]]);
    }

    public function productsDestroy(string $id): JsonResponse
    {
        $product = Product::where('public_id', $id)->orWhere('id', $id)->first();
        if (! $product) {
            return response()->json(['error' => 'Invalid product ID'], 400);
        }
        if (OrderItem::where('product_id', $product->id)->exists()) {
            return response()->json(['error' => 'Cannot delete product that exists in orders. Set status to inactive instead.'], 409);
        }
        $product->delete();
        return response()->json(['success' => true]);
    }
    public function productsImportCloudinary(Request $request): JsonResponse
    {
        try {
            if (!CloudinaryService::configured()) {
                return response()->json(['error' => 'Cloudinary credentials are not configured'], 500);
            }

            $dryRun = $request->input('dryRun', true) !== false;
            $rawPrefix = (string) ($request->input('prefix', '') ?? '');
            $prefix = ($rawPrefix && strtolower(trim($rawPrefix)) !== 'all') ? trim($rawPrefix) : null;
            $defaultPrice = (float) ($request->input('defaultPrice', 99) ?? 99);
            $defaultStock = (int) ($request->input('defaultStock', 1) ?? 1);
            $status = strtolower((string) ($request->input('status', 'active') ?? 'active'));

            if (!is_finite($defaultPrice) || $defaultPrice <= 0) {
                return response()->json(['error' => 'defaultPrice must be greater than zero'], 400);
            }
            if ($defaultStock < 0) {
                return response()->json(['error' => 'defaultStock must be a non-negative integer'], 400);
            }
            if (!in_array($status, ['active', 'inactive', 'draft'])) {
                return response()->json(['error' => 'status must be active, inactive, or draft'], 400);
            }

            $assets = CloudinaryService::listAssets($prefix);
            $categories = Category::orderBy('id')->get();
            $existingProducts = Product::select('id', 'slug', 'images')->get();

            $categoryIdByName = $categories->pluck('id', 'name')->all();
            $existingSlugs = $existingProducts->pluck('slug')->flip()->all();

            $libraryAssets = [];
            foreach (($assets['images'] ?? []) as $asset) {
                $libraryAssets[] = ['publicId' => $asset['public_id'], 'url' => $asset['secure_url'], 'type' => 'image'];
            }
            foreach (($assets['videos'] ?? []) as $asset) {
                $libraryAssets[] = ['publicId' => $asset['public_id'], 'url' => $asset['secure_url'], 'type' => 'video'];
            }

            // Group by normalized key
            $groups = [];
            foreach ($libraryAssets as $asset) {
                $key = $this->normalizeAssetKey($asset['publicId']);
                $groups[$key][] = $asset;
            }

            // Match existing products
            $claimedGroupKeys = [];
            $productMatches = [];
            foreach ($existingProducts as $product) {
                $currentMedia = json_decode($product->images ?: '[]', true) ?: [];
                $groupKeys = array_unique(array_filter(
                    array_map(fn ($url) => $this->getMediaReferenceKey($url), $currentMedia),
                    fn ($key) => isset($groups[$key])
                ));
                $matchedMedia = [];
                foreach ($groupKeys as $gk) {
                    foreach (($groups[$gk] ?? []) as $m) {
                        $matchedMedia[] = $m;
                    }
                }
                $nextMediaUrls = $this->getUniqueMediaUrls($matchedMedia);
                $currentMediaUrls = array_values(array_unique($currentMedia));

                foreach ($groupKeys as $gk) {
                    $claimedGroupKeys[$gk] = true;
                }

                if (count($groupKeys) > 0) {
                    $productMatches[] = [
                        'id' => $product->id,
                        'slug' => $product->slug,
                        'groupKeys' => $groupKeys,
                        'currentMediaUrls' => $currentMediaUrls,
                        'nextMediaUrls' => $nextMediaUrls,
                        'needsUpdate' => count($nextMediaUrls) > 0 && json_encode($currentMediaUrls) !== json_encode($nextMediaUrls),
                    ];
                }
            }

            $relinkableProducts = array_filter($productMatches, fn ($p) => $p['needsUpdate']);
            $alreadyLinkedProducts = array_filter($productMatches, fn ($p) => !$p['needsUpdate']);

            $existingMediaUrls = [];
            foreach ($productMatches as $pm) {
                foreach ($pm['nextMediaUrls'] as $url) {
                    $existingMediaUrls[$url] = true;
                }
            }

            $importableGroups = [];
            foreach ($groups as $normalizedKey => $media) {
                $uniqueMedia = [];
                $seenUrls = [];
                foreach ($media as $asset) {
                    if (!isset($seenUrls[$asset['url']])) {
                        $seenUrls[$asset['url']] = true;
                        $uniqueMedia[] = $asset;
                    }
                }

                $alreadyLinked = isset($claimedGroupKeys[$normalizedKey]) || count(array_filter($uniqueMedia, fn ($a) => !isset($existingMediaUrls[$a['url']]))) === 0;
                if ($alreadyLinked) continue;

                $categoryName = $this->inferCategoryName($normalizedKey);
                $categoryId = $categoryIdByName[$categoryName] ?? ($categories[0]->id ?? null);
                $assetBaseName = $this->getAssetBaseName($uniqueMedia[0]['publicId'] ?? $normalizedKey);
                $name = $this->buildDisplayName($assetBaseName);
                if (!$name || !$categoryId) continue;

                $slug = Str::slug($name) ?: "product-{$normalizedKey}";
                $suffix = 1;
                while (isset($existingSlugs[$slug])) {
                    $slug = (Str::slug($name) ?: 'product') . "-{$suffix}";
                    $suffix++;
                }

                $importableGroups[] = [
                    'normalizedKey' => $normalizedKey,
                    'name' => $name,
                    'slug' => $slug,
                    'categoryName' => $categoryName,
                    'categoryId' => $categoryId,
                    'media' => $uniqueMedia,
                ];
            }

            if ($dryRun) {
                return response()->json([
                    'mode' => 'dry-run',
                    'totalAssets' => count($libraryAssets),
                    'groupedAssets' => count($groups),
                    'existingMatchedAssets' => count(array_filter($libraryAssets, fn ($a) => isset($existingMediaUrls[$a['url']]))),
                    'matchedExistingProducts' => count($productMatches),
                    'relinkableProducts' => count($relinkableProducts),
                    'alreadyLinkedProducts' => count($alreadyLinkedProducts),
                    'importableGroups' => count($importableGroups),
                    'importableAssetCount' => array_sum(array_map(fn ($g) => count($g['media']), $importableGroups)),
                    'sample' => array_map(fn ($g) => [
                        'name' => $g['name'],
                        'slug' => $g['slug'],
                        'category' => $g['categoryName'],
                        'mediaCount' => count($g['media']),
                    ], array_slice($importableGroups, 0, 20)),
                ]);
            }

            // Relink existing products
            foreach ($relinkableProducts as $pm) {
                Product::where('id', $pm['id'])->update([
                    'images' => json_encode($pm['nextMediaUrls']),
                ]);
            }

            // Create new products
            $createdProducts = [];
            foreach ($importableGroups as $group) {
                $created = Product::create([
                    'public_id' => (string) Str::uuid(),
                    'name' => $group['name'],
                    'slug' => $group['slug'],
                    'description' => $group['name'] . ' imported from Cloudinary media library.',
                    'price' => $defaultPrice,
                    'stock' => $defaultStock,
                    'status' => $status,
                    'category_id' => $group['categoryId'],
                    'images' => json_encode(array_column($group['media'], 'url')),
                ]);

                $createdProducts[] = [
                    'id' => $created->id,
                    'slug' => $created->slug,
                    'name' => $created->name,
                    'mediaCount' => count($group['media']),
                ];
            }

            return response()->json([
                'mode' => 'import',
                'relinked' => count($relinkableProducts),
                'created' => count($createdProducts),
                'products' => array_slice($createdProducts, 0, 50),
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ----- Cloudinary import helpers -----

    private function getAssetBaseName(string $publicId): string
    {
        $leaf = last(explode('/', $publicId)) ?: $publicId;
        return preg_replace('/_[a-z0-9]{5,}$/i', '', preg_replace('/\.[a-z0-9]+$/i', '', $leaf));
    }

    private function normalizeAssetKey(string $publicId): string
    {
        return strtolower(preg_replace('/[^a-z0-9]+/i', '', $this->getAssetBaseName($publicId)));
    }

    private function buildDisplayName(string $assetBaseName): string
    {
        if (preg_match('/^[a-z0-9]{16,}$/i', $assetBaseName) && !preg_match('/[-_\s]/', $assetBaseName)) {
            return '';
        }

        $name = preg_replace('/([a-z])([0-9])/i', '$1 $2', $assetBaseName);
        $name = preg_replace('/([0-9])([a-z])/i', '$1 $2', $name);
        $name = preg_replace('/[_-]+/', ' ', $name);
        $name = preg_replace('/\b(vdo|video)\b/i', 'Video', $name);
        $name = preg_replace('/\s+/', ' ', trim($name));

        return collect(explode(' ', $name))
            ->filter()
            ->map(fn ($part) => ucfirst($part))
            ->implode(' ');
    }

    private function inferCategoryName(string $normalizedKey): string
    {
        if (preg_match('/(abaya)/i', $normalizedKey)) return 'Abaya';
        if (preg_match('/(makeup|perfume|beauty)/i', $normalizedKey)) return 'Makeup';
        if (preg_match('/(hair|accessor)/i', $normalizedKey)) return 'Accessories';
        if (preg_match('/(suit|cloth|clothes|summer|winter|shawl|saree|eid|stitch)/i', $normalizedKey)) return 'Clothing';
        return 'Jewelry';
    }

    private function getMediaReferenceKey(string $mediaUrl): string
    {
        return $this->normalizeAssetKey(explode('?', $mediaUrl)[0] ?? $mediaUrl);
    }

    private function getUniqueMediaUrls(array $media): array
    {
        $seen = [];
        $result = [];
        foreach ($media as $asset) {
            if (!isset($seen[$asset['url']])) {
                $seen[$asset['url']] = true;
                $result[] = $asset['url'];
            }
        }
        return $result;
    }
    public function ordersIndex(): JsonResponse
    {
        return response()->json(['orders' => Order::query()->with('user')->orderByDesc('created_at')->get()]);
    }

    public function ordersStore(Request $request): JsonResponse
    {
        $email = $this->normalizeEmail((string) $request->input('email', ''));
        $phone = (string) $request->input('phone', '');
        $identity = $email !== '' ? $email : ('phone-'.preg_replace('/\D+/', '', $phone).'@otp.local');
        $token = (string) data_get($request->input('paymentVerification', []), 'otpVerificationToken', '');
        $proof = $this->verifyOtpProofToken($token);
        if (! $proof || ($proof['email'] ?? '') !== $identity) {
            return response()->json(['error' => 'Invalid payment OTP verification proof'], 400);
        }

        $items = collect($request->input('items', []));
        if ($items->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        $user = User::firstOrCreate(
            ['email' => $identity],
            ['public_id' => (string) Str::uuid(), 'password' => Hash::make('guest-'.microtime(true)), 'role' => 'customer']
        );

        $order = DB::transaction(function () use ($request, $items, $user) {
            $order = Order::create([
                'public_id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'total' => (float) $request->input('total', 0),
                'discount' => (float) $request->input('discount', 0),
                'discount_code' => $request->input('discountCode'),
                'shipping_cost' => (float) $request->input('shippingCost', 0),
                'status' => $request->input('paymentMethod') === 'card' ? 'paid' : 'pending',
                'payment_status' => $request->input('paymentMethod') === 'card' ? 'paid' : 'pending',
                'payment_method' => (string) $request->input('paymentMethod', 'cod'),
                'shipping_name' => trim((string) $request->input('firstName', '').' '.$request->input('lastName', '')),
                'shipping_phone' => (string) $request->input('phone', ''),
                'shipping_address' => (string) $request->input('address', ''),
                'shipping_city' => (string) $request->input('city', ''),
                'shipping_postal_code' => (string) $request->input('postalCode', ''),
                'shipping_country' => (string) $request->input('country', 'Pakistan'),
                'notes' => null,
            ]);

            foreach ($items as $item) {
                $product = Product::where('public_id', data_get($item, 'id'))
                    ->orWhere('id', data_get($item, 'id'))
                    ->first();
                if (! $product) {
                    continue;
                }
                $qty = (int) data_get($item, 'quantity', 1);
                $price = (float) data_get($item, 'price', $product->sale_price ?: $product->price);
                OrderItem::create(['order_id' => $order->id, 'product_id' => $product->id, 'quantity' => $qty, 'price' => $price]);
                $product->stock = max(0, (int) $product->stock - $qty);
                $product->save();
            }
            return $order;
        });

        return response()->json(['success' => true, 'order' => ['id' => $order->public_id ?: (string) $order->id, 'legacyId' => $order->id, 'total' => $order->total, 'status' => $order->status, 'paymentStatus' => $order->payment_status]]);
    }

    public function ordersUpdate(Request $request, string $id): JsonResponse
    {
        $order = Order::where('public_id', $id)->orWhere('id', $id)->first();
        if (! $order) {
            return response()->json(['error' => 'Invalid order ID'], 400);
        }
        $updates = [];
        if ($request->filled('status')) {
            $updates['status'] = strtolower((string) $request->input('status'));
        }
        if ($request->filled('paymentStatus')) {
            $updates['payment_status'] = strtolower((string) $request->input('paymentStatus'));
        }
        if (empty($updates)) {
            return response()->json(['error' => 'No valid fields provided for update'], 400);
        }
        $order->update($updates);
        return response()->json(['success' => true, 'order' => $order]);
    }

    public function orderStatus(string $id): JsonResponse
    {
        $order = Order::where('public_id', $id)->orWhere('id', $id)->first();
        if (! $order) {
            return response()->json(['error' => 'Order not found'], 404);
        }
        $latestTransaction = PaymentTransaction::where('order_id', $order->id)->latest()->first(['provider', 'status', 'merchant_reference', 'updated_at']);
        return response()->json(['success' => true, 'order' => ['id' => $order->public_id ?: (string) $order->id, 'legacyId' => $order->id, 'status' => $order->status, 'paymentStatus' => $order->payment_status, 'paymentMethod' => $order->payment_method, 'updatedAt' => $order->updated_at], 'latestTransaction' => $latestTransaction]);
    }
    public function paymentProviders(): JsonResponse { return response()->json(['providers' => ['jazzcash' => ['available' => (bool) env('JAZZCASH_INITIATE_URL')], 'easypaisa' => ['available' => (bool) env('EASYPAISA_INITIATE_URL')]]]); }
    public function paymentInitiate(Request $request): JsonResponse
    {
        $provider = (string) $request->input('provider', '');
        $orderRef = (string) $request->input('orderId', '');
        $order = Order::where('public_id', $orderRef)->orWhere('id', $orderRef)->first();
        if (! in_array($provider, ['jazzcash', 'easypaisa'], true)) {
            return response()->json(['error' => 'Unsupported payment provider'], 400);
        }
        if (! $order) {
            return response()->json(['error' => 'Order not found'], 404);
        }
        $tx = PaymentTransaction::create([
            'order_id' => $order->id,
            'provider' => $provider,
            'merchant_reference' => strtoupper($provider).'-'.$order->id.'-'.time(),
            'amount' => (float) $request->input('amount', $order->total),
            'currency' => 'PKR',
            'status' => 'initiated',
            'request_payload' => $request->all(),
        ]);
        return response()->json(['success' => true, 'transaction' => ['id' => $tx->id, 'merchantReference' => $tx->merchant_reference, 'provider' => $tx->provider, 'status' => $tx->status, 'paymentUrl' => null, 'returnUrl' => rtrim((string) env('APP_URL'), '/').'/order-confirmation?order='.$orderRef]]);
    }

    public function paymentStatus(Request $request): JsonResponse
    {
        $key = $request->header('x-payment-debug-key');
        $expected = env('PAYMENT_DEBUG_KEY') ?: env('PAYMENT_RECONCILE_KEY');
        if (! $expected || $key !== $expected) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $query = PaymentTransaction::query()->latest()->limit(50);
        if ($ref = trim((string) $request->query('merchantReference', ''))) {
            $query->where('merchant_reference', $ref);
        }
        if ($provider = trim((string) $request->query('provider', ''))) {
            $query->where('provider', $provider);
        }
        if ($orderId = (int) $request->query('orderId', 0)) {
            $query->where('order_id', $orderId);
        }
        $transactions = $query->get();
        return response()->json(['success' => true, 'count' => $transactions->count(), 'transactions' => $transactions]);
    }
    private static function mapOrderState(string $status): array
    {
        if ($status === 'paid') {
            return ['payment_status' => 'paid', 'status' => 'paid'];
        }
        if ($status === 'failed') {
            return ['payment_status' => 'failed', 'status' => 'pending'];
        }
        return ['payment_status' => 'pending', 'status' => 'pending'];
    }

    private static function mapStripeIntentStatus(string $status): string
    {
        if ($status === 'succeeded') return 'paid';
        if (in_array($status, ['canceled', 'requires_payment_method'])) return 'failed';
        return 'pending';
    }

    private static function parseStockPlan(?string $notes): array
    {
        $rawPlan = collect(explode(' | ', (string) $notes))
            ->first(fn ($entry) => str_starts_with($entry, 'stock_plan:'));

        if (!$rawPlan) {
            return [];
        }

        $serializedEntries = trim(substr($rawPlan, strlen('stock_plan:')));
        if ($serializedEntries === '') {
            return [];
        }

        return collect(explode(',', $serializedEntries))
            ->map(function ($entry) {
                $parts = explode(':', $entry);
                return [
                    'productId' => (int) ($parts[0] ?? 0),
                    'variantId' => !empty($parts[1]) ? (int) $parts[1] : null,
                    'quantity' => (int) ($parts[2] ?? 0),
                ];
            })
            ->filter(fn ($e) => $e['productId'] > 0 && $e['quantity'] > 0)
            ->values()
            ->all();
    }

    private function sendOrderConfirmationEmail(Order $order): void
    {
        try {
            $order->load(['user', 'items.product']);
            $customerEmail = $order->user->email ?? '';
            if ($customerEmail && !str_ends_with($customerEmail, '@otp.local')) {
                $items = $order->items->map(fn ($i) => [
                    'name' => $i->product->name ?? 'Product',
                    'quantity' => $i->quantity,
                    'price' => $i->price,
                ])->all();

                Mail::to($customerEmail)->send(new OrderConfirmationMail(
                    $order->public_id ?: (string) $order->id,
                    $order->user->name ?? 'Customer',
                    (float) $order->total,
                    $items,
                    $order->shipping_address ?? '',
                ));
            }
        } catch (\Throwable $e) {
            Log::error('Order confirmation email error: ' . $e->getMessage());
        }
    }

    public function paymentReconcile(Request $request): JsonResponse
    {
        $reconcileKey = $request->header('x-reconcile-key');
        $expected = env('PAYMENT_RECONCILE_KEY');
        if (!$expected || $reconcileKey !== $expected) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $pending = PaymentTransaction::whereIn('status', ['initiated', 'pending'])
                ->orderBy('created_at', 'asc')
                ->limit(100)
                ->get();

            $updated = [];

            foreach ($pending as $transaction) {
                $provider = $transaction->provider;
                if (!in_array($provider, ['jazzcash', 'easypaisa'])) {
                    continue;
                }

                $result = PaymentProviderService::reconcilePayment($provider, $transaction->merchant_reference);
                $orderState = self::mapOrderState($result['status']);

                DB::transaction(function () use ($transaction, $result, $orderState) {
                    /** @var PaymentTransaction $transaction */
                    // If paid, decrement stock
                    if ($result['status'] === 'paid') {
                        $order = Order::where('id', $transaction->order_id)
                            ->select('id', 'notes', 'payment_status')
                            ->first();

                        if ($order && $order->payment_status !== 'paid') {
                            foreach (self::parseStockPlan($order->notes) as $entry) {
                                if ($entry['variantId']) {
                                    ProductVariant::where('id', $entry['variantId'])
                                        ->decrement('stock', $entry['quantity']);
                                }
                                Product::where('id', $entry['productId'])
                                    ->decrement('stock', $entry['quantity']);
                            }
                        }
                    }

                    $transaction->update([
                        'status' => $result['status'],
                        'response_payload' => $result['raw'],
                        'reconciled_at' => now(),
                    ]);

                    Order::where('id', $transaction->order_id)->update($orderState);
                });

                $updated[] = [
                    'id' => $transaction->id,
                    'merchantReference' => $transaction->merchant_reference,
                    'status' => $result['status'],
                ];
            }

            return response()->json(['success' => true, 'processed' => count($updated), 'updated' => $updated]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function paymentWebhookStripe(Request $request): JsonResponse
    {
        try {
            $secretKey = env('STRIPE_SECRET_KEY');
            $webhookSecret = env('STRIPE_WEBHOOK_SECRET');

            if (!$secretKey) {
                return response()->json(['error' => 'Stripe is not configured'], 500);
            }
            if (!$webhookSecret) {
                return response()->json(['error' => 'STRIPE_WEBHOOK_SECRET is not configured'], 500);
            }

            $signature = $request->header('stripe-signature');
            if (!$signature) {
                return response()->json(['error' => 'Missing stripe-signature header'], 400);
            }

            $rawBody = $request->getContent();

            try {
                $event = \Stripe\Webhook::constructEvent($rawBody, $signature, $webhookSecret);
            } catch (\Throwable $e) {
                return response()->json(['error' => 'Invalid webhook signature'], 401);
            }

            $allowedEvents = [
                'payment_intent.succeeded',
                'payment_intent.payment_failed',
                'payment_intent.canceled',
            ];

            if (!in_array($event->type, $allowedEvents)) {
                return response()->json(['success' => true, 'ignored' => true, 'eventType' => $event->type]);
            }

            $intent = $event->data->object;
            $providerStatus = self::mapStripeIntentStatus($intent->status);

            $transaction = PaymentTransaction::where('provider', 'stripe')
                ->where('provider_transaction_id', $intent->id)
                ->orderByDesc('id')
                ->first();

            if (!$transaction) {
                return response()->json(['success' => true, 'ignored' => true, 'reason' => 'transaction_not_found']);
            }

            if ($transaction->status === $providerStatus && $transaction->reconciled_at) {
                return response()->json(['success' => true, 'idempotent' => true, 'status' => $providerStatus]);
            }

            $orderState = self::mapOrderState($providerStatus);

            DB::transaction(function () use ($transaction, $providerStatus, $event, $intent, $orderState) {
                $transaction->update([
                    'status' => $providerStatus,
                    'callback_payload' => [
                        'eventId' => $event->id,
                        'eventType' => $event->type,
                        'paymentIntentId' => $intent->id,
                        'paymentIntentStatus' => $intent->status,
                    ],
                    'response_payload' => json_decode(json_encode($intent), true),
                    'signature_valid' => true,
                    'reconciled_at' => now(),
                ]);

                Order::where('id', $transaction->order_id)->update($orderState);
            });

            if ($providerStatus === 'paid') {
                $order = Order::find($transaction->order_id);
                if ($order) {
                    $this->sendOrderConfirmationEmail($order);
                }
            }

            return response()->json(['success' => true, 'status' => $providerStatus]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function paymentWebhookJazzcash(Request $request): JsonResponse
    {
        return $this->handleWalletWebhook($request, 'jazzcash');
    }

    public function paymentWebhookEasypaisa(Request $request): JsonResponse
    {
        return $this->handleWalletWebhook($request, 'easypaisa');
    }

    private function handleWalletWebhook(Request $request, string $provider): JsonResponse
    {
        try {
            $rawBody = $request->getContent();
            $signature = $request->header('x-signature');
            $signatureTimestamp = $request->header('x-signature-timestamp') ?: $request->header('x-timestamp');

            $timestampFresh = PaymentProviderService::isWebhookTimestampFresh($signatureTimestamp);
            $signatureValid = $timestampFresh && PaymentProviderService::verifyCallbackSignature(
                $provider, $rawBody, $signature, $signatureTimestamp
            );

            if (!$signatureValid) {
                return response()->json(['error' => 'Invalid webhook signature'], 401);
            }

            $payload = json_decode($rawBody ?: '{}', true) ?: [];
            $merchantReference = (string) ($payload['merchantReference'] ?? $payload['orderReference'] ?? $payload['billReference'] ?? '');

            if ($merchantReference === '') {
                return response()->json(['error' => 'merchantReference is missing'], 400);
            }

            $transaction = PaymentTransaction::where('merchant_reference', $merchantReference)->first();
            if (!$transaction) {
                return response()->json(['error' => 'Payment transaction not found'], 404);
            }

            if ($transaction->status === 'paid') {
                return response()->json(['success' => true, 'idempotent' => true, 'status' => 'paid']);
            }

            $status = PaymentProviderService::extractStatus($payload);

            if ($transaction->status === $status && $transaction->reconciled_at) {
                return response()->json(['success' => true, 'idempotent' => true, 'status' => $status]);
            }

            $orderState = self::mapOrderState($status);

            DB::transaction(function () use ($transaction, $status, $payload, $signatureValid, $orderState) {
                $order = Order::where('id', $transaction->order_id)
                    ->select('id', 'notes', 'payment_status')
                    ->first();

                if ($status === 'paid' && $order && $order->payment_status !== 'paid') {
                    foreach (self::parseStockPlan($order->notes) as $entry) {
                        if ($entry['variantId']) {
                            ProductVariant::where('id', $entry['variantId'])
                                ->decrement('stock', $entry['quantity']);
                        }
                        Product::where('id', $entry['productId'])
                            ->decrement('stock', $entry['quantity']);
                    }
                }

                $transaction->update([
                    'status' => $status,
                    'callback_payload' => $payload,
                    'signature_valid' => $signatureValid,
                    'reconciled_at' => now(),
                    'provider_transaction_id' => (string) ($payload['transactionId'] ?? $transaction->provider_transaction_id ?? '') ?: null,
                ]);

                Order::where('id', $transaction->order_id)->update($orderState);
            });

            if ($status === 'paid') {
                $order = Order::find($transaction->order_id);
                if ($order) {
                    $this->sendOrderConfirmationEmail($order);
                }
            }

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function stripeCreateIntent(Request $request): JsonResponse
    {
        try {
            $secretKey = env('STRIPE_SECRET_KEY');
            if (!$secretKey) {
                return response()->json(['error' => 'Stripe is not configured on server'], 500);
            }

            $stripe = new \Stripe\StripeClient($secretKey);

            $amount = (float) $request->input('amount', 0);
            $currency = strtolower((string) $request->input('currency', 'usd'));
            $email = (string) $request->input('email', '');
            $items = $request->input('items', []);
            $orderFingerprint = trim((string) $request->input('orderFingerprint', ''));

            if (!is_finite($amount) || $amount <= 0) {
                return response()->json(['error' => 'Invalid payment amount'], 400);
            }

            $amountInMinorUnit = (int) round($amount * 100);
            if ($amountInMinorUnit < 50) {
                return response()->json(['error' => 'Minimum charge amount is too low'], 400);
            }

            $params = [
                'amount' => $amountInMinorUnit,
                'currency' => $currency,
                'automatic_payment_methods' => ['enabled' => true],
                'payment_method_options' => [
                    'card' => ['request_three_d_secure' => 'automatic'],
                ],
                'metadata' => [
                    'email' => $email,
                    'items' => json_encode($items),
                ],
            ];

            if ($email) {
                $params['receipt_email'] = $email;
            }

            $options = [];
            if ($orderFingerprint !== '') {
                $options['idempotency_key'] = 'stripe-intent-' . $orderFingerprint;
            }

            $paymentIntent = $stripe->paymentIntents->create($params, $options);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'paymentIntentId' => $paymentIntent->id,
            ]);
        } catch (\Throwable $e) {
            Log::error('Stripe error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function stripeGetIntent(Request $request): JsonResponse
    {
        $paymentIntentId = trim((string) $request->query('id', ''));
        if ($paymentIntentId === '') {
            return response()->json(['error' => 'Payment intent ID required'], 400);
        }

        try {
            $secretKey = env('STRIPE_SECRET_KEY');
            if (!$secretKey) {
                return response()->json(['error' => 'Stripe is not configured on server'], 500);
            }

            $stripe = new \Stripe\StripeClient($secretKey);
            $paymentIntent = $stripe->paymentIntents->retrieve($paymentIntentId);

            return response()->json([
                'status' => $paymentIntent->status,
                'amount' => $paymentIntent->amount / 100,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function cloudinarySignature(Request $request): JsonResponse
    {
        try {
            if (!CloudinaryService::configured()) {
                return response()->json(['error' => 'Cloudinary credentials are not configured'], 500);
            }

            $body = $request->all();
            $folder = isset($body['folder']) && is_string($body['folder']) && trim($body['folder']) !== ''
                ? trim($body['folder'])
                : 'products';

            $result = CloudinaryService::createUploadSignature($folder);

            return response()->json(array_merge(['success' => true], $result));
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function cloudinaryAssets(Request $request): JsonResponse
    {
        try {
            if (!CloudinaryService::configured()) {
                return response()->json(['error' => 'Cloudinary credentials are not configured'], 500);
            }

            $rawPrefix = trim((string) $request->query('prefix', ''));
            $prefix = (!$rawPrefix || strtolower($rawPrefix) === 'all') ? null : $rawPrefix;

            $assets = CloudinaryService::listAssets($prefix);

            return response()->json([
                'success' => true,
                'images' => array_map(fn ($item) => [
                    'publicId' => $item['public_id'] ?? '',
                    'url' => $item['secure_url'] ?? '',
                    'format' => $item['format'] ?? null,
                    'size' => $item['bytes'] ?? 0,
                ], $assets['images'] ?? []),
                'videos' => array_map(fn ($item) => [
                    'publicId' => $item['public_id'] ?? '',
                    'url' => $item['secure_url'] ?? '',
                    'format' => $item['format'] ?? null,
                    'size' => $item['bytes'] ?? 0,
                ], $assets['videos'] ?? []),
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function cartGet(): JsonResponse
    {
        return response()->json(['cart' => [], 'subtotal' => 0, 'message' => 'Cart state is managed client-side for this project.']);
    }

    public function cartPost(Request $request): JsonResponse
    {
        $items = collect($request->input('items', []))
            ->filter(function ($item) {
                $id = trim((string) data_get($item, 'id', ''));
                $quantity = (int) data_get($item, 'quantity', 0);
                $price = (float) data_get($item, 'price', -1);
                return $id !== '' && $quantity > 0 && $price >= 0;
            })->values();

        if ($items->isEmpty()) {
            return response()->json(['error' => 'Cart items are required'], 400);
        }

        $subtotal = $items->reduce(fn ($sum, $item) => $sum + ((float) $item['price'] * (int) $item['quantity']), 0.0);
        $count = $items->reduce(fn ($sum, $item) => $sum + (int) $item['quantity'], 0);
        return response()->json(['success' => true, 'cart' => $items, 'subtotal' => $subtotal, 'itemCount' => $count]);
    }

    public function cartDelete(): JsonResponse
    {
        return response()->json(['success' => true, 'cart' => [], 'subtotal' => 0]);
    }

    public function search(Request $request): JsonResponse
    {
        $q = trim((string) ($request->query('q', $request->query('query', ''))));
        $category = trim((string) $request->query('category', ''));
        if ($q === '' && $category === '') {
            return response()->json(['products' => []]);
        }

        $query = Product::query()->where('status', 'active')->with('category')->orderByDesc('created_at')->limit(12);
        if ($q !== '') {
            $query->where(function ($builder) use ($q) {
                $builder->where('name', 'like', '%'.$q.'%')
                    ->orWhere('description', 'like', '%'.$q.'%')
                    ->orWhere('slug', 'like', '%'.$q.'%');
            });
        }
        if ($category !== '') {
            $query->whereHas('category', fn ($b) => $b->whereRaw('LOWER(name) = ?', [strtolower($category)]));
        }
        $products = $query->get();

        return response()->json(['products' => $products->map(fn (Product $p) => ['id' => (string) $p->id, 'name' => $p->name, 'slug' => $p->slug, 'price' => (float) $p->price, 'category' => optional($p->category)->name ?: 'Uncategorized', 'image' => json_decode($p->images ?: '[]', true)[0] ?? null])]);
    }

    // ----- Reviews -----

    public function reviewsIndex(Request $request): JsonResponse
    {
        $productId = $request->query('productId');
        $query = Review::query()->with('user:id,name,email')->orderByDesc('created_at');

        if ($productId) {
            $product = Product::where('public_id', $productId)->orWhere('id', $productId)->first();
            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }
            $query->where('product_id', $product->id);
        }

        $reviews = $query->limit(100)->get();

        return response()->json([
            'reviews' => $reviews->map(fn (Review $r) => [
                'id' => $r->id,
                'productId' => $r->product_id,
                'userId' => $r->user_id,
                'userName' => optional($r->user)->name ?: 'Customer',
                'rating' => $r->rating,
                'comment' => $r->comment,
                'isApproved' => (bool) $r->is_approved,
                'isFeatured' => (bool) $r->is_featured,
                'createdAt' => $r->created_at,
            ]),
        ]);
    }

    public function reviewsStore(Request $request): JsonResponse
    {
        $productId = $request->input('productId');
        $product = Product::where('public_id', $productId)->orWhere('id', $productId)->first();
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $rating = (int) $request->input('rating', 0);
        if ($rating < 1 || $rating > 5) {
            return response()->json(['error' => 'Rating must be between 1 and 5'], 400);
        }

        $email = $this->normalizeEmail((string) $request->input('email', ''));
        if ($email === '') {
            return response()->json(['error' => 'Email is required'], 400);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => $rating,
            'comment' => trim((string) $request->input('comment', '')) ?: null,
            'is_approved' => false,
            'is_featured' => false,
        ]);

        return response()->json(['success' => true, 'review' => [
            'id' => $review->id,
            'productId' => $review->product_id,
            'rating' => $review->rating,
            'comment' => $review->comment,
            'isApproved' => (bool) $review->is_approved,
        ]]);
    }

    public function reviewsUpdate(Request $request, string $id): JsonResponse
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['error' => 'Review not found'], 404);
        }

        $updates = [];
        if ($request->has('isApproved')) {
            $updates['is_approved'] = (bool) $request->boolean('isApproved');
        }
        if ($request->has('isFeatured')) {
            $updates['is_featured'] = (bool) $request->boolean('isFeatured');
        }
        if (empty($updates)) {
            return response()->json(['error' => 'No valid fields provided'], 400);
        }

        $review->update($updates);

        return response()->json(['success' => true, 'review' => $review]);
    }

    public function reviewsDestroy(string $id): JsonResponse
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['error' => 'Review not found'], 404);
        }

        $review->delete();
        return response()->json(['success' => true]);
    }

    // ----- Rate limiting helper (in-memory via cache) -----

    protected function checkRateLimit(string $key, int $max, int $windowSeconds): array
    {
        $cacheKey = 'rate_limit:' . $key;
        $bucket = Cache::get($cacheKey, ['count' => 0, 'resetAt' => time() + $windowSeconds]);

        if (time() >= $bucket['resetAt']) {
            $bucket = ['count' => 1, 'resetAt' => time() + $windowSeconds];
            Cache::put($cacheKey, $bucket, $windowSeconds);
            return ['allowed' => true, 'remaining' => max($max - 1, 0)];
        }

        $bucket['count']++;
        Cache::put($cacheKey, $bucket, $bucket['resetAt'] - time());

        return [
            'allowed' => $bucket['count'] <= $max,
            'remaining' => max($max - $bucket['count'], 0),
            'retryAfterSeconds' => max((int) ceil(($bucket['resetAt'] - time())), 1),
        ];
    }

    // ---------- Coupon Validation ----------

    public function couponValidate(Request $request): JsonResponse
    {
        $code = strtoupper(trim((string) $request->input('code', '')));
        $subtotal = (float) $request->input('subtotal', 0);

        if ($code === '') {
            return response()->json(['valid' => false, 'error' => 'Please enter a coupon code']);
        }

        $coupon = \App\Models\Coupon::where('code', $code)->first();
        if (! $coupon) {
            return response()->json(['valid' => false, 'error' => 'Coupon not found']);
        }

        if (! $coupon->isValid($subtotal)) {
            if (! $coupon->is_active) {
                return response()->json(['valid' => false, 'error' => 'This coupon is no longer active']);
            }
            if ($coupon->max_uses && $coupon->used_count >= $coupon->max_uses) {
                return response()->json(['valid' => false, 'error' => 'This coupon has reached its usage limit']);
            }
            if ($coupon->valid_until && now()->gt($coupon->valid_until->endOfDay())) {
                return response()->json(['valid' => false, 'error' => 'This coupon has expired']);
            }
            if ($subtotal < $coupon->min_order) {
                return response()->json(['valid' => false, 'error' => 'Minimum order of Rs. ' . number_format($coupon->min_order) . ' required']);
            }
            return response()->json(['valid' => false, 'error' => 'Coupon is not valid for this order']);
        }

        $discount = $coupon->calculateDiscount($subtotal);
        $label = $coupon->type === 'percentage'
            ? $coupon->value . '% OFF'
            : 'Rs. ' . number_format($coupon->value) . ' OFF';

        return response()->json([
            'valid' => true,
            'discount' => $discount,
            'label' => $label,
            'code' => $coupon->code,
        ]);
    }
}
