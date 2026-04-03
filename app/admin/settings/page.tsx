"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Bell, Shield, Palette, Globe, Smartphone, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [otpDebug, setOtpDebug] = useState({
    email: '',
    phone: '',
    channel: 'email' as const,
    otp: '',
  });
  const [otpDebugLoading, setOtpDebugLoading] = useState(false);
  const [otpDebugMessage, setOtpDebugMessage] = useState('');
  const [otpDebugError, setOtpDebugError] = useState('');
  const [otpDebugResponse, setOtpDebugResponse] = useState<string>('');

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'store', label: 'Store Settings', icon: Globe },
    { id: 'otp-debug', label: 'OTP Debug', icon: Smartphone },
  ];

  const sendDebugOtp = async () => {
    setOtpDebugLoading(true);
    setOtpDebugError('');
    setOtpDebugMessage('');
    setOtpDebugResponse('');

    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          email: otpDebug.email,
          phone: otpDebug.phone,
          otpChannel: otpDebug.channel,
          purpose: 'admin-debug',
        }),
      });

      const data = await res.json();
      setOtpDebugResponse(JSON.stringify(data, null, 2));

      if (!res.ok) {
        setOtpDebugError(data.error || 'Failed to send OTP');
        return;
      }

      setOtpDebugMessage(data.message || 'OTP sent successfully');
    } catch {
      setOtpDebugError('Failed to send OTP.');
    } finally {
      setOtpDebugLoading(false);
    }
  };

  const verifyDebugOtp = async () => {
    setOtpDebugLoading(true);
    setOtpDebugError('');
    setOtpDebugMessage('');
    setOtpDebugResponse('');

    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          email: otpDebug.email,
          otp: otpDebug.otp,
          purpose: 'admin-debug',
        }),
      });

      const data = await res.json();
      setOtpDebugResponse(JSON.stringify(data, null, 2));

      if (!res.ok) {
        setOtpDebugError(data.error || 'OTP verify failed');
        return;
      }

      setOtpDebugMessage(data.message || 'OTP verified successfully');
    } catch {
      setOtpDebugError('Failed to verify OTP.');
    } finally {
      setOtpDebugLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-start sm:items-center gap-4 mb-6 lg:mb-8">
            <Link href="/admin" className="p-2 bg-[#1a1a40] rounded-lg text-gold hover:bg-gold/20 transition shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
            <p className="text-white/50">Manage your store settings</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 overflow-x-auto lg:overflow-visible -mx-1 px-1 lg:mx-0 lg:px-0">
            <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition whitespace-nowrap ${
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
          </div>

          <div className="flex-1 min-w-0 bg-[#1a1a40] border border-gold/20 rounded-xl p-4 sm:p-6">
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
                    <input type="email" defaultValue="Sapphura@gmail.com" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold" />
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
                    <div key={item.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-[#0a0a23] rounded-lg">
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
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="flex-1 p-4 bg-[#0a0a23] border-2 border-gold rounded-lg text-white">Dark</button>
                      <button className="flex-1 p-4 bg-white text-black border border-gray-300 rounded-lg opacity-50">Light</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Accent Color</label>
                    <div className="flex flex-wrap gap-3">
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

            {activeTab === 'otp-debug' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-gold mb-3">OTP Delivery Debug</h2>
                <p className="text-white/60 text-sm mb-6">
                  OTP is temporarily locked to email delivery mode. Use this panel to send and verify email OTP and inspect response.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      value={otpDebug.email}
                      onChange={(e) => setOtpDebug((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                      placeholder="customer@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Phone (PK)</label>
                    <input
                      type="tel"
                      value={otpDebug.phone}
                      onChange={(e) => setOtpDebug((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                      placeholder="03344020777 or +923344020777"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">OTP Channel</label>
                    <p className="px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white/80 text-sm">
                      EMAIL (temporary mode)
                    </p>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">OTP Code (for verify)</label>
                    <input
                      type="text"
                      value={otpDebug.otp}
                      onChange={(e) => setOtpDebug((prev) => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                      className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold"
                      placeholder="6-digit OTP"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={sendDebugOtp}
                      disabled={otpDebugLoading || !otpDebug.email}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gold text-[#0a0a23] rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {otpDebugLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Send OTP
                    </button>
                    <button
                      type="button"
                      onClick={verifyDebugOtp}
                      disabled={otpDebugLoading || !otpDebug.email || otpDebug.otp.length !== 6}
                      className="w-full sm:w-auto px-5 py-2.5 border border-gold text-gold rounded-lg font-semibold hover:bg-gold/10 transition disabled:opacity-60"
                    >
                      Verify OTP
                    </button>
                  </div>

                  {otpDebugMessage && <p className="text-green-400 text-sm">{otpDebugMessage}</p>}
                  {otpDebugError && <p className="text-red-400 text-sm">{otpDebugError}</p>}

                  {otpDebugResponse && (
                    <div>
                      <p className="text-white/70 text-sm mb-2">Latest API Response</p>
                      <pre className="text-xs text-white/80 bg-[#0a0a23] border border-gold/20 rounded-lg p-3 overflow-auto max-h-56">{otpDebugResponse}</pre>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            <button className="mt-6 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gold text-[#0a0a23] rounded-lg font-bold hover:bg-yellow-400 transition">
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
