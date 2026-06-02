@extends('layouts.app')
@section('title', 'Checkout – Sapphura')

@section('content')
<div class="max-w-3xl mx-auto px-4 sm:px-6 py-10" x-data="checkoutForm()">
    <h1 class="text-3xl font-bold text-center mb-2">Checkout</h1>
    <p class="text-center text-cream/50 text-sm mb-10">Complete your order</p>

    {{-- Steps --}}
    <div class="flex justify-center gap-2 mb-10">
        <template x-for="(label, idx) in ['Info', 'Shipping', 'Payment', 'Review']" :key="idx">
            <div class="flex items-center gap-2">
                <div :class="step > idx ? 'bg-gold text-ink' : step === idx ? 'border-gold text-gold' : 'border-cream/20 text-cream/30'"
                     class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition" x-text="idx + 1"></div>
                <span :class="step >= idx ? 'text-cream' : 'text-cream/30'" class="text-xs uppercase tracking-wider hidden sm:inline" x-text="label"></span>
                <div x-show="idx < 3" class="w-8 h-px bg-cream/10 hidden sm:block"></div>
            </div>
        </template>
    </div>

    {{-- Step 1: Info --}}
    <div x-show="step === 0" class="glass rounded-xl p-6 space-y-4">
        <h2 class="text-lg font-bold mb-4">Customer Information</h2>
        <input x-model="form.email" type="email" placeholder="Email *" required class="w-full px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input x-model="form.name" type="text" placeholder="Full Name *" required class="px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-sm">
            <input x-model="form.phone" type="tel" placeholder="Phone *" required class="px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-sm">
        </div>
        <input x-model="form.address" type="text" placeholder="Shipping Address *" required class="w-full px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-sm">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input x-model="form.city" type="text" placeholder="City *" required class="px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-sm">
            <input x-model="form.postalCode" type="text" placeholder="Postal Code" class="px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-sm">
            <input x-model="form.country" type="text" placeholder="Country" value="Pakistan" class="px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-sm">
        </div>
        <button @click="if(form.email && form.name && form.phone && form.address && form.city) step = 1" class="w-full py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase mt-4">Continue to Shipping</button>
    </div>

    {{-- Step 2: Shipping --}}
    <div x-show="step === 1" class="glass rounded-xl p-6 space-y-4" style="display:none;">
        <h2 class="text-lg font-bold mb-4">Shipping Method</h2>
        <label class="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition" :class="form.shipping === 'standard' ? 'border-gold bg-gold/5' : 'border-gold/20'" @click="form.shipping = 'standard'; form.shippingCost = 200">
            <input type="radio" name="shipping" value="standard" x-model="form.shipping" class="accent-[#d4af37]">
            <div class="flex-1"><p class="font-semibold text-sm">Standard Delivery</p><p class="text-xs text-cream/50">3-5 business days</p></div>
            <span class="text-gold font-bold">Rs. 200</span>
        </label>
        <label class="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition" :class="form.shipping === 'express' ? 'border-gold bg-gold/5' : 'border-gold/20'" @click="form.shipping = 'express'; form.shippingCost = 500">
            <input type="radio" name="shipping" value="express" x-model="form.shipping" class="accent-[#d4af37]">
            <div class="flex-1"><p class="font-semibold text-sm">Express Delivery</p><p class="text-xs text-cream/50">1-2 business days</p></div>
            <span class="text-gold font-bold">Rs. 500</span>
        </label>
        <div class="flex gap-3 mt-4">
            <button @click="step = 0" class="px-6 py-3 border border-gold/30 text-gold rounded-lg text-sm">Back</button>
            <button @click="step = 2" class="flex-1 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">Continue to Payment</button>
        </div>
    </div>

    {{-- Step 3: Payment --}}
    <div x-show="step === 2" class="glass rounded-xl p-6 space-y-4" style="display:none;">
        <h2 class="text-lg font-bold mb-1">Payment Method</h2>
        <p class="text-xs text-cream/40 mb-5">Pakistan ke popular payment methods — choose karein jo easy ho</p>

        {{-- EasyPaisa --}}
        <label class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
               :class="form.payment === 'easypaisa' ? 'border-[#1ba462] bg-[#1ba462]/8' : 'border-gold/15 hover:border-[#1ba462]/40'"
               @click="form.payment = 'easypaisa'">
            <input type="radio" name="payment" value="easypaisa" x-model="form.payment" class="sr-only">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#1ba462]/15 text-[#1ba462] font-bold text-sm">EP</div>
            <div class="flex-1">
                <p class="font-semibold text-sm text-cream">EasyPaisa</p>
                <p class="text-xs text-cream/45">Mobile wallet &middot; Telenor users ke liye best</p>
            </div>
            <div class="ml-auto flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
                 :class="form.payment === 'easypaisa' ? 'border-[#1ba462] bg-[#1ba462]' : 'border-cream/20'">
                <div class="h-2 w-2 rounded-full bg-white" x-show="form.payment === 'easypaisa'"></div>
            </div>
        </label>

        {{-- JazzCash --}}
        <label class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
               :class="form.payment === 'jazzcash' ? 'border-[#e31837] bg-[#e31837]/8' : 'border-gold/15 hover:border-[#e31837]/40'"
               @click="form.payment = 'jazzcash'">
            <input type="radio" name="payment" value="jazzcash" x-model="form.payment" class="sr-only">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#e31837]/15 text-[#f87171] font-bold text-sm">JC</div>
            <div class="flex-1">
                <p class="font-semibold text-sm text-cream">JazzCash</p>
                <p class="text-xs text-cream/45">Mobile wallet &middot; Jazz/Warid users ke liye best</p>
            </div>
            <div class="ml-auto flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
                 :class="form.payment === 'jazzcash' ? 'border-[#e31837] bg-[#e31837]' : 'border-cream/20'">
                <div class="h-2 w-2 rounded-full bg-white" x-show="form.payment === 'jazzcash'"></div>
            </div>
        </label>

        {{-- Cash on Delivery --}}
        <label class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
               :class="form.payment === 'cod' ? 'border-gold bg-gold/5' : 'border-gold/15 hover:border-gold/40'"
               @click="form.payment = 'cod'">
            <input type="radio" name="payment" value="cod" x-model="form.payment" class="sr-only">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10 text-xl">&#x1F4B5;</div>
            <div class="flex-1">
                <p class="font-semibold text-sm text-cream">Cash on Delivery <span class="ml-1 text-[9px] rounded-full bg-gold/15 text-gold px-2 py-0.5 uppercase tracking-wider">Most Popular</span></p>
                <p class="text-xs text-cream/45">Delivery pe pay karein &middot; Nationwide available</p>
            </div>
            <div class="ml-auto flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
                 :class="form.payment === 'cod' ? 'border-gold bg-gold' : 'border-cream/20'">
                <div class="h-2 w-2 rounded-full bg-ink" x-show="form.payment === 'cod'"></div>
            </div>
        </label>

        {{-- Credit/Debit Card --}}
        <label class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
               :class="form.payment === 'stripe' ? 'border-blue-400 bg-blue-400/5' : 'border-gold/15 hover:border-blue-400/40'"
               @click="form.payment = 'stripe'">
            <input type="radio" name="payment" value="stripe" x-model="form.payment" class="sr-only">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xl">&#x1F4B3;</div>
            <div class="flex-1">
                <p class="font-semibold text-sm text-cream">Debit / Credit Card</p>
                <p class="text-xs text-cream/45">Visa &middot; Mastercard &middot; SSL encrypted</p>
            </div>
            <div class="ml-auto flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
                 :class="form.payment === 'stripe' ? 'border-blue-400 bg-blue-400' : 'border-cream/20'">
                <div class="h-2 w-2 rounded-full bg-white" x-show="form.payment === 'stripe'"></div>
            </div>
        </label>

        {{-- EasyPaisa account info (shown when selected) --}}
        <div x-show="form.payment === 'easypaisa'" class="rounded-xl border border-[#1ba462]/20 bg-[#1ba462]/5 p-4 text-sm space-y-1">
            <p class="font-semibold text-[#4ade80] text-xs uppercase tracking-wider mb-2">EasyPaisa Instructions</p>
            <p class="text-cream/60">Account: <span class="text-cream font-medium">0332-XXXXXXX</span></p>
            <p class="text-cream/60">Name: <span class="text-cream font-medium">Sapphura Store</span></p>
            <p class="text-[10px] text-cream/40 mt-2">Order place hone ke baad screenshot WhatsApp par bhejein: <a href="https://wa.me/923320924951" class="text-[#4ade80] hover:underline">0332-0924951</a></p>
        </div>

        {{-- JazzCash account info (shown when selected) --}}
        <div x-show="form.payment === 'jazzcash'" class="rounded-xl border border-[#e31837]/20 bg-[#e31837]/5 p-4 text-sm space-y-1">
            <p class="font-semibold text-[#f87171] text-xs uppercase tracking-wider mb-2">JazzCash Instructions</p>
            <p class="text-cream/60">Account: <span class="text-cream font-medium">0332-XXXXXXX</span></p>
            <p class="text-cream/60">Name: <span class="text-cream font-medium">Sapphura Store</span></p>
            <p class="text-[10px] text-cream/40 mt-2">Order place hone ke baad screenshot WhatsApp par bhejein: <a href="https://wa.me/923320924951" class="text-[#f87171] hover:underline">0332-0924951</a></p>
        </div>

        <div class="flex gap-3 mt-4">
            <button @click="step = 1" class="px-6 py-3 border border-gold/30 text-gold rounded-xl text-sm transition hover:bg-gold/10">Back</button>
            <button @click="if(form.payment) step = 3" class="flex-1 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-xl text-sm tracking-wider uppercase">Review Order</button>
        </div>
    </div>

    {{-- Step 4: Review --}}
    <div x-show="step === 3" class="glass rounded-xl p-6 space-y-4" style="display:none;">
        <h2 class="text-lg font-bold mb-4">Order Review</h2>
        <div class="space-y-3">
            <template x-for="item in $store.cart.items" :key="item.id">
                <div class="flex items-center gap-3 text-sm">
                    <img :src="item.image" class="w-12 h-12 rounded object-cover">
                    <div class="flex-1"><span x-text="item.name"></span> <span class="text-cream/40">x<span x-text="item.quantity"></span></span></div>
                    <span class="text-gold">Rs. <span x-text="(item.price * item.quantity).toLocaleString()"></span></span>
                </div>
            </template>
        </div>
        <div class="border-t border-gold/10 pt-4 space-y-2 text-sm">
            <div class="flex justify-between"><span class="text-cream/50">Subtotal</span><span>Rs. <span x-text="$store.cart.totalPrice.toLocaleString()"></span></span></div>
            <div class="flex justify-between"><span class="text-cream/50">Shipping</span><span>Rs. <span x-text="form.shippingCost.toLocaleString()"></span></span></div>
            <template x-if="form.discountAmount > 0">
                <div class="flex justify-between text-green-400"><span>Discount (<span x-text="form.discountLabel"></span>)</span><span>-Rs. <span x-text="form.discountAmount.toLocaleString()"></span></span></div>
            </template>
            <div class="flex justify-between text-lg font-bold border-t border-gold/10 pt-2"><span>Total</span><span class="text-gold">Rs. <span x-text="($store.cart.totalPrice + form.shippingCost - form.discountAmount).toLocaleString()"></span></span></div>
        </div>

        {{-- Coupon Code --}}
        <div class="border-t border-gold/10 pt-4">
            <p class="text-sm text-cream/60 mb-2">Have a discount code?</p>
            <template x-if="!form.discountLabel">
                <div class="flex gap-2">
                    <input x-model="form.discountCode" type="text" placeholder="Enter coupon code" class="flex-1 px-4 py-2.5 rounded-lg bg-navy border border-gold/20 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-sm uppercase">
                    <button @click="applyCoupon()" :disabled="couponLoading || !form.discountCode" class="px-5 py-2.5 bg-gold/20 text-gold rounded-lg text-sm font-semibold hover:bg-gold/30 transition disabled:opacity-50">
                        <span x-show="!couponLoading">Apply</span><span x-show="couponLoading">...</span>
                    </button>
                </div>
            </template>
            <template x-if="form.discountLabel">
                <div class="flex items-center justify-between bg-green-900/20 border border-green-500/20 rounded-lg p-3">
                    <span class="text-sm text-green-400"><span x-text="form.discountLabel"></span> applied! -Rs. <span x-text="form.discountAmount.toLocaleString()"></span></span>
                    <button @click="removeCoupon()" class="text-red-400 text-xs hover:underline">Remove</button>
                </div>
            </template>
            <p x-show="couponError" class="text-red-400 text-xs mt-1" x-text="couponError"></p>
        </div>
        <div class="bg-navy-soft rounded-lg p-4 text-sm space-y-1">
            <p><span class="text-cream/50">Name:</span> <span x-text="form.name"></span></p>
            <p><span class="text-cream/50">Email:</span> <span x-text="form.email"></span></p>
            <p><span class="text-cream/50">Phone:</span> <span x-text="form.phone"></span></p>
            <p><span class="text-cream/50">Address:</span> <span x-text="form.address + ', ' + form.city + (form.postalCode ? ' ' + form.postalCode : '') + ', ' + form.country"></span></p>
            <p><span class="text-cream/50">Payment:</span> <span x-text="form.payment.toUpperCase()"></span></p>
        </div>

        <div class="flex gap-3 mt-4">
            <button @click="step = 2" class="px-6 py-3 border border-gold/30 text-gold rounded-lg text-sm">Back</button>
            <button @click="placeOrder()" :disabled="submitting"
                    class="flex-1 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase disabled:opacity-50">
                <span x-show="!submitting">Place Order</span>
                <span x-show="submitting">Processing...</span>
            </button>
        </div>
    </div>
