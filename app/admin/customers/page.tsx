"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Plus, Eye, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthContext';

type CustomerRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  joinDate: string;
  avatar: string;
};

export default function CustomersPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<CustomerRow[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadCustomers() {
      if (!token) {
        return;
      }

      try {
        const res = await fetch('/api/users', {
          cache: 'no-store',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data.users) || !mounted) return;

        setCustomers(
          data.users
            .filter((u: { role: string }) => u.role === 'customer')
            .map((u: { id: number; name: string | null; email: string; phone: string | null; createdAt: string }) => ({
              id: u.id,
              name: u.name || 'Customer',
              email: u.email,
              phone: u.phone || 'N/A',
              orders: 0,
              spent: 0,
              joinDate: new Date(u.createdAt).toISOString().slice(0, 10),
              avatar: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569411/neckles-1_hpggw5.jpg',
            }))
        );
      } catch {
        // keep page stable
      }
    }

    loadCustomers();
    return () => {
      mounted = false;
    };
  }, [token]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 lg:mb-8">
          <div className="flex items-start sm:items-center gap-4">
            <Link href="/admin" className="p-2 bg-[#1a1a40] rounded-lg text-gold hover:bg-gold/20 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Customers</h1>
              <p className="text-white/50">Manage your customer database</p>
            </div>
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gold text-[#0a0a23] rounded-lg font-semibold hover:bg-yellow-400 transition">
            <Plus className="w-5 h-5" /> Add Customer
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1a1a40] border border-gold/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold"
          />
        </div>

        <div className="space-y-4">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#1a1a40] border border-gold/20 rounded-xl p-4 lg:p-6 hover:border-gold transition cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={customer.avatar} alt={customer.name} className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-gold" />
                  <div className="min-w-0">
                    <h3 className="text-gold font-bold text-lg">{customer.name}</h3>
                    <div className="flex flex-wrap gap-4 text-white/50 text-sm">
                      <span className="flex items-center gap-1 break-all"><Mail className="w-4 h-4 shrink-0" /> {customer.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {customer.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">{customer.orders}</p>
                    <p className="text-white/50 text-sm">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gold font-bold text-lg">${customer.spent.toLocaleString()}</p>
                    <p className="text-white/50 text-sm">Total Spent</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-white/70 text-sm">{customer.joinDate}</p>
                    <p className="text-white/50 text-xs">Member Since</p>
                  </div>
                  <button className="p-2 text-gold hover:bg-gold/20 rounded-lg transition">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
