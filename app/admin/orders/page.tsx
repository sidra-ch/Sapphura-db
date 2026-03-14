"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Download,
  Package, Truck, CheckCircle, Clock, AlertCircle, XCircle,
  MapPin, Calendar, ChevronDown, ChevronUp
} from 'lucide-react';

const orders = [
  { 
    id: 'ORD-001', 
    customer: 'John Doe', 
    email: 'john@example.com',
    phone: '+92 300 1234567',
    address: '123 Main St, Lahore',
    total: 599, 
    status: 'Delivered', 
    date: '2024-01-15', 
    items: [
      { name: 'Gold Crescent Necklace', price: 299, quantity: 1, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop' },
      { name: 'Diamond Earrings', price: 150, quantity: 2, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&fit=crop' }
    ]
  },
  { 
    id: 'ORD-002', 
    customer: 'Jane Smith', 
    email: 'jane@example.com',
    phone: '+92 300 2345678',
    address: '456 Oak Ave, Karachi',
    total: 299, 
    status: 'Shipped', 
    date: '2024-01-14', 
    items: [
      { name: 'Diamond Bracelet', price: 299, quantity: 1, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100&h=100&fit=crop' }
    ]
  },
  { 
    id: 'ORD-003', 
    customer: 'Mike Johnson', 
    email: 'mike@example.com',
    phone: '+92 300 3456789',
    address: '789 Pine Rd, Islamabad',
    total: 449, 
    status: 'Processing', 
    date: '2024-01-13', 
    items: [
      { name: 'Bridal Necklace Set', price: 349, quantity: 1, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop' },
      { name: 'Earrings', price: 100, quantity: 1, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&fit=crop' }
    ]
  },
  { 
    id: 'ORD-004', 
    customer: 'Sarah Wilson', 
    email: 'sarah@example.com',
    phone: '+92 300 4567890',
    address: '321 Elm St, Rawalpindi',
    total: 799, 
    status: 'Pending', 
    date: '2024-01-12', 
    items: [
      { name: 'Royal Embroidered Abaya', price: 249, quantity: 1, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop' },
      { name: 'Kashmiri Bangals', price: 249, quantity: 2, image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=100&h=100&fit=crop' },
      { name: 'Gold Ring Set', price: 52, quantity: 1, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop' }
    ]
  },
  { 
    id: 'ORD-005', 
    customer: 'Ahmed Khan', 
    email: 'ahmed@example.com',
    phone: '+92 300 5678901',
    address: '654 Maple Dr, Lahore',
    total: 199, 
    status: 'Delivered', 
    date: '2024-01-11', 
    items: [
      { name: 'Luxury Perfume Set', price: 199, quantity: 1, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&h=100&fit=crop' }
    ]
  },
];

const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrdersPage() {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Pending': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Cancelled': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return CheckCircle;
      case 'Shipped': return Truck;
      case 'Processing': return Clock;
      case 'Pending': return AlertCircle;
      case 'Cancelled': return XCircle;
      default: return Package;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      <div className="p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-[#1a1a40] rounded-lg text-gold hover:bg-gold/20 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Orders</h1>
              <p className="text-white/50">Manage all customer orders</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gold text-[#0a0a23] rounded-lg font-semibold hover:bg-yellow-400 transition">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1a1a40] border border-gold/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  statusFilter === status
                    ? 'bg-gold text-[#0a0a23]'
                    : 'bg-[#1a1a40] text-white/70 hover:bg-gold/20 hover:text-gold border border-gold/20'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredOrders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              const isExpanded = expandedOrder === order.id;
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#1a1a40] border border-gold/20 rounded-xl overflow-hidden"
                >
                  <div 
                    className="p-4 lg:p-6 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${getStatusColor(order.status)}`}>
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-gold font-bold text-lg">{order.id}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-white/70 mt-1">{order.customer}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-white font-bold text-xl">${order.total}</p>
                          <p className="text-white/50 text-sm">{order.items.length} items</p>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-white/70">{order.date}</p>
                          <p className="text-white/50 text-sm">{order.customer}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gold" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gold" />
                        )}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gold/20"
                      >
                        <div className="p-4 lg:p-6 bg-[#0a0a23]/50">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div>
                              <h4 className="text-gold font-semibold mb-3 flex items-center gap-2">
                                <Package className="w-5 h-5" /> Order Items
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3 p-2 bg-[#1a1a40] rounded-lg">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                    <div className="flex-1">
                                      <p className="text-white text-sm font-medium">{item.name}</p>
                                      <p className="text-white/50 text-xs">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-gold font-bold">${item.price * item.quantity}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 pt-4 border-t border-gold/20 flex justify-between">
                                <span className="text-white/70">Subtotal</span>
                                <span className="text-white font-bold">${order.total}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">Shipping</span>
                                <span className="text-green-400">Free</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white font-bold">Total</span>
                                <span className="text-gold font-bold text-lg">${order.total}</span>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-gold font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="w-5 h-5" /> Shipping Address
                              </h4>
                              <div className="p-4 bg-[#1a1a40] rounded-lg">
                                <p className="text-white font-medium">{order.customer}</p>
                                <p className="text-white/70 text-sm mt-1">{order.address}</p>
                                <p className="text-white/70 text-sm">Pakistan</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-gold font-semibold mb-3 flex items-center gap-2">
                                <Calendar className="w-5 h-5" /> Order Actions
                              </h4>
                              <div className="space-y-2">
                                <select className="w-full p-3 bg-[#1a1a40] border border-gold/20 rounded-lg text-white">
                                  <option>Change Status</option>
                                  <option>Mark as Pending</option>
                                  <option>Mark as Processing</option>
                                  <option>Mark as Shipped</option>
                                  <option>Mark as Delivered</option>
                                  <option>Cancel Order</option>
                                </select>
                                <button className="w-full py-3 bg-gold text-[#0a0a23] rounded-lg font-semibold hover:bg-yellow-400 transition">
                                  Update Status
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
