"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import { User, Package, Heart, MapPin, Lock, LogOut, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const tabs = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'password', label: 'Change Password', icon: Lock },
];

const demoOrders = [
  { id: 'ORD-001', date: '2024-01-15', status: 'Delivered', total: 599, items: 3 },
  { id: 'ORD-002', date: '2024-01-20', status: 'Shipped', total: 299, items: 1 },
  { id: 'ORD-003', date: '2024-01-25', status: 'Processing', total: 449, items: 2 },
];

const demoWishlist = [
  { id: '1', name: 'Gold Crescent Necklace', price: 299, image: '/neckles-1.jpeg' },
  { id: '2', name: 'Diamond Bracelet', price: 399, image: '/bracelet-1.jpeg' },
];

export default function AccountPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/store/login');
    }
  }, [user, router, isLoading]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Skeleton height={40} width={200} baseColor="#0a0a23" highlightColor="#1a1a40" className="mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[#1a1a40] border border-gold rounded-2xl p-6">
                <div className="text-center mb-6">
                  <Skeleton height={80} width={80} circle baseColor="#0a0a23" highlightColor="#1a1a40" className="mx-auto mb-4" />
                  <Skeleton height={20} width="60%" baseColor="#0a0a23" highlightColor="#1a1a40" className="mx-auto" />
                  <Skeleton height={16} width="80%" baseColor="#0a0a23" highlightColor="#1a1a40" className="mx-auto mt-2" />
                </div>
                <div className="space-y-2">
                  {[1,2,3,4,5].map(i => (
                    <Skeleton key={i} height={48} baseColor="#0a0a23" highlightColor="#1a1a40" className="rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-[#1a1a40] border border-gold rounded-2xl p-6">
                <Skeleton height={32} width={200} baseColor="#0a0a23" highlightColor="#1a1a40" className="mb-6" />
                <Skeleton height={20} width="100%" baseColor="#0a0a23" highlightColor="#1a1a40" className="mb-2" />
                <Skeleton height={20} width="100%" baseColor="#0a0a23" highlightColor="#1a1a40" className="mb-2" />
                <Skeleton height={20} width="60%" baseColor="#0a0a23" highlightColor="#1a1a40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gold mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a40] border border-gold rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-gold" />
                </div>
                <h3 className="text-white font-semibold">{user.name || 'User'}</h3>
                <p className="text-white/50 text-sm">{user.email}</p>
                <span className="inline-block bg-gold/20 text-gold text-xs px-3 py-1 rounded-full mt-2 capitalize">
                  {user.role}
                </span>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeTab === tab.id
                          ? 'bg-gold text-[#0a0a23]'
                          : 'text-white/70 hover:bg-gold/10 hover:text-gold'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div
              key={activeTab}
              className="bg-[#1a1a40] border border-gold rounded-2xl p-6 animate-fade-in"
            >
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gold mb-6">Profile Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user.name || ''}
                        className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue={user.phone || ''}
                        className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white"
                      />
                    </div>
                  </div>
                  <button className="mt-6 px-6 py-3 bg-gold text-[#0a0a23] rounded-lg font-bold hover:bg-yellow-400 transition">
                    Save Changes
                  </button>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gold mb-6">My Orders</h2>
                  {demoOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                      <p className="text-white/60">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {demoOrders.map((order) => (
                        <div key={order.id} className="bg-[#0a0a23] rounded-xl p-4 border border-gold/20">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-gold font-semibold">{order.id}</h3>
                              <p className="text-white/50 text-sm">{order.date}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">{order.items} items</span>
                            <span className="text-gold font-bold text-xl">${order.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-gold mb-6">My Wishlist</h2>
                  {demoWishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                      <p className="text-white/60">Your wishlist is empty</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {demoWishlist.map((item) => (
                        <div key={item.id} className="bg-[#0a0a23] rounded-xl p-4 border border-gold/20 flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gold" />
                          <div className="flex-1">
                            <h3 className="text-gold font-medium">{item.name}</h3>
                            <p className="text-white font-bold">${item.price}</p>
                          </div>
                          <button className="p-2 bg-gold text-[#0a0a23] rounded-full hover:bg-yellow-400 transition">
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl font-bold text-gold mb-6">Saved Addresses</h2>
                  <div className="bg-[#0a0a23] rounded-xl p-6 border border-gold/20">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-gold font-semibold">Home Address</h3>
                        <p className="text-white/70 mt-2">123 Main Street<br />Lahore, Pakistan<br />+92 300 1234567</p>
                      </div>
                      <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded">Default</span>
                    </div>
                    <button className="text-gold text-sm hover:text-yellow-300">Edit Address</button>
                  </div>
                  <button className="mt-4 w-full py-3 border-2 border-dashed border-gold/30 text-gold rounded-lg hover:border-gold transition">
                    + Add New Address
                  </button>
                </div>
              )}

              {activeTab === 'password' && (
                <div>
                  <h2 className="text-2xl font-bold text-gold mb-6">Change Password</h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Current Password</label>
                      <input type="password" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">New Password</label>
                      <input type="password" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Confirm New Password</label>
                      <input type="password" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white" />
                    </div>
                    <button className="px-6 py-3 bg-gold text-[#0a0a23] rounded-lg font-bold hover:bg-yellow-400 transition">
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}