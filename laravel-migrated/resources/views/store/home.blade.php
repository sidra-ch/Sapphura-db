@extends('layouts.app')
@section('title', 'Sapphura - Luxury Fashion & Jewelry')

@section('content')

{{-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
     HERO Ã¢â‚¬â€ Cinematic editorial, minimal
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â --}}
<section class="relative overflow-hidden" style="height:85vh; min-height:580px; background:#07090f;"
        x-data="{
           s:0, prog:0, iv:null,
           start(){ clearInterval(this.iv); this.iv=setInterval(()=>{ this.prog+=100/65; if(this.prog>=100){ this.prog=0; this.s=(this.s+1)%3; } },100); },
           go(n){ this.s=n; this.prog=0; }
         }"
         x-init="start()">

  {{-- BG: Slide 0 --}}
  <div x-show="s===0"
       x-transition:enter="transition-opacity ease-in-out duration-[1200ms]"
       x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100"
       x-transition:leave="transition-opacity ease-in duration-700"
       x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
       class="absolute inset-0 z-0">
    <video src="/bakra-eid.mp4" autoplay muted loop playsinline class="h-full w-full object-cover"></video>
  </div>

  {{-- BG: Slide 1 --}}
  <div x-show="s===1"
       x-transition:enter="transition-opacity ease-in-out duration-[1200ms]"
       x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100"
       x-transition:leave="transition-opacity ease-in duration-700"
       x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
       class="absolute inset-0 z-0">
    <img src="/summer-2.jpeg" alt="" class="h-full w-full object-cover">
  </div>

  {{-- BG: Slide 2 --}}
  <div x-show="s===2"
       x-transition:enter="transition-opacity ease-in-out duration-[1200ms]"
       x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100"
       x-transition:leave="transition-opacity ease-in duration-700"
       x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
       class="absolute inset-0 z-0">
    <video src="/eid collection video.mp4" autoplay muted loop playsinline class="h-full w-full object-cover"></video>
  </div>

  {{-- Gradient: left directional scrim --}}
  <div class="pointer-events-none absolute inset-0 z-10"
       style="background:linear-gradient(108deg,rgba(7,9,15,.94) 0%,rgba(7,9,15,.68) 40%,rgba(7,9,15,.18) 72%,rgba(7,9,15,.04) 100%);"></div>
  {{-- Gradient: bottom rise --}}
  <div class="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[45%]"
       style="background:linear-gradient(to top,rgba(7,9,15,1) 0%,rgba(7,9,15,.7) 40%,transparent 100%);"></div>
  {{-- Gradient: top vignette --}}
  <div class="pointer-events-none absolute inset-x-0 top-0 z-10 h-[22%]"
       style="background:linear-gradient(to bottom,rgba(7,9,15,.65) 0%,transparent 100%);"></div>

  {{-- Cinematic letterbox bars --}}
  <div class="pointer-events-none absolute inset-x-0 top-0 z-[25] h-3" style="background:rgba(0,0,0,0.55);"></div>
  <div class="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-3" style="background:rgba(0,0,0,0.55);"></div>

  {{-- Giant ghost slide number (right edge) --}}
  <div class="pointer-events-none absolute right-0 top-1/2 z-10 -translate-y-[42%] select-none overflow-hidden hidden md:block"
       style="font-family:Georgia,serif; font-size:clamp(200px,28vw,380px); font-weight:700; -webkit-text-stroke:1px rgba(212,175,55,0.08); color:transparent; line-height:1;">
    <span x-text="['01','02','03'][s]"></span>
  </div>

  {{-- Vertical brand strip (desktop) --}}
  <div class="pointer-events-none absolute left-5 top-0 bottom-0 z-20 hidden md:flex flex-col items-center justify-center gap-5"
       style="writing-mode:vertical-rl; transform:rotate(180deg);">
    <span class="text-[8px] uppercase tracking-[0.6em] font-light select-none" style="color:rgba(255,255,255,0.11);">Sapphura</span>
    <span class="w-px flex-1 max-h-20" style="background:rgba(255,255,255,0.07);"></span>
    <span class="text-[8px] uppercase tracking-[0.5em] font-light select-none" style="color:rgba(255,255,255,0.07);">2026</span>
  </div>

  {{-- Ã¢â€¢ÂÃ¢â€¢Â MAIN CONTENT Ã¢â€¢ÂÃ¢â€¢Â --}}
  <div class="relative z-20 flex h-full flex-col justify-between px-8 pb-8 pt-24 md:px-16 lg:px-20">

    {{-- Eyebrow label --}}
    <div class="md:ml-8 flex items-center gap-4">
      <span class="h-px w-8 block" style="background:rgba(212,175,55,0.5);"></span>
      <span class="text-[9px] uppercase tracking-[0.55em] font-light" style="color:rgba(212,175,55,0.7);"
            x-text="['Eid ul Adha Edit','Signature Collection','Premium Edit'][s]"></span>
    </div>

    {{-- Headline block --}}
    <div class="md:ml-8 flex-1 flex items-end pb-5">
      <div class="w-full">

        {{-- Slide 0 --}}
        <div x-show="s===0"
             x-transition:enter="transition ease-out duration-700"
             x-transition:enter-start="opacity-0 translate-y-10"
             x-transition:enter-end="opacity-100 translate-y-0">
          <h1 class="font-light leading-[0.86] text-white"
              style="font-family:Georgia,serif; font-size:clamp(3.8rem,10vw,10rem); letter-spacing:-0.025em;">
            Eid<br>
            <span style="-webkit-text-stroke:1px rgba(212,175,55,0.65); color:transparent;">Collection.</span>
          </h1>
          <p class="mt-5 text-[11px] font-light uppercase tracking-[0.22em]" style="color:rgba(255,255,255,0.28);">Curated for the celebration</p>
        </div>

        {{-- Slide 1 --}}
        <div x-show="s===1"
             x-transition:enter="transition ease-out duration-700"
             x-transition:enter-start="opacity-0 translate-y-10"
             x-transition:enter-end="opacity-100 translate-y-0">
          <h1 class="font-light leading-[0.86] text-white"
              style="font-family:Georgia,serif; font-size:clamp(3.8rem,10vw,10rem); letter-spacing:-0.025em;">
            Timeless<br>
            <span style="-webkit-text-stroke:1px rgba(212,175,55,0.65); color:transparent;">Elegance.</span>
          </h1>
          <p class="mt-5 text-[11px] font-light uppercase tracking-[0.22em]" style="color:rgba(255,255,255,0.28);">Explore the season's finest</p>
        </div>

        {{-- Slide 2 --}}
        <div x-show="s===2"
             x-transition:enter="transition ease-out duration-700"
             x-transition:enter-start="opacity-0 translate-y-10"
             x-transition:enter-end="opacity-100 translate-y-0">
          <h1 class="font-light leading-[0.86] text-white"
              style="font-family:Georgia,serif; font-size:clamp(3.8rem,10vw,10rem); letter-spacing:-0.025em;">
            Premium<br>
            <span style="-webkit-text-stroke:1px rgba(212,175,55,0.65); color:transparent;">Design.</span>
          </h1>
          <p class="mt-5 text-[11px] font-light uppercase tracking-[0.22em]" style="color:rgba(255,255,255,0.28);">Where craft meets luxury</p>
        </div>

        {{-- CTA row --}}
        <div class="mt-10 flex flex-wrap items-center gap-6">
          <a :href="['/collections','/collections?category=Clothing','/collections?category=Stitch+Suits'][s]"
             class="group inline-flex items-center gap-3.5 px-8 py-3.5 text-[10px] uppercase tracking-[0.35em] transition-all duration-300 hover:text-ink"
             style="border:1px solid rgba(212,175,55,0.6); color:rgba(212,175,55,0.9); background:transparent;"
             onmouseover="this.style.background='#d4af37'; this.style.borderColor='#d4af37';"
             onmouseout="this.style.background='transparent'; this.style.borderColor='rgba(212,175,55,0.6)';">
            Discover Now
            <svg class="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4-4 4M3 12h18"/>
            </svg>
          </a>
          <a href="/about"
             class="text-[10px] uppercase tracking-[0.42em] font-light transition-colors duration-300"
             style="color:rgba(255,255,255,0.22);"
             onmouseover="this.style.color='rgba(255,255,255,0.6)';"
             onmouseout="this.style.color='rgba(255,255,255,0.22)';">Our Story</a>
        </div>

      </div>
    </div>

    {{-- Bottom controls --}}
    <div class="md:ml-8 flex items-end justify-between gap-4">

      {{-- Scroll indicator --}}
      <div class="hidden sm:flex flex-col items-center gap-2.5">
        <div class="relative h-10 w-px overflow-hidden" style="background:rgba(255,255,255,0.1);">
          <div class="absolute inset-x-0 top-0 h-5" style="background:rgba(255,255,255,0.4); animation:heroScrollDrop 2s ease-in-out infinite;"></div>
        </div>
        <span class="text-[8px] uppercase tracking-[0.5em] font-light" style="color:rgba(255,255,255,0.2);">Scroll</span>
      </div>

      {{-- Slide indicators + progress bar --}}
      <div class="flex flex-col items-end gap-3">
        <div class="flex items-center gap-5">
          <button @click="go(0)" class="flex items-center gap-2 cursor-pointer group" aria-label="Slide 1">
            <span class="text-[9px] font-light transition-colors duration-300"
                  :class="s===0 ? 'text-gold' : 'text-white/25 group-hover:text-white/50'">01</span>
            <span class="h-px block transition-all duration-500"
                  :class="s===0 ? 'w-10 bg-gold' : 'w-3 bg-white/20 group-hover:bg-white/40'"></span>
          </button>
          <button @click="go(1)" class="flex items-center gap-2 cursor-pointer group" aria-label="Slide 2">
            <span class="text-[9px] font-light transition-colors duration-300"
                  :class="s===1 ? 'text-gold' : 'text-white/25 group-hover:text-white/50'">02</span>
            <span class="h-px block transition-all duration-500"
                  :class="s===1 ? 'w-10 bg-gold' : 'w-3 bg-white/20 group-hover:bg-white/40'"></span>
          </button>
          <button @click="go(2)" class="flex items-center gap-2 cursor-pointer group" aria-label="Slide 3">
            <span class="text-[9px] font-light transition-colors duration-300"
                  :class="s===2 ? 'text-gold' : 'text-white/25 group-hover:text-white/50'">03</span>
            <span class="h-px block transition-all duration-500"
                  :class="s===2 ? 'w-10 bg-gold' : 'w-3 bg-white/20 group-hover:bg-white/40'"></span>
          </button>
        </div>
        {{-- Live progress bar --}}
        <div class="h-px w-28 overflow-hidden" style="background:rgba(255,255,255,0.07);">
          <div class="h-full transition-none" style="background:rgba(212,175,55,0.55);" :style="'width:' + prog + '%'"></div>
        </div>
      </div>

    </div>
  </div>

  <style>
    @keyframes heroScrollDrop {
      0%   { transform:translateY(-100%); opacity:0; }
      20%  { opacity:1; }
      80%  { opacity:1; }
      100% { transform:translateY(280%); opacity:0; }
    }
  </style>

