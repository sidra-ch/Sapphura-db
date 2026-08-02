@extends('layouts.app')
@section('title', 'Custom Stitching Service — Sapphura')
@section('description', 'Custom stitching services by Sapphura - choose from premium designs, submit your measurements, and get expertly tailored suits delivered to your door.')

@section('content')

{{-- ============================================================
     HERO SECTION
============================================================ --}}
<section class="relative overflow-hidden py-24 md:py-36 px-6 sm:px-10 md:px-16 bg-gradient-to-br from-navy via-navy/90 to-ink"
         style="min-height:500px;">
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-32 -right-40 w-96 h-96 rounded-full" 
         style="background:radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);"></div>
    <div class="absolute -bottom-40 -left-32 w-80 h-80 rounded-full" 
         style="background:radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);"></div>
  </div>

  <div class="relative z-10 max-w-3xl mx-auto text-center">
    <div class="inline-flex items-center gap-3 mb-6">
      <span class="h-px w-8 bg-gold/50"></span>
      <span class="text-[9px] uppercase tracking-[0.5em] font-light text-gold/70">Bespoke Collections</span>
      <span class="h-px w-8 bg-gold/50"></span>
    </div>
    <h1 class="text-5xl sm:text-6xl md:text-7xl font-light leading-tight mb-6 text-cream"
        style="font-family:Georgia,serif; letter-spacing:-0.02em;">
      Custom <span class="text-gold">Stitching</span> Service
    </h1>
    <p class="text-base sm:text-lg text-cream/70 max-w-2xl mx-auto mb-10 leading-relaxed">
      Bring your vision to life with our bespoke tailoring service. Custom-designed garments tailored to your exact measurements and style preferences.
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="#booking-form" class="inline-flex items-center gap-3 px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 rounded-lg"
         style="background:#d4af37; color:#09111f; border:1px solid #d4af37;"
         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 32px rgba(212,175,55,0.3)';"
         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        Start Your Order
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4-4 4M3 12h18"/>
        </svg>
      </a>
      <a href="#faq" class="inline-flex items-center gap-3 px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 rounded-lg"
         style="background:transparent; color:#d4af37; border:1px solid rgba(212,175,55,0.5);">
        Learn More
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </a>
    </div>
  </div>
</section>

