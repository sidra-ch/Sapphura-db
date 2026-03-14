"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Bell, Shield, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'store', label: 'Store Settings', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      <div className="p-4 lg:p-8">
        <div className="flex items-center gap-4 mb-8">
<Link href="/admin" className="p-2 bg-[#1a1a40] rounded-lg text-gold hover:bg-gold/20 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Settings</h1>
            <p className="text-white/50">Manage your store settings</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 space-y-2">
            {tabs.map(tab => {
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
          </div>

          <div className="flex-1 bg-[#1a1a40] border border-gold/20 rounded-xl p-6">
            {activeTab === 'general' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gold mb-6">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Store Name</label>
                    <input type="text" defaultValue="Sapphura" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Store Email</label>
                    <input type="email" defaultValue="info@sapphura.com" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Phone Number</label>
                    <input type="tel" defaultValue="+92 332 0924951" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Address</label>
                    <textarea rows={3} defaultValue="Shop #35, Nadir Plaza, 5th Road Commercial Market, D Block, Satellite Town, Rawalpindi, Pakistan 46000" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold resize-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gold mb-6">Notification Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Order Notifications', desc: 'Get notified when new orders are placed' },
                    { label: 'Low Stock Alerts', desc: 'Alert when products are running low' },
                    { label: 'Customer Reviews', desc: 'Notify when new reviews are posted' },
                    { label: 'Email Marketing', desc: 'Receive promotional emails' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-[#0a0a23] rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-white/50 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gold mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Current Password</label>
                    <input type="password" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">New Password</label>
                    <input type="password" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Confirm Password</label>
                    <input type="password" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gold mb-6">Appearance Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Theme</label>
                    <div className="flex gap-4">
                      <button className="flex-1 p-4 bg-[#0a0a23] border-2 border-gold rounded-lg text-white">Dark</button>
                      <button className="flex-1 p-4 bg-white text-black border border-gray-300 rounded-lg opacity-50">Light</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Accent Color</label>
                    <div className="flex gap-3">
                      {['#d4af37', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'].map(color => (
                        <button key={color} className={`w-10 h-10 rounded-full border-2 ${color === '#d4af37' ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'store' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gold mb-6">Store Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Currency</label>
                    <select className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold">
                      <option>USD ($)</option>
                      <option>PKR (Rs)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Tax Rate (%)</label>
                    <input type="number" defaultValue="15" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Free Shipping Threshold</label>
                    <input type="number" defaultValue="500" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold" />
                  </div>
                </div>
              </motion.div>
            )}

            <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-gold text-[#0a0a23] rounded-lg font-bold hover:bg-yellow-400 transition">
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
