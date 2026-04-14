{{-- WhatsApp floating button with tooltip --}}
<div x-data="{ showTooltip: false }" class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
    {{-- Tooltip bubble --}}
    <div x-show="showTooltip" x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 translate-y-2"
         class="bg-white text-gray-800 text-sm rounded-xl shadow-xl px-4 py-2.5 max-w-[200px] text-center"
         style="display:none;">
        <p class="font-semibold text-green-600">Chat with us!</p>
        <p class="text-xs text-gray-500 mt-0.5">We typically reply within minutes</p>
        <div class="absolute -bottom-1.5 right-6 w-3 h-3 bg-white transform rotate-45 shadow-sm"></div>
    </div>
    {{-- Button --}}
    <a href="https://wa.me/923320924951?text=Hi%20Sapphura%2C%20I%20need%20some%20information%20about%20your%20products." target="_blank"
       @mouseenter="showTooltip = true" @mouseleave="showTooltip = false"
       class="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:bg-green-600 transition-all duration-300 animate-pulse-glow"
       title="Chat on WhatsApp">
        <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.634-1.215A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.472-.752-6.22-2.03l-.434-.326-2.746.72.735-2.686-.357-.567A9.944 9.944 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
    </a>
</div>