{{-- ============================================================
     GALLERY OF STITCHING EXAMPLES
============================================================ --}}
<section class="py-20 px-6 sm:px-10 md:px-16 bg-ink">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-light mb-4 text-cream" style="font-family:Georgia,serif;">Gallery</h2>
      <p class="text-cream/60 text-base max-w-2xl mx-auto">Explore our collection of bespoke designs crafted with precision and elegance.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      @php
        $stitchGroups = [
          [
            'group' => 'Bridal & Festive',
            'items' => [
              ['title' => 'Bridal Collection', 'category' => 'Lehengas', 'image' => '/newcollection-1.jpeg', 'desc' => 'Intricate embroidered lehenga details'],
              ['title' => 'Festive Collection', 'category' => 'Sarees', 'image' => '/summer-9.jpeg', 'desc' => 'Festive textures and finishing'],
            ],
          ],
          [
            'group' => 'Formal & Evening',
            'items' => [
              ['title' => 'Evening Wear', 'category' => 'Suits', 'image' => '/summer-6.jpeg', 'desc' => 'Elegant tailored formal suits'],
              ['title' => 'Party Wear', 'category' => 'Gowns', 'image' => '/summer-8.jpeg', 'desc' => 'Statement silhouettes for events'],
            ],
          ],
          [
            'group' => 'Casual & Daily Wear',
            'items' => [
              ['title' => 'Casual Chic', 'category' => 'Abayas', 'image' => '/summer-7.jpeg', 'desc' => 'Modern modestwear cuts'],
              ['title' => 'Designer Lawn', 'category' => 'Printed Suits', 'image' => '/newcollection-2.jpeg', 'desc' => 'Custom print and color stories'],
            ],
          ],
        ];
      @endphp

      @foreach($stitchGroups as $group)
      <div class="lg:col-span-3">
        <div class="flex items-center gap-3 mb-5">
          <span class="h-px w-10 bg-gold/40"></span>
          <p class="text-[10px] uppercase tracking-[0.3em] text-gold/75">{{ $group['group'] }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @foreach($group['items'] as $example)
          <div class="group relative overflow-hidden rounded-xl aspect-[3/4]">
            <img src="{{ $example['image'] }}" alt="{{ $example['title'] }}"
                 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute inset-0 flex flex-col justify-end p-6 text-cream translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
              <p class="text-[10px] uppercase tracking-[0.3em] text-gold/70 mb-2">{{ $example['category'] }}</p>
              <h3 class="text-xl font-light mb-2" style="font-family:Georgia,serif;">{{ $example['title'] }}</h3>
              <p class="text-sm text-cream/70">{{ $example['desc'] }}</p>
            </div>
          </div>
          @endforeach
        </div>
      </div>
      @endforeach
    </div>
  </div>
</section>

{{-- ============================================================
     HOW IT WORKS
============================================================ --}}
<section class="py-20 px-6 sm:px-10 md:px-16 bg-navy">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-light mb-4 text-cream" style="font-family:Georgia,serif;">How It Works</h2>
      <p class="text-cream/60 text-base">Simple, streamlined process from design to delivery.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      @php
        $steps = [
          [
            'num' => '01',
            'title' => 'Design & Consultation',
            'desc' => 'Share your design ideas, reference images, or fabric preferences. Our team will guide you through customization options.',
            'icon' => '✨'
          ],
          [
            'num' => '02',
            'title' => 'Measurements',
            'desc' => 'Provide detailed measurements or visit our studio for precise fitting. We ensure perfect alignment with your body type.',
            'icon' => '📏'
          ],
          [
            'num' => '03',
            'title' => 'Fabrication',
            'desc' => 'Select from premium fabrics or bring your own. Our artisans will begin crafting your custom piece with precision.',
            'icon' => '🧵'
          ],
          [
            'num' => '04',
            'title' => 'Delivery',
            'desc' => 'Receive your finished garment within 7-10 working days. We ensure quality checks before shipment.',
            'icon' => '📦'
          ],
        ];
      @endphp

      @foreach($steps as $step)
      <div class="text-center group">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6 group-hover:bg-gold/20 transition">
          <span class="text-2xl">{{ $step['icon'] }}</span>
        </div>
        <h3 class="text-lg font-semibold text-cream mb-3">{{ $step['title'] }}</h3>
        <p class="text-sm text-cream/60">{{ $step['desc'] }}</p>
        @if(!$loop->last)
          <div class="hidden md:block absolute top-1/4 -right-8 text-gold/30 text-2xl">→</div>
        @endif
      </div>
      @endforeach
    </div>
  </div>
</section>

{{-- ============================================================
     MEASUREMENTS GUIDE
============================================================ --}}
<section class="py-20 px-6 sm:px-10 md:px-16 bg-ink">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-4xl md:text-5xl font-light mb-4 text-cream" style="font-family:Georgia,serif;">Measurements Guide</h2>
      <p class="text-cream/60 text-base">Accurate measurements ensure perfect fit. Use soft measuring tape and have someone help you.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div class="space-y-6">
        <h3 class="text-2xl font-light text-gold mb-6" style="font-family:Georgia,serif;">Essential Measurements</h3>
        <div class="space-y-4">
          <div class="bg-navy/50 p-4 rounded-lg border border-gold/10">
            <p class="text-cream font-semibold mb-2">Bust</p>
            <p class="text-sm text-cream/70">Measure around the fullest part of your chest, keeping tape snug but not tight.</p>
          </div>
          <div class="bg-navy/50 p-4 rounded-lg border border-gold/10">
            <p class="text-cream font-semibold mb-2">Waist</p>
            <p class="text-sm text-cream/70">Measure around your natural waist where you bend sideways.</p>
          </div>
          <div class="bg-navy/50 p-4 rounded-lg border border-gold/10">
            <p class="text-cream font-semibold mb-2">Hips</p>
            <p class="text-sm text-cream/70">Measure around the fullest part of your hips, usually 8 inches below waist.</p>
          </div>
          <div class="bg-navy/50 p-4 rounded-lg border border-gold/10">
            <p class="text-cream font-semibold mb-2">Length</p>
            <p class="text-sm text-cream/70">From shoulder to desired hemline length (floor length, knee length, etc.).</p>
          </div>
          <div class="bg-navy/50 p-4 rounded-lg border border-gold/10">
            <p class="text-cream font-semibold mb-2">Shoulder Width</p>
            <p class="text-sm text-cream/70">From shoulder point to shoulder point across the back.</p>
          </div>
          <div class="bg-navy/50 p-4 rounded-lg border border-gold/10">
            <p class="text-cream font-semibold mb-2">Sleeve Length</p>
            <p class="text-sm text-cream/70">From shoulder seam to desired sleeve end (wrist or elbow).</p>
          </div>
        </div>
      </div>

      <div class="relative h-[600px] bg-gradient-to-br from-navy to-navy/70 rounded-xl overflow-hidden p-4">
        <div class="grid grid-cols-2 gap-3 h-full">
          <img src="/summer-2.jpeg" alt="Stitched suit details" class="w-full h-full object-cover rounded-lg border border-gold/10">
          <img src="/newcollection-3.jpeg" alt="Custom embroidered fabric" class="w-full h-full object-cover rounded-lg border border-gold/10">
          <img src="/newcollection-4.jpeg" alt="Tailored festive outfit" class="w-full h-full object-cover rounded-lg border border-gold/10">
          <img src="/clothes-collection.jpeg" alt="Premium stitched collection" class="w-full h-full object-cover rounded-lg border border-gold/10">
        </div>
        <div class="absolute bottom-4 left-4 right-4 bg-ink/70 backdrop-blur rounded-lg border border-gold/20 p-4">
          <p class="text-cream/75 text-xs mb-3">Share your preferred style and measurements on WhatsApp to start your custom order.</p>
           <a href="https://wa.me/923320924951?text=Hi%20I%20want%20to%20customize%20a%20garment"
             target="_blank"
             class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

{{-- ============================================================
     BOOKING FORM
============================================================ --}}
<section id="booking-form" class="py-20 px-6 sm:px-10 md:px-16 bg-navy">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-4xl md:text-5xl font-light mb-4 text-cream" style="font-family:Georgia,serif;">Start Your Order</h2>
      <p class="text-cream/60 text-base">Fill out the form below and our team will connect with you within 24 hours.</p>
    </div>

    @if(session('stitching_success'))
      <div class="mb-6 rounded-lg border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
        {{ session('stitching_success') }}
      </div>
    @endif

    <form action="{{ route('stitching.request') }}" method="POST" class="space-y-6 bg-navy/40 p-8 rounded-2xl border border-gold/10">
      @csrf
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-semibold text-cream mb-2">Full Name *</label>
          <input type="text" name="name" required class="w-full px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream placeholder-cream/40 focus:border-gold focus:outline-none transition">
        </div>
        <div>
          <label class="block text-sm font-semibold text-cream mb-2">Email *</label>
          <input type="email" name="email" required class="w-full px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream placeholder-cream/40 focus:border-gold focus:outline-none transition">
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-semibold text-cream mb-2">Phone Number *</label>
          <input type="tel" name="phone" required class="w-full px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream placeholder-cream/40 focus:border-gold focus:outline-none transition">
        </div>
        <div>
          <label class="block text-sm font-semibold text-cream mb-2">Preferred Contact Method</label>
          <select name="contact_method" class="w-full px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream focus:border-gold focus:outline-none transition">
            <option value="whatsapp">WhatsApp</option>
            <option value="phone">Phone Call</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-cream mb-2">Garment Type *</label>
        <select name="garment_type" required class="w-full px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream focus:border-gold focus:outline-none transition">
          <option value="">Select a garment type</option>
          <option value="lehenga">Bridal Lehenga</option>
          <option value="suit">Formal Suit</option>
          <option value="abaya">Abaya</option>
          <option value="gown">Evening Gown</option>
          <option value="saree">Saree</option>
          <option value="lawn">Printed Lawn</option>
          <option value="custom">Custom Design</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-cream mb-2">Design Preference</label>
        <textarea name="design_details" rows="4" placeholder="Describe your design, colors, embroidery preferences, and any reference images you'll share..."
                  class="w-full px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream placeholder-cream/40 focus:border-gold focus:outline-none transition resize-none"></textarea>
      </div>

      <div>
        <label class="block text-sm font-semibold text-cream mb-2">Preferred Timeline</label>
        <select name="timeline" class="w-full px-4 py-3 rounded-lg bg-navy border border-gold/20 text-cream focus:border-gold focus:outline-none transition">
          <option value="">Select timeline</option>
          <option value="urgent">Urgent (5-7 days) - Rush Fee Applied</option>
          <option value="standard">Standard (7-10 days)</option>
          <option value="flexible">Flexible (11+ days) - No Rush Fee</option>
        </select>
      </div>

      <div class="bg-gold/10 border border-gold/20 rounded-lg p-4">
        <p class="text-sm text-cream/80">
          ✓ Our team will contact you to finalize measurements, discuss design details, and provide a quote.<br>
          ✓ Delivery across Pakistan: 7-10 working days (standard).<br>
          ✓ Payment options: 50% advance, 50% on completion.
        </p>
      </div>

      <button type="submit" class="w-full py-4 bg-gold text-ink font-semibold text-sm uppercase tracking-[0.2em] rounded-lg hover:shadow-lg hover:shadow-gold/30 transition">
        Submit Order Request
      </button>
    </form>
  </div>
</section>

{{-- ============================================================
     FAQ
============================================================ --}}
<section id="faq" class="py-20 px-6 sm:px-10 md:px-16 bg-ink">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-4xl md:text-5xl font-light mb-4 text-cream" style="font-family:Georgia,serif;">Frequently Asked Questions</h2>
    </div>

    <div class="space-y-4">
      @php
        $faqs = [
          [
            'q' => 'How long does custom stitching take?',
            'a' => 'Standard timeline is 7-10 working days from order confirmation and final measurements. Rush orders (5-7 days) are available with additional charges.'
          ],
          [
            'q' => 'What if I don\'t have reference images?',
            'a' => 'Our design team can work with you to create custom designs. We recommend browsing our gallery, mentioning your favorite styles, and we\'ll develop concepts tailored to you.'
          ],
          [
            'q' => 'Can I change my design after ordering?',
            'a' => 'Yes, if requested within 48 hours of order confirmation. Changes after that may incur modification fees.'
          ],
          [
            'q' => 'What are the payment terms?',
            'a' => '50% advance payment (via bank transfer, JazzCash, or EasyPaisa), 50% before delivery. We accept all major payment methods.'
          ],
          [
            'q' => 'Do you offer fabric selection?',
            'a' => 'Yes! You can choose from our premium fabric collection or bring your own. Additional charges apply for provided fabrics.'
          ],
          [
            'q' => 'What if the fit isn\'t perfect?',
            'a' => 'One free alteration is included within 2 weeks of delivery. Major fit issues are addressed at no additional cost.'
          ],
          [
            'q' => 'Do you ship internationally?',
            'a' => 'Currently, we deliver across Pakistan. International shipping can be arranged for urgent requests.'
          ],
          [
            'q' => 'Can I track my order?',
            'a' => 'Yes, you\'ll receive regular updates via WhatsApp or email throughout the stitching process and a tracking number for delivery.'
          ],
        ];
      @endphp

      @foreach($faqs as $faq)
      <details class="group border border-gold/20 rounded-lg overflow-hidden hover:border-gold/40 transition cursor-pointer">
        <summary class="flex items-center justify-between px-6 py-4 bg-navy/40 hover:bg-navy/60 transition">
          <span class="text-cream font-semibold">{{ $faq['q'] }}</span>
          <svg class="w-5 h-5 text-gold transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </summary>
        <div class="px-6 py-4 bg-navy/20 text-cream/80 text-sm">{{ $faq['a'] }}</div>
      </details>
      @endforeach
    </div>
  </div>
</section>

{{-- ============================================================
     CTA SECTION
============================================================ --}}
<section class="py-16 px-6 sm:px-10 md:px-16 bg-gradient-to-r from-navy via-navy/90 to-ink text-center">
  <h2 class="text-3xl md:text-4xl font-light text-cream mb-6" style="font-family:Georgia,serif;">Ready to Create Your Custom Piece?</h2>
  <p class="text-cream/70 max-w-2xl mx-auto mb-8">Start your bespoke journey today. Our team is here to bring your vision to life.</p>
  <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
    <a href="#booking-form" class="inline-flex items-center gap-2 px-8 py-4 bg-gold text-ink font-semibold text-[10px] uppercase tracking-[0.2em] rounded-lg hover:shadow-lg hover:shadow-gold/30 transition">
      Book Now
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4-4 4M3 12h18"/>
      </svg>
    </a>
    <a href="https://wa.me/923320924951?text=Hi%20I%20have%20questions%20about%20custom%20stitching"
       target="_blank"
       class="inline-flex items-center gap-2 px-8 py-4 border border-gold text-gold font-semibold text-[10px] uppercase tracking-[0.2em] rounded-lg hover:bg-gold/10 transition">
      Message on WhatsApp
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-1.871.996-3.035 2.54-3.078 4.333.046 1.793 1.213 3.45 3.095 4.597 1.45.996 3.578 1.762 5.313 1.91.95.056 1.92.022 2.868-.045 1.286-.099 2.695-.486 3.622-1.585-.07-.165-.127-.355-.2-.547-.206-.592-.487-1.293-.892-1.845-.524-.697-1.076-1.264-1.594-1.692-.597-.502-1.247-.875-1.845-.957-.348-.046-.753-.046-1.126.046-.528.089-1.189.264-1.606.547-.348.231-.684.52-.957.891-.272.37-.528.83-.713 1.231-.181-.046-.363-.102-.535-.169-1.126-.399-2.405-.936-3.122-1.585-.717-.649-1.32-1.54-1.428-2.501-.108-.96.21-2.051 1.014-2.868.804-.817 2.108-1.342 3.35-1.342.975 0 1.923.284 2.695.781.404.269.767.603 1.076 1.014m0 0"/>
      </svg>
    </a>
  </div>
</section>

@endsection