</div>

@push('scripts')
<script>
function checkoutForm() {
    return {
        step: 0,
        submitting: false,
        form: {
            email: '', name: '', phone: '', address: '', city: '', postalCode: '', country: 'Pakistan',
            shipping: 'standard', shippingCost: 200, payment: 'cod',
            discountCode: '', discountAmount: 0, discountLabel: '',
        },
        couponError: '',
        couponLoading: false,
        async applyCoupon() {
            if (!this.form.discountCode) return;
            this.couponLoading = true;
            this.couponError = '';
            try {
                const res = await fetch('/api/coupons/validate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
                    body: JSON.stringify({ code: this.form.discountCode, subtotal: Alpine.store('cart').totalPrice })
                });
                const data = await res.json();
                if (data.valid) {
                    this.form.discountAmount = data.discount;
                    this.form.discountLabel = data.label;
                } else {
                    this.couponError = data.error || 'Invalid coupon';
                    this.form.discountAmount = 0;
                    this.form.discountLabel = '';
                }
            } catch (e) { this.couponError = 'Network error'; }
            this.couponLoading = false;
        },
        removeCoupon() {
            this.form.discountCode = '';
            this.form.discountAmount = 0;
            this.form.discountLabel = '';
            this.couponError = '';
        },
        async placeOrder() {
            this.submitting = true;
            try {
                const items = Alpine.store('cart').items.map(i => ({
                    id: i.productId || i.id, quantity: i.quantity, price: i.price, variant: i.variant || null
                }));
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
                    body: JSON.stringify({
                        email: this.form.email, name: this.form.name, phone: this.form.phone,
                        firstName: this.form.name.split(' ')[0] || this.form.name,
                        lastName: this.form.name.split(' ').slice(1).join(' ') || '',
                        address: this.form.address,
                        city: this.form.city,
                        postalCode: this.form.postalCode,
                        country: this.form.country,
                        shippingName: this.form.name, shippingPhone: this.form.phone,
                        shippingCost: this.form.shippingCost, paymentMethod: this.form.payment,
                        total: Alpine.store('cart').totalPrice + this.form.shippingCost - (this.form.discountAmount || 0),
                        discount: this.form.discountAmount || 0,
                        discountCode: this.form.discountCode || '',
                        items: items,
                        paymentVerification: {},
                    })
                });
                const data = await res.json();
                if (data.success) {
                    Alpine.store('cart').clear();
                    window.location.href = '/order-confirmation?order=' + (data.order?.id || '');
                } else {
                    alert(data.error || 'Order failed. Please try again.');
                }
            } catch (e) {
                alert('Something went wrong. Please try again.');
            }
            this.submitting = false;
        }
    };
}
</script>
@endpush
@endsection
