"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Download,
  Package, Truck, CheckCircle, Clock, AlertCircle, XCircle,
  MapPin, Calendar, ChevronDown, ChevronUp
} from 'lucide-react';
import { FALLBACK_PRODUCT_IMAGE, parseMediaList } from '../../../lib/media';

type UiOrderItem = {
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type UiOrder = {
  id: number;
  customer: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  date: string;
  items: UiOrderItem[];
};

const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Paid'];
const nextStatusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'paid'];

function toLabel(status: string): string {
  const normalized = String(status || '').trim().toLowerCase();
  if (!normalized) return 'Pending';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [orders, setOrders] = useState<UiOrder[]>([]);
  const [pendingStatusById, setPendingStatusById] = useState<Record<number, string>>({});
  const [loadingById, setLoadingById] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [flashMessage, setFlashMessage] = useState('');

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/orders', {
        cache: 'no-store',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load orders');
      }

      const rows: UiOrder[] = Array.isArray(data.orders)
        ? data.orders.map((o: any) => ({
            id: o.id,
            customer: o.shippingName || o.user?.name || 'Customer',
            phone: o.shippingPhone || o.user?.phone || 'N/A',
            address: o.shippingAddress || 'Address not available',
            total: Number(o.total) || 0,
            status: toLabel(o.status),
            date: new Date(o.createdAt).toISOString().slice(0, 10),
            items: Array.isArray(o.items)
              ? o.items.map((item: any) => {
                  const media = parseMediaList(item?.product?.images || '[]');
                  return {
                    name: item?.product?.name || 'Product',
                    price: Number(item?.price) || 0,
                    quantity: Number(item?.quantity) || 0,
                    image: media[0] || FALLBACK_PRODUCT_IMAGE,
                  };
                })
              : [],
          }))
        : [];

      setOrders(rows);
      setPendingStatusById(
        rows.reduce((acc, row) => {
          acc[row.id] = row.status.toLowerCase();
          return acc;
        }, {} as Record<number, string>)
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const updateOrderStatus = async (orderId: number) => {
    const nextStatus = pendingStatusById[orderId];
    if (!nextStatus) {
      return;
    }

    setLoadingById((prev) => ({ ...prev, [orderId]: true }));
    setErrorMessage('');
    setFlashMessage('');

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update order status');
      }

      setFlashMessage(`Order #${orderId} updated to ${toLabel(nextStatus)}.`);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: toLabel(nextStatus) } : order)));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update order status');
    } finally {
      setLoadingById((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const exportCsv = () => {
    const header = 'Order ID,Customer,Status,Total,Date';
    const lines = orders.map((order) => `"ORD-${String(order.id).padStart(3, '0')}","${order.customer}","${order.status}","${order.total}","${order.date}"`);
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Paid': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
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
      case 'Paid': return CheckCircle;
      case 'Shipped': return Truck;
      case 'Processing': return Clock;
      case 'Pending': return AlertCircle;
      case 'Cancelled': return XCircle;
      default: return Package;
    }
  };

  const filteredOrders = orders.filter(order => {
    const orderRef = `ord-${String(order.id).padStart(3, '0')}`;
    const matchesSearch = orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 lg:mb-8">
          <div className="flex items-start sm:items-center gap-4">
            <Link href="/admin" className="p-2 bg-[#1a1a40] rounded-lg text-gold hover:bg-gold/20 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Orders</h1>
              <p className="text-white/50">Manage all customer orders</p>
            </div>
          </div>
          <button
            onClick={exportCsv}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gold text-[#0a0a23] rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        {errorMessage ? <p className="mb-4 text-sm text-red-400">{errorMessage}</p> : null}
        {flashMessage ? <p className="mb-4 text-sm text-green-400">{flashMessage}</p> : null}

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

        {isLoading ? (
          <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-6 text-white/70">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-6 text-white/70">No orders found.</div>
        ) : (
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
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-gold font-bold text-lg">ORD-{String(order.id).padStart(3, '0')}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-white/70 mt-1">{order.customer}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="text-right">
                          <p className="text-white font-bold text-lg sm:text-xl">${order.total}</p>
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
                                  <div key={idx} className="flex items-center gap-3 p-2 bg-[#1a1a40] rounded-lg min-w-0">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
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
                                <select
                                  value={pendingStatusById[order.id] || order.status.toLowerCase()}
                                  onChange={(e) => setPendingStatusById((prev) => ({ ...prev, [order.id]: e.target.value }))}
                                  className="w-full p-3 bg-[#1a1a40] border border-gold/20 rounded-lg text-white"
                                >
                                  {nextStatusOptions.map((status) => (
                                    <option key={status} value={status}>
                                      Mark as {toLabel(status)}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => void updateOrderStatus(order.id)}
                                  disabled={Boolean(loadingById[order.id])}
                                  className="w-full py-3 bg-gold text-[#0a0a23] rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-60"
                                >
                                  {loadingById[order.id] ? 'Updating...' : 'Update Status'}
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
        )}
      </div>
    </div>
  );
}
