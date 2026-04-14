{{-- WhatsApp floating widget with integrated toasts --}}
<div x-data="whatsappWidget()" x-init="init()" class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

    {{-- Toast bubble (appears above WhatsApp icon) --}}
    <div x-show="showToast" x-transition:enter="transition ease-out duration-400"
         x-transition:enter-start="opacity-0 translate-y-4 scale-95" x-transition:enter-end="opacity-100 translate-y-0 scale-100"
         x-transition:leave="transition ease-in duration-300"
         x-transition:leave-start="opacity-100 translate-y-0 scale-100" x-transition:leave-end="opacity-0 translate-y-4 scale-95"
         class="max-w-[280px] relative" style="display:none;">
        <div class="glass rounded-2xl p-4 shadow-2xl border border-gold/20">
            <button @click="dismissToast()" class="absolute top-2 right-3 text-cream/40 hover:text-cream text-base leading-none">&times;</button>

            {{-- Welcome --}}
            <template x-if="currentToast === 'welcome'">
                <div class="flex items-start gap-3 pr-4">
                    <div class="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4.5 h-4.5 text-gold" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                    </div>
                    <div>
                        <p class="font-semibold text-gold text-sm">Welcome to Sapphura! ✨</p>
                        <p class="text-cream/70 text-xs mt-1 leading-relaxed">Discover luxury jewelry, abayas & accessories.</p>
                    </div>
                </div>
            </template>

            {{-- Contact --}}
            <template x-if="currentToast === 'contact'">
                <div class="flex items-start gap-3 pr-4">
                    <div class="w-9 h-9 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4.5 h-4.5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.634-1.215A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                    </div>
                    <div>
                        <p class="font-semibold text-green-400 text-sm">Need Help? 💬</p>
                        <p class="text-cream/70 text-xs mt-1 leading-relaxed">Chat with us on WhatsApp — we reply within minutes!</p>
                    </div>
                </div>
            </template>

            {{-- Offer --}}
            <template x-if="currentToast === 'offer'">
                <div class="flex items-start gap-3 pr-4">
                    <div class="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4.5 h-4.5 text-gold" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
                    </div>
                    <div>
                        <p class="font-semibold text-gold text-sm">Free Shipping! 🚚</p>
                        <p class="text-cream/70 text-xs mt-1 leading-relaxed">Free delivery on orders above Rs. 5,000!</p>
                    </div>
                </div>
            </template>

            {{-- Arrow pointing to WhatsApp button --}}
            <div class="absolute -bottom-1.5 right-5 w-3 h-3 glass border-b border-r border-gold/20 transform rotate-45"></div>
        </div>
    </div>

    {{-- WhatsApp Button --}}
    <a href="https://wa.me/923320924951?text=Hi%20Sapphura%2C%20I%20need%20some%20information%20about%20your%20products." target="_blank"
       class="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:bg-green-600 transition-all duration-300 animate-pulse-glow relative"
       title="Chat on WhatsApp">
        <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.634-1.215A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.472-.752-6.22-2.03l-.434-.326-2.746.72.735-2.686-.357-.567A9.944 9.944 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
        {{-- Notification dot --}}
        <span x-show="showToast" class="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-green-500 animate-ping" style="display:none;"></span>
        <span x-show="showToast" class="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-green-500" style="display:none;"></span>
    </a>
</div>

<script>
function whatsappWidget() {
    return {
        showToast: false,
        currentToast: '',
        toastQueue: ['welcome', 'contact', 'offer'],
        toastIndex: 0,
        timer: null,
        init() {
            // Show first toast after 2s
            setTimeout(() => this.showNext(), 2000);
        },
        showNext() {
            if (this.toastIndex >= this.toastQueue.length) return;
            this.currentToast = this.toastQueue[this.toastIndex];
            this.showToast = true;
            // Auto-dismiss after 6s, then show next after 3s gap
            this.timer = setTimeout(() => {
                this.showToast = false;
                this.toastIndex++;
                setTimeout(() => this.showNext(), 3000);
            }, 6000);
        },
        dismissToast() {
            this.showToast = false;
            clearTimeout(this.timer);
            this.toastIndex++;
            setTimeout(() => this.showNext(), 3000);
        }
    };
}
</script>
