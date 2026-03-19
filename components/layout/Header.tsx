"use client";

import { ShoppingBag, User, Search, Heart, Menu, X, LogOut, Settings, UserCircle, Package } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../cart/CartContext';
import { useWishlist } from '../wishlist/WishlistContext';
import { useAuth } from '../auth/AuthContext';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user: clerkUser, isLoaded } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setAccountMenuOpen(false);
    router.push('/');
  };
  
  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-[#0B1A2F] border-b border-gold shadow-xl transition-all duration-200">
      <Link 
        href="/"
        className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gold rounded-lg"
      >
        <img src="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635065/logo-1_nsterf.png" alt="Sapphura Logo" className="w-10 md:w-14 h-10 md:h-14 rounded-full shadow-lg border-2 border-gold" />
        <span className="text-xl md:text-4xl font-extrabold text-gold tracking-widest drop-shadow-lg ml-1 md:ml-2">Sapphura</span>
      </Link>
      
      <nav className="hidden lg:flex gap-4 xl:gap-6 text-white font-semibold relative">
        <Link 
          href="/" 
          className="relative py-4 px-2 group text-white hover:text-gold"
        >
          <span className="relative z-10">Home</span>
          <span className="absolute bottom-2 left-2 right-2 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left"></span>
        </Link>
        
        <div 
          className="relative"
          onMouseEnter={() => setCollectionsOpen(true)}
          onMouseLeave={() => setCollectionsOpen(false)}
        >
          <button 
            className="flex items-center gap-1 py-4 px-2 group text-white hover:text-gold"
          >
            <span className="relative z-10">Collections</span>
            <span className="absolute bottom-2 left-2 right-2 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left"></span>
          </button>
          
          <div 
            className={`absolute top-full left-0 mt-0 bg-[#081220] border border-gold rounded-xl shadow-xl p-4 min-w-[320px] z-50 transition-all duration-200 ${collectionsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 invisible'}`}
          >
            <div className="grid grid-cols-2 gap-2">
              <Link href="/collections?category=necklaces" className="text-gold hover:bg-gold/10 rounded px-3 py-2 transition-all duration-150 hover:translate-x-1">Necklace Sets</Link>
              <Link href="/collections?category=earrings" className="text-gold hover:bg-gold/10 rounded px-3 py-2 transition-all duration-150 hover:translate-x-1">Earrings</Link>
              <Link href="/collections?category=rings" className="text-gold hover:bg-gold/10 rounded px-3 py-2 transition-all duration-150 hover:translate-x-1">Rings</Link>
              <Link href="/collections?category=bracelets" className="text-gold hover:bg-gold/10 rounded px-3 py-2 transition-all duration-150 hover:translate-x-1">Bracelets</Link>
              <Link href="/collections?category=bangles" className="text-gold hover:bg-gold/10 rounded px-3 py-2 transition-all duration-150 hover:translate-x-1">Bangles</Link>
              <Link href="/collections?category=bridal" className="text-gold hover:bg-gold/10 rounded px-3 py-2 transition-all duration-150 hover:translate-x-1">Bridal Sets</Link>
              <Link href="/collections?category=makeup" className="text-gold hover:bg-gold/10 rounded px-3 py-2 transition-all duration-150 hover:translate-x-1">Makeup</Link>
              <Link href="/collections?category=clothing" className="text-gold hover:bg-gold/10 rounded px-3 py-2 transition-all duration-150 hover:translate-x-1">Clothing</Link>
            </div>
          </div>
        </div>
        
        <Link href="/collections" className="relative py-4 px-2 group text-white hover:text-gold">
          <span className="relative z-10">Shop</span>
          <span className="absolute bottom-2 left-2 right-2 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left"></span>
        </Link>
        <Link href="/about" className="relative py-4 px-2 group text-white hover:text-gold">
          <span className="relative z-10">About</span>
          <span className="absolute bottom-2 left-2 right-2 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left"></span>
        </Link>
        <Link href="/contact" className="relative py-4 px-2 group text-white hover:text-gold">
          <span className="relative z-10">Contact</span>
          <span className="absolute bottom-2 left-2 right-2 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left"></span>
        </Link>
        {isAdmin && (
          <Link href="/admin" className="relative py-4 px-2 group text-white hover:text-gold">
            <span className="relative z-10">Dashboard</span>
            <span className="absolute bottom-2 left-2 right-2 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left"></span>
          </Link>
        )}
      </nav>
      
      <div className="flex items-center gap-2 md:gap-4">
        <Link href="/search" className="text-gold hover:text-yellow-400 hover:scale-110 transition-all duration-150 p-2">
          <Search className="w-5 md:w-6 h-5 md:h-6" />
        </Link>
        <Link href="/wishlist" className="relative text-gold hover:text-yellow-400 hover:scale-110 transition-all duration-150 p-2">
          <Heart className="w-5 md:w-6 h-5 md:h-6" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1.5 text-xs font-bold">{wishlistCount}</span>
          )}
        </Link>
        <Link href="/cart" className="relative text-gold hover:text-yellow-400 hover:scale-110 transition-all duration-150 p-2">
          <ShoppingBag className="w-5 md:w-6 h-5 md:h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-gold text-[#0a0a23] rounded-full px-1.5 text-xs font-bold">{totalItems}</span>
          )}
        </Link>
        
        {/* Account Dropdown */}
        <div className="relative" ref={accountMenuRef}>
          <button 
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="text-gold hover:text-yellow-400 hover:scale-110 transition-all duration-150 p-2"
          >
            <User className="w-5 md:w-6 h-5 md:h-6" />
          </button>
          
          <div 
            className={`absolute right-0 top-full mt-2 bg-[#081220] border border-gold rounded-xl shadow-xl min-w-[200px] z-50 transition-all duration-200 ${accountMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 invisible'}`}
          >
            {user ? (
              <div className="p-2">
                <div className="px-3 py-2 border-b border-gold/30 mb-2">
                  <p className="text-gold font-semibold text-sm">{user.name || user.email}</p>
                  <p className="text-white/60 text-xs">{user.email}</p>
                </div>
                <Link href="/account" className="flex items-center gap-2 text-white hover:bg-gold/10 rounded-lg px-3 py-2 transition-all duration-150" onClick={() => setAccountMenuOpen(false)}>
                  <UserCircle className="w-4 h-4 text-gold" />
                  <span>My Account</span>
                </Link>
                <Link href="/account#orders" className="flex items-center gap-2 text-white hover:bg-gold/10 rounded-lg px-3 py-2 transition-all duration-150" onClick={() => setAccountMenuOpen(false)}>
                  <Package className="w-4 h-4 text-gold" />
                  <span>My Orders</span>
                </Link>
                <Link href="/account#settings" className="flex items-center gap-2 text-white hover:bg-gold/10 rounded-lg px-3 py-2 transition-all duration-150" onClick={() => setAccountMenuOpen(false)}>
                  <Settings className="w-4 h-4 text-gold" />
                  <span>Settings</span>
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-2 text-gold hover:bg-gold/10 rounded-lg px-3 py-2 transition-all duration-150" onClick={() => setAccountMenuOpen(false)}>
                    <Settings className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <div className="border-t border-gold/30 mt-2 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 rounded-lg px-3 py-2 transition-all duration-150 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2">
                <Link href="/sign-in" className="block text-center bg-gold text-[#0a0a23] font-semibold rounded-lg px-4 py-2.5 hover:bg-yellow-400 transition-all duration-150 mb-2" onClick={() => setAccountMenuOpen(false)}>
                  Sign In
                </Link>
                <p className="text-center text-white/60 text-sm mb-2">Don't have an account?</p>
                <Link href="/sign-up" className="block text-center border border-gold text-gold rounded-lg px-4 py-2.5 hover:bg-gold/10 transition-all duration-150" onClick={() => setAccountMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <button 
          className="lg:hidden text-gold p-2 hover:bg-gold/10 hover:scale-110 rounded-lg transition-all duration-150" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0B1A2F] border-b border-gold p-4 lg:hidden animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-white hover:text-gold py-2 px-3 rounded hover:bg-gold/10" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/collections" className="text-white hover:text-gold py-2 px-3 rounded hover:bg-gold/10" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
            <Link href="/collections" className="text-white hover:text-gold py-2 px-3 rounded hover:bg-gold/10" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <Link href="/about" className="text-white hover:text-gold py-2 px-3 rounded hover:bg-gold/10" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/contact" className="text-white hover:text-gold py-2 px-3 rounded hover:bg-gold/10" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            {user ? (
              <>
                <Link href="/account" className="text-gold py-2 px-3 rounded hover:bg-gold/10" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                {isAdmin && (
                  <Link href="/admin" className="text-gold py-2 px-3 rounded hover:bg-gold/10" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                )}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-red-400 py-2 px-3 rounded hover:bg-red-500/10 text-left">Logout</button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-gold py-2 px-3 rounded hover:bg-gold/10" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link href="/sign-up" className="text-gold py-2 px-3 rounded hover:bg-gold/10" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