</section>

{{-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
     LUXURY FRAMEWORK
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â --}}
<section class="border-b border-gold/[0.08] bg-ink py-14 md:py-16">
    <div class="section-shell">
        <div class="mb-10 text-center">
            <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">Why Choose Sapphura</p>
            <h2 class="mt-2 text-2xl font-semibold text-cream md:text-3xl">Our Promise to You</h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @foreach([
                ['icon' => '&#9812;', 'title' => 'Navy & Gold Identity', 'desc' => 'A refined color system that signals trust, elegance, and premium quality across every touchpoint.'],
                ['icon' => '&#10022;', 'title' => 'Signature Aesthetics', 'desc' => 'Subtle gradients, gold accents, and quiet details that enhance product focus without distraction.'],
                ['icon' => '&#128666;', 'title' => 'Premium Delivery', 'desc' => 'Nationwide shipping with careful packaging designed to make unboxing feel like unwrapping a gift.'],
                ['icon' => '&#10003;', 'title' => 'Trusted Quality', 'desc' => 'Every piece is quality-checked and backed by a satisfaction guarantee with easy exchange support.'],
            ] as $feature)
                <div class="luxury-card group rounded-2xl p-6 transition-all hover:-translate-y-1.5">
                    <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/[0.08] text-xl text-gold">
                        {!! $feature['icon'] !!}
                    </div>
                    <h3 class="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-cream">{{ $feature['title'] }}</h3>
                    <p class="text-xs leading-relaxed text-cream/60">{{ $feature['desc'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>

{{-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
     CATEGORY CARDS
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â --}}
<section class="py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 text-center">
            <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">Browse Collection</p>
            <h2 class="mt-2 text-2xl font-semibold text-cream md:text-3xl">Explore By Category</h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @foreach([
                ['name' => 'Jewelry', 'img' => '/neckles-3.jpeg', 'tag' => 'Rings &middot; Necklaces &middot; Earrings'],
                ['name' => 'Clothing', 'img' => '/summer-1.jpeg', 'tag' => 'Suits &middot; Formals &middot; Casuals'],
                ['name' => 'Stitch Suits', 'img' => '/stitch%20suit/img-1.jpeg', 'tag' => 'Premium &middot; Embroidered &middot; Eid'],
                ['name' => 'Makeup', 'img' => '/make-up.jpeg', 'tag' => 'Lipsticks &middot; Perfumes &middot; Skincare'],
            ] as $cat)
                <a href="/collections?category={{ urlencode($cat['name']) }}" class="luxury-card group relative overflow-hidden rounded-2xl">
                    <div class="aspect-[3/4] overflow-hidden">
                        <img src="{{ $cat['img'] }}" alt="{{ $cat['name'] }}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-5">
                        <p class="text-[10px] uppercase tracking-[0.28em] text-sand/80">{!! $cat['tag'] !!}</p>
                        <h3 class="mt-1 text-lg font-semibold text-cream">{{ $cat['name'] }}</h3>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</section>

{{-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
     MARQUEE STRIP
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â --}}
<section class="border-y border-gold/[0.08] overflow-hidden py-5">
    <div class="animate-marquee flex gap-6 whitespace-nowrap">
        @foreach(['SAPPHURA', 'SIGNATURE EDIT', 'PREMIUM QUALITY', 'NAVY & GOLD', 'LUXURY FASHION', 'CRAFTED WITH CARE', 'SAPPHURA', 'SIGNATURE EDIT', 'PREMIUM QUALITY', 'NAVY & GOLD', 'LUXURY FASHION', 'CRAFTED WITH CARE'] as $item)
            <span class="flex items-center gap-6 text-xs uppercase tracking-[0.3em] text-cream/30">
                <span class="h-1.5 w-1.5 rounded-full bg-gold/40"></span>
                {{ $item }}
            </span>
        @endforeach
    </div>
</section>

{{-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
     EID UL ADHA Ã¢â‚¬â€ Festival editorial section
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â --}}
<section class="relative overflow-hidden" style="background:#07090b; border-top:1px solid rgba(212,175,55,0.07);">

  {{-- Atmospheric glow layers --}}
  <div class="pointer-events-none absolute inset-0 z-0"
       style="background:radial-gradient(ellipse 65% 55% at 82% 8%, rgba(212,175,55,0.055) 0%, transparent 62%);"></div>
  <div class="pointer-events-none absolute inset-0 z-0"
       style="background:radial-gradient(ellipse 55% 50% at 8% 88%, rgba(5,22,8,0.55) 0%, transparent 65%);"></div>
  <div class="pointer-events-none absolute inset-0 z-0"
       style="background:radial-gradient(ellipse 40% 40% at 50% 50%, rgba(212,175,55,0.018) 0%, transparent 70%);"></div>

  {{-- Giant "EID" watermark --}}
  <div class="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap overflow-hidden"
       style="font-family:Georgia,serif; font-size:clamp(120px,22vw,290px); font-weight:700; -webkit-text-stroke:1px rgba(212,175,55,0.045); color:transparent; line-height:1; user-select:none; letter-spacing:0.1em;">EID</div>

  <div class="section-shell relative z-10 py-16 md:py-20 lg:py-24">

    {{-- Ã¢â€â‚¬Ã¢â€â‚¬ Section header Ã¢â€â‚¬Ã¢â€â‚¬ --}}
    <div class="mb-10 md:mb-14">
      <div class="mb-5 flex items-center gap-3.5 flex-wrap">
        <div class="flex flex-col gap-[4px]">
          <span class="h-px w-10 block" style="background:rgba(212,175,55,0.45);"></span>
          <span class="h-px w-5 block" style="background:rgba(212,175,55,0.2);"></span>
        </div>
        <p class="text-[9px] uppercase tracking-[0.55em] font-light" style="color:rgba(212,175,55,0.5);">Festival Edit &middot; Eid ul Adha 2026</p>
        <div class="hidden md:flex items-center gap-2 ml-auto">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" style="color:rgba(212,175,55,0.35);">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
          </svg>
          <p class="text-[7px] uppercase tracking-[0.5em] font-light" style="color:rgba(255,255,255,0.22);">MMXXVI</p>
        </div>
      </div>
      <h2 class="font-light leading-[0.83]"
          style="font-family:Georgia,serif; font-size:clamp(2.8rem,5.5vw,5.8rem); color:#fff7ef; letter-spacing:-0.02em;">
        Eid<br>
        <em style="font-style:italic; -webkit-text-stroke:1px rgba(212,175,55,0.6); color:transparent;">ul Adha</em><br>
        <span style="color:rgba(255,247,239,0.7);">Edit.</span>
      </h2>
    </div>

    {{-- Ã¢â€â‚¬Ã¢â€â‚¬ Main bento grid Ã¢â€â‚¬Ã¢â€â‚¬ --}}
    <div class="grid gap-3 md:gap-4 lg:grid-cols-[3fr_2fr]" style="min-height:500px;">

      {{-- LEFT: Main feature video --}}
      <div class="relative overflow-hidden rounded-[22px]"
           style="border:1px solid rgba(212,175,55,0.13); box-shadow:0 0 60px rgba(212,175,55,0.04), inset 0 1px 0 rgba(212,175,55,0.09);">
        <video src="/bakra-eid.mp4" autoplay muted loop playsinline preload="metadata"
               class="h-full w-full object-cover"
               style="aspect-ratio:4/3; min-height:300px;"></video>

        {{-- Inner gradients --}}
        <div class="pointer-events-none absolute inset-0"
             style="background:linear-gradient(112deg, rgba(7,9,11,0.52) 0%, transparent 42%);"></div>
        <div class="pointer-events-none absolute inset-0"
             style="background:linear-gradient(to top, rgba(7,9,11,0.9) 0%, rgba(7,9,11,0.35) 22%, transparent 48%);"></div>

        {{-- Top-left label --}}
        <div class="absolute left-5 top-5 flex items-center gap-2.5">
          <span class="h-px w-4 block" style="background:rgba(212,175,55,0.4);"></span>
          <span class="text-[8px] uppercase tracking-[0.5em] font-light" style="color:rgba(212,175,55,0.65);">Eid &middot; 2026</span>
        </div>

        {{-- Ghost number "01" --}}
        <div class="absolute right-3 top-1/2 -translate-y-1/2 select-none hidden lg:block"
             style="font-family:Georgia,serif; font-size:130px; font-weight:700; -webkit-text-stroke:1px rgba(212,175,55,0.07); color:transparent; line-height:1; user-select:none;">01</div>

        {{-- Bottom: floating badge + CTA --}}
        <div class="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 flex-wrap">
          <span class="rounded-full px-4 py-1.5 text-[9px] uppercase tracking-[0.32em] font-light backdrop-blur-[6px]"
                style="border:1px solid rgba(212,175,55,0.28); background:rgba(0,0,0,0.48); color:rgba(212,175,55,0.9);">
            Eid Collection
          </span>
          <a href="/collections"
             class="rounded-full px-5 py-2 text-[9px] uppercase tracking-[0.28em] font-medium backdrop-blur-[6px] transition-all duration-300 inline-flex items-center gap-2"
             style="background:rgba(212,175,55,0.13); border:1px solid rgba(212,175,55,0.45); color:rgba(212,175,55,0.9);"
             onmouseover="this.style.background='rgba(212,175,55,0.88)'; this.style.color='#09111f'; this.style.borderColor='#d4af37';"
             onmouseout="this.style.background='rgba(212,175,55,0.13)'; this.style.color='rgba(212,175,55,0.9)'; this.style.borderColor='rgba(212,175,55,0.45)';">
            Shop Now
            <svg class="h-2.5 w-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>

      {{-- RIGHT: Glass card stack --}}
      <div class="flex flex-col gap-3 md:gap-4">

        {{-- Editorial glass card --}}
        <div class="flex flex-1 flex-col justify-between rounded-[22px] p-6 md:p-7"
             style="border:1px solid rgba(212,175,55,0.1); background:linear-gradient(148deg, rgba(13,21,14,0.97) 0%, rgba(8,12,20,0.93) 100%); box-shadow:inset 0 1px 0 rgba(212,175,55,0.08), 0 30px 60px rgba(0,0,0,0.28);">
          <div>
            <p class="text-[8px] uppercase tracking-[0.52em] font-light mb-3" style="color:rgba(212,175,55,0.46);">Exclusive Offers</p>
            <h3 class="font-light leading-[1.04]"
                style="font-family:Georgia,serif; font-size:clamp(1.35rem,2.2vw,2.1rem); color:#fff7ef;">
              Curated For<br>The Celebration.
            </h3>
            <p class="mt-3 leading-relaxed" style="font-size:11px; color:rgba(255,247,239,0.34);">
              Special festival pricing on jewelry, stitch suits &amp; clothing.
            </p>
          </div>
          <div>
            {{-- 2x2 category pills --}}
            <div class="mt-5 grid grid-cols-2 gap-2">
              @foreach(['Jewelry', 'Stitch Suits', 'Clothing', 'Makeup'] as $eidCat)
                <a href="/collections?category={{ urlencode($eidCat) }}"
                   class="block rounded-xl py-2.5 text-center text-[9px] uppercase tracking-[0.22em] font-light transition-all duration-200"
                   style="border:1px solid rgba(212,175,55,0.13); background:rgba(212,175,55,0.04); color:rgba(212,175,55,0.55);"
                   onmouseover="this.style.background='rgba(212,175,55,0.1)'; this.style.borderColor='rgba(212,175,55,0.4)'; this.style.color='rgba(212,175,55,1)';"
                   onmouseout="this.style.background='rgba(212,175,55,0.04)'; this.style.borderColor='rgba(212,175,55,0.13)'; this.style.color='rgba(212,175,55,0.55)';">{{ $eidCat }}</a>
              @endforeach
            </div>
            {{-- Main CTA --}}
            <a href="/collections"
               class="mt-4 flex w-full items-center justify-between rounded-xl px-5 py-3.5 transition-all duration-300"
               style="border:1px solid rgba(212,175,55,0.5); color:rgba(212,175,55,0.9); background:rgba(212,175,55,0.06);"
               onmouseover="this.style.background='#d4af37'; this.style.color='#09111f'; this.style.borderColor='#d4af37';"
               onmouseout="this.style.background='rgba(212,175,55,0.06)'; this.style.color='rgba(212,175,55,0.9)'; this.style.borderColor='rgba(212,175,55,0.5)';">
              <span class="text-[10px] uppercase tracking-[0.38em] font-light">Shop Eid Offers</span>
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4-4 4M3 12h18"/>
              </svg>
            </a>
          </div>
        </div>

        {{-- Mini video card --}}
        <div class="relative overflow-hidden rounded-[22px]"
             style="border:1px solid rgba(212,175,55,0.1); box-shadow:inset 0 1px 0 rgba(212,175,55,0.05);">
          <video src="/bakra-eid 2.mp4" autoplay muted loop playsinline preload="metadata"
                 class="w-full object-cover" style="aspect-ratio:16/9;"></video>
          <div class="pointer-events-none absolute inset-0"
               style="background:linear-gradient(to top, rgba(7,9,11,0.72) 0%, transparent 55%);"></div>
          <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <p class="text-[9px] uppercase tracking-[0.3em] font-light" style="color:rgba(255,255,255,0.42);">Signature Edit</p>
            <span class="select-none font-light" style="font-family:Georgia,serif; font-size:30px; -webkit-text-stroke:0.5px rgba(212,175,55,0.32); color:transparent; line-height:1;">02</span>
          </div>
        </div>

      </div>
    </div>

    {{-- Ã¢â€â‚¬Ã¢â€â‚¬ Stats strip Ã¢â€â‚¬Ã¢â€â‚¬ --}}
    <div class="mt-3 grid grid-cols-3 gap-3 md:mt-4 md:gap-4">
      @foreach([
        ['label' => 'Eid Pieces', 'value' => '200+'],
        ['label' => 'Festival Offer', 'value' => 'Live Now'],
        ['label' => 'Free Ship', 'value' => '1500+ PKR'],
      ] as $stat)
        <div class="rounded-[16px] px-4 py-4 text-center"
             style="border:1px solid rgba(212,175,55,0.08); background:rgba(212,175,55,0.025);">
          <p class="mb-1 text-[8px] uppercase tracking-[0.3em] font-light" style="color:rgba(212,175,55,0.38);">{{ $stat['label'] }}</p>
          <p class="font-light" style="font-family:Georgia,serif; font-size:1.3rem; color:#fff7ef;">{{ $stat['value'] }}</p>
        </div>
      @endforeach
    </div>

  </div>
</section>

{{-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
     BEST SELLERS
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â --}}
{{-- Stitch Suit Collection --}}
<section class="relative overflow-hidden border-t border-gold/[0.08] py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-8 flex items-end justify-between gap-4 md:mb-10">
            <div>
                <p class="mb-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.50em] text-sand/60 md:text-[10px]">
                    <span class="inline-block h-px w-5 bg-gold/30"></span>
                    New Arrival
                </p>
                <h2 class="text-[2rem] font-light leading-[0.90] text-cream sm:text-[2.8rem] lg:text-[3.5rem]"
                    style="font-family: Georgia, serif;">
                    Stitched Suit<br>
                    <span class="text-gold/75">Edit.</span>
                </h2>
            </div>
            <a href="/collections?category=Stitch+Suits"
               class="hidden sm:inline-flex items-center gap-2 rounded-full border border-gold/25 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/70 transition hover:bg-gold hover:text-ink hover:border-gold">
                View All
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4-4 4M3 12h18"/></svg>
            </a>
        </div>

        <div class="flex flex-col gap-3 lg:flex-row lg:gap-4">

            {{-- Featured video --}}
            <div class="relative overflow-hidden rounded-2xl lg:w-[38%] lg:flex-shrink-0"
                 style="border: 1px solid rgba(212,175,55,0.14);">
                <video src="/stitch%20suit/latest-vid1.mp4" autoplay muted loop playsinline preload="metadata"
                       class="h-full w-full object-cover"
                       style="min-height:340px; max-height:560px; object-fit:cover;"></video>
                <div class="pointer-events-none absolute inset-0"
                     style="background: linear-gradient(to top, rgba(0,0,0,0.50), transparent 55%);"></div>
                <div class="absolute bottom-4 left-4">
                    <span class="rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold backdrop-blur-md"
                          style="border: 1px solid rgba(212,175,55,0.25); background: rgba(0,0,0,0.40);">Latest Stitched</span>
                </div>
            </div>

            {{-- 2x2 image grid --}}
            <div class="grid grid-cols-2 gap-3 lg:flex-1 lg:gap-4">
                @foreach(['/stitch%20suit/img-1.jpeg', '/stitch%20suit/img-2.jpeg', '/stitch%20suit/img-3.jpeg', '/stitch%20suit/img-4.jpeg'] as $stitchImg)
                    <div class="relative overflow-hidden rounded-xl group"
                         style="border: 1px solid rgba(212,175,55,0.10);">
                        <img src="{{ $stitchImg }}" alt="Stitched Suit"
                             class="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                             loading="lazy">
                        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                @endforeach
            </div>

        </div>

        <div class="mt-6 text-center sm:hidden">
            <a href="/collections?category=Stitch+Suits"
               class="inline-flex items-center gap-2 rounded-full border border-gold/25 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/70 transition hover:bg-gold hover:text-ink">
                View All Stitched Suits
            </a>
        </div>
    </div>
</section>

<section class="py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 text-center">
            <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">Curated Selection</p>
            <h2 class="mt-2 text-2xl font-semibold text-cream md:text-3xl">Best Sellers</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @foreach($featured as $product)
                @include('partials.product-card', ['product' => $product])
            @endforeach
        </div>
        <div class="text-center mt-10">
            <a href="/collections" class="inline-flex items-center gap-2 rounded-full border border-white/[0.18] bg-white/[0.06] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream hover:border-gold/[0.45] hover:bg-white/10 transition">
                View All Products
            </a>
        </div>
    </div>
</section>

{{-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
     BRAND STORY
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â --}}
<section class="border-t border-gold/[0.08] py-16 md:py-20">
    <div class="section-shell">
        <div class="grid items-center gap-10 lg:grid-cols-2">
            <div class="group relative overflow-hidden rounded-3xl border border-gold/[0.12]"
                 x-data="{ hover: false }" @mouseenter="hover = true" @mouseleave="hover = false">
                <img src="/summer-2.jpeg" alt="Sapphura brand story"
                     class="aspect-[4/3] w-full object-cover transition-opacity duration-500"
                     :class="hover ? 'opacity-0' : 'opacity-100'">
                <video src="/eid collection.mp4" autoplay muted loop playsinline preload="metadata"
                       class="absolute inset-0 aspect-[4/3] w-full object-cover transition-opacity duration-500"
                       :class="hover ? 'opacity-100' : 'opacity-0'"></video>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent"></div>
                <div class="absolute bottom-4 left-4">
                    <span class="rounded-full border border-gold/20 bg-ink/60 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gold backdrop-blur-md">Hover to play</span>
                </div>
            </div>
            <div>
                <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">Our Story</p>
                <h2 class="mt-3 text-2xl font-semibold leading-tight text-cream md:text-3xl lg:text-4xl">Crafting Elegance<br>Since Day One</h2>
                <p class="mt-5 text-sm leading-7 text-cream/60">At Sapphura, we believe every woman deserves to feel extraordinary. Our collections are crafted with passion, blending traditional artistry with modern design to create pieces that tell your unique story.</p>
                <div class="mt-6 flex flex-wrap gap-2">
                    <span class="rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold">Luxury First</span>
                    <span class="rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold">Premium Quality</span>
                    <span class="rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold">Trusted Brand</span>
                </div>
                <div class="mt-8 grid grid-cols-3 gap-6">
                    <div><p class="text-2xl font-bold text-gold">10K+</p><p class="text-[10px] uppercase tracking-[0.18em] text-cream/40 mt-1">Happy Customers</p></div>
                    <div><p class="text-2xl font-bold text-gold">500+</p><p class="text-[10px] uppercase tracking-[0.18em] text-cream/40 mt-1">Products</p></div>
                    <div><p class="text-2xl font-bold text-gold">50+</p><p class="text-[10px] uppercase tracking-[0.18em] text-cream/40 mt-1">Collections</p></div>
                </div>
                <a href="/about" class="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:bg-gold-light transition">
                    Read Full Story
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </a>
            </div>
        </div>
    </div>
</section>

{{-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
     NEW ARRIVALS
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â --}}
<section class="border-t border-gold/[0.08] py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 text-center">
            <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">Just In</p>
            <h2 class="mt-2 text-2xl font-semibold text-cream md:text-3xl">New Arrivals</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @foreach($latest as $product)
                @include('partials.product-card', ['product' => $product])
            @endforeach
        </div>
    </div>
</section>

{{-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
     TESTIMONIALS + NEWSLETTER
Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â --}}
<section class="relative border-t border-gold/[0.08] py-16 md:py-20 overflow-hidden">
    <div class="absolute inset-0">
        <img src="/summer-2.jpeg" alt="" class="h-full w-full object-cover opacity-[0.08]">
    </div>
    <div class="section-shell relative z-10">
        <div class="grid gap-8 lg:grid-cols-2">
            <div>
                <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">What They Say</p>
                <h2 class="mt-2 mb-8 text-2xl font-semibold text-cream md:text-3xl">Customer Love</h2>
                <div class="space-y-4">
                    @foreach([
                        ['name' => 'Areeba Khan', 'text' => 'Absolutely stunning jewelry! The quality exceeded my expectations. The packaging felt like unwrapping a luxury gift.'],
                        ['name' => 'Sana Malik', 'text' => 'The abaya collection is gorgeous. Perfect fit and beautiful fabric. Every detail speaks premium craftsmanship.'],
                        ['name' => 'Hania Saeed', 'text' => 'Fast delivery and amazing quality. The necklace set looks even better in person. Will order again!'],
                    ] as $testimonial)
                        <div class="glass rounded-2xl p-5">
                            <div class="flex gap-1 mb-3">
                                @for($i = 0; $i < 5; $i++)
                                    <svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                @endfor
                            </div>
                            <p class="text-sm text-cream/70 italic leading-relaxed mb-3">"{{ $testimonial['text'] }}"</p>
                            <p class="text-gold text-xs font-semibold uppercase tracking-[0.14em]">{{ $testimonial['name'] }}</p>
                        </div>
                    @endforeach
                </div>
            </div>
            <div class="flex flex-col justify-center">
                <div class="glass rounded-2xl p-8 md:p-10">
                    <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">Stay Updated</p>
                    <h2 class="mt-2 text-2xl font-semibold text-cream md:text-3xl">Join The Inner Circle</h2>
                    <p class="mt-4 text-sm text-cream/50 leading-relaxed">Get exclusive access to new arrivals, special offers, and styling tips delivered straight to your inbox.</p>
                    <form class="mt-6 space-y-3" onsubmit="event.preventDefault(); this.querySelector('button').textContent='Subscribed Ã¢Å“â€œ';">
                        <input type="email" placeholder="Your email address" required
                               class="w-full px-4 py-3 rounded-xl bg-ink border border-gold/20 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-sm">
                        <button type="submit" class="w-full py-3 bg-gold text-ink font-bold text-xs rounded-xl hover:bg-gold-light transition tracking-[0.18em] uppercase">Subscribe</button>
                    </form>
                    <p class="mt-3 text-[10px] text-cream/30 uppercase tracking-[0.14em]">No spam Ã¢â‚¬â€ just curated luxury updates.</p>
                </div>
            </div>
        </div>
    </div>
</section>

@endsection
