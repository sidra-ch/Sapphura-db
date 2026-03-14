"use client";

import { useState } from 'react';
import { useCart } from '../../components/cart/CartContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard, Truck, CheckCircle, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const StripePayment = dynamic(() => import('../../components/payment/StripeCheckout'), { ssr: false });

type Step = 'info' | 'shipping' | 'payment' | 'review';

interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: 'Pakistan',
    postalCode: '',
    shippingMethod: 'standard',
    paymentMethod: 'cod',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 'info', label: 'Information', icon: ShoppingCart },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: CheckCircle },
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateInfoStep = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateShippingStep = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'SARPHURA10') {
      setDiscount(totalPrice * 0.1);
      setAppliedCoupon(coupon);
    } else if (coupon.toUpperCase() === 'EID20') {
      setDiscount(totalPrice * 0.2);
      setAppliedCoupon(coupon);
    }
  };

  const nextStep = () => {
    if (currentStep === 'info' && !validateInfoStep()) {
      return;
    }
    if (currentStep === 'shipping' && !validateShippingStep()) {
      return;
    }
    
    const stepOrder: Step[] = ['info', 'shipping', 'payment', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const stepOrder: Step[] = ['info', 'shipping', 'payment', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const placeOrder = async () => {
    setIsProcessing(true);
    
    try {
      const newOrderId = `SAP${Date.now().toString(36).toUpperCase()}`;
      setOrderId(newOrderId);

      const orderDetails = {
        orderId: newOrderId,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: finalTotal,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        }
      };

      localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
      
      if (formData.paymentMethod === 'stripe') {
        const response = await fetch('/api/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            email: formData.email,
            items: items
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          alert('Payment failed: ' + data.error);
          setIsProcessing(false);
          return;
        }
      }

      setOrderPlaced(true);
      clearCart();
      
      setTimeout(() => {
        router.push('/order-confirmation');
      }, 2000);
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingCost = formData.shippingMethod === 'express' ? 25 : 0;
  const finalTotal = totalPrice + shippingCost - discount;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gold mb-4">Order Placed Successfully!</h1>
          <p className="text-white/70 mb-8">Thank you for your purchase. You will receive a confirmation email shortly.</p>
          <Link 
            href="/"
            className="inline-block bg-gold text-[#0a0a23] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Steps Indicator */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => {
            const stepOrder: Step[] = ['info', 'shipping', 'payment', 'review'];
            const isActive = stepOrder.indexOf(currentStep) >= index;
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${isActive ? 'text-gold' : 'text-white/30'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-gold bg-gold/20' : 'border-white/30'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm mt-2">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${isActive ? 'bg-gold' : 'bg-white/20'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a40] border border-gold rounded-2xl p-6">
              {currentStep === 'info' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-bold text-gold mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email Address"
                        className={`w-full px-4 py-3 bg-[#0a0a23] border rounded-lg text-white focus:outline-none ${errors.email ? 'border-red-500' : 'border-gold/30 focus:border-gold'}`}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="First Name"
                          className={`w-full px-4 py-3 bg-[#0a0a23] border rounded-lg text-white focus:outline-none ${errors.firstName ? 'border-red-500' : 'border-gold/30 focus:border-gold'}`}
                        />
                        {errors.firstName && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Last Name"
                          className={`w-full px-4 py-3 bg-[#0a0a23] border rounded-lg text-white focus:outline-none ${errors.lastName ? 'border-red-500' : 'border-gold/30 focus:border-gold'}`}
                        />
                        {errors.lastName && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className={`w-full px-4 py-3 bg-[#0a0a23] border rounded-lg text-white focus:outline-none ${errors.phone ? 'border-red-500' : 'border-gold/30 focus:border-gold'}`}
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'shipping' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-bold text-gold mb-6">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street Address"
                        className={`w-full px-4 py-3 bg-[#0a0a23] border rounded-lg text-white focus:outline-none ${errors.address ? 'border-red-500' : 'border-gold/30 focus:border-gold'}`}
                      />
                      {errors.address && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> {errors.address}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className={`w-full px-4 py-3 bg-[#0a0a23] border rounded-lg text-white focus:outline-none ${errors.city ? 'border-red-500' : 'border-gold/30 focus:border-gold'}`}
                        />
                        {errors.city && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          placeholder="Postal Code"
                          className={`w-full px-4 py-3 bg-[#0a0a23] border rounded-lg text-white focus:outline-none ${errors.postalCode ? 'border-red-500' : 'border-gold/30 focus:border-gold'}`}
                        />
                        {errors.postalCode && (
                          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold"
                    >
                      <option value="">Select Country</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="UAE">UAE</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="UK">UK</option>
                      <option value="USA">USA</option>
                    </select>
                    
                    <div className="mt-6">
                      <h3 className="text-gold font-semibold mb-3">Delivery Method</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 bg-[#0a0a23] rounded-lg cursor-pointer border border-gold/30">
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="shippingMethod" 
                              value="standard"
                              checked={formData.shippingMethod === 'standard'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-gold"
                            />
                            <span className="text-white">Standard Shipping (7-10 days)</span>
                          </div>
                          <span className="text-gold font-semibold">Free</span>
                        </label>
                        <label className="flex items-center justify-between p-4 bg-[#0a0a23] rounded-lg cursor-pointer border border-gold/30">
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="shippingMethod" 
                              value="express"
                              checked={formData.shippingMethod === 'express'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-gold"
                            />
                            <span className="text-white">Express Shipping (2-3 days)</span>
                          </div>
                          <span className="text-gold font-semibold">$25</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'payment' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-bold text-gold mb-6">Payment Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-[#0a0a23] rounded-lg cursor-pointer border border-gold">
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gold"
                        />
                        <span className="text-white">Cash on Delivery</span>
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-4 bg-[#0a0a23] rounded-lg cursor-pointer border border-gold/30">
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gold"
                        />
                        <span className="text-white">Credit/Debit Card</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white/50 text-xs">Visa</span>
                        <span className="text-white/50 text-xs">Mastercard</span>
                      </div>
                    </label>
                  </div>
                  {formData.paymentMethod === 'card' && (
                    <div className="mt-6 p-4 bg-[#0a0a23] rounded-lg border border-gold/30">
                      <StripePayment 
                        amount={totalPrice} 
                        onSuccess={() => {
                          placeOrder();
                        }} 
                        onCancel={() => setFormData({...formData, paymentMethod: 'cod'})} 
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {currentStep === 'review' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-bold text-gold mb-6">Order Review</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0a0a23] rounded-lg">
                      <h3 className="text-gold font-semibold mb-2">Contact</h3>
                      <p className="text-white/70">{formData.email}</p>
                      <p className="text-white/70">{formData.phone}</p>
                    </div>
                    <div className="p-4 bg-[#0a0a23] rounded-lg">
                      <h3 className="text-gold font-semibold mb-2">Shipping</h3>
                      <p className="text-white/70">{formData.firstName} {formData.lastName}</p>
                      <p className="text-white/70">{formData.address}</p>
                      <p className="text-white/70">{formData.city}, {formData.postalCode}</p>
                    </div>
                    <div className="p-4 bg-[#0a0a23] rounded-lg">
                      <h3 className="text-gold font-semibold mb-2">Payment</h3>
                      <p className="text-white/70">{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep !== 'info' ? (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 text-gold hover:text-yellow-300 transition"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back
                  </button>
                ) : (
                  <Link href="/cart" className="flex items-center gap-2 px-6 py-3 text-gold hover:text-yellow-300 transition">
                    <ChevronLeft className="w-5 h-5" /> Back to Cart
                  </Link>
                )}
                {currentStep !== 'review' ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-gold text-[#0a0a23] rounded-lg font-bold hover:bg-yellow-400 transition"
                  >
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={placeOrder}
                    disabled={isProcessing}
                    className="px-8 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-400 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a40] border border-gold rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-gold" />
                    <div className="flex-1">
                      <p className="text-white text-sm">{item.name}</p>
                      <p className="text-white/50 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-gold font-semibold">${item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gold/30 pt-4 space-y-2">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gold pt-2 border-t border-gold/30">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 px-4 py-2 bg-[#0a0a23] border border-gold/30 rounded-lg text-white text-sm"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-gold/20 text-gold rounded-lg text-sm hover:bg-gold hover:text-[#0a0a23] transition"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-white/50 text-xs mt-2">Try: SARPHURA10 or EID20</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}