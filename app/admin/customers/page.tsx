"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Plus, Eye, Mail, Phone } from 'lucide-react';

const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+92 300 1234567', orders: 5, spent: 2450, joinDate: '2024-01-01', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+92 300 2345678', orders: 3, spent: 1890, joinDate: '2024-01-05', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+92 300 3456789', orders: 8, spent: 4520, joinDate: '2023-12-15', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+92 300 4567890', orders: 2, spent: 890, joinDate: '2024-01-10', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: 5, name: 'Ahmed Khan', email: 'ahmed@example.com', phone: '+92 300 5678901', orders: 12, spent: 6780, joinDate: '2023-11-20', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      <div className="p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-[#1a1a40] rounded-lg text-gold hover:bg-gold/20 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Customers</h1>
              <p className="text-white/50">Manage your customer database</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gold text-[#0a0a23] rounded-lg font-semibold hover:bg-yellow-400 transition">
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
                <div className="flex items-center gap-4">
                  <img src={customer.avatar} alt={customer.name} className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-gold" />
                  <div>
                    <h3 className="text-gold font-bold text-lg">{customer.name}</h3>
                    <div className="flex flex-wrap gap-4 text-white/50 text-sm">
                      <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {customer.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {customer.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6">
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
