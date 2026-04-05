"use client";

import { useEffect, useState } from 'react';
import { useCart } from '../../components/cart/CartContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard, Truck, CheckCircle, ChevronLeft, ChevronRight, AlertCircle, Smartphone, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { formatCurrency } from '../../lib/currency';
import { calculateOrderTotal, calculateShippingCost, resolveCheckoutOffer } from '../../lib/checkout-offers';

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
  payment?: string;
}

interface OtpChannelAvailability {
  email: boolean;
}

interface PaymentProviderAvailability {
  jazzcash: boolean;
  easypaisa: boolean;
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
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpVerificationToken, setOtpVerificationToken] = useState('');
  const [otpVerifiedAt, setOtpVerifiedAt] = useState('');
  const [otpExpiry, setOtpExpiry] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpChannel] = useState<'email'>('email');
  const [availableOtpChannels, setAvailableOtpChannels] = useState<OtpChannelAvailability>({
    email: true,
  });
  const [availablePaymentProviders, setAvailablePaymentProviders] = useState<PaymentProviderAvailability>({
    jazzcash: false,
    easypaisa: false,
  });
  const [cardAuthorized, setCardAuthorized] = useState(false);
  const [cardPaymentIntentId, setCardPaymentIntentId] = useState('');
  const [cardAuthorizedAt, setCardAuthorizedAt] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNetwork: 'visa',
    walletNumber: '',
    accountTitle: '',
    transactionReference: '',
  });

  const persistLastOrder = (persistedOrder: any, state: 'confirmed' | 'pending_payment') => {
    const persistedOrderId = persistedOrder.legacyId || persistedOrder.id;
    const publicOrderId = `SAP${String(persistedOrderId).padStart(6, '0')}`;

    const orderDetails = {
      orderId: publicOrderId,
      orderLookupId: persistedOrder.id,
      legacyOrderId: persistedOrderId,
      items: persistedOrder.items,
      total: persistedOrder.total,
      state,
      paymentMethod: formData.paymentMethod,
      paymentStatus: persistedOrder.paymentStatus,
      shippingAddress: {
        name: persistedOrder.shippingName || `${formData.firstName} ${formData.lastName}`,
        phone: persistedOrder.shippingPhone || formData.phone,
        address: persistedOrder.shippingAddress || formData.address,
        city: formData.city,
      },
    };

    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    return publicOrderId;
  };

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

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  useEffect(() => {
    let isMounted = true;

    async function loadOtpChannelAvailability() {
      try {
        const response = await fetch('/api/otp/channels', { cache: 'no-store' });
        if (!response.ok) return;

        const data = await response.json();
        const channels = data?.channels as OtpChannelAvailability | undefined;
        if (!isMounted || !channels) return;

        setAvailableOtpChannels({ email: Boolean(channels.email) });
      } catch {
        // keep defaults on network failure
      }
    }

    loadOtpChannelAvailability();
    return () => {
      isMounted = false;
    };
  }, [otpChannel]);

  useEffect(() => {
    let isMounted = true;

    async function loadPaymentProviderAvailability() {
      try {
        const response = await fetch('/api/payments/providers', { cache: 'no-store' });
        if (!response.ok) return;

        const data = await response.json();
        const providers = data?.providers;
        if (!isMounted || !providers) return;

        const nextAvailability = {
          jazzcash: Boolean(providers.jazzcash?.available),
          easypaisa: Boolean(providers.easypaisa?.available),
        };

        setAvailablePaymentProviders(nextAvailability);

        if (
          (formData.paymentMethod === 'jazzcash' && !nextAvailability.jazzcash) ||
          (formData.paymentMethod === 'easypaisa' && !nextAvailability.easypaisa)
        ) {
          setFormData((prev) => ({ ...prev, paymentMethod: 'cod' }));
        }
      } catch {
        // keep wallet providers disabled if availability cannot be loaded
      }
    }

    void loadPaymentProviderAvailability();

    return () => {
      isMounted = false;
    };
  }, [formData.paymentMethod]);

  const validateInfoStep = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
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

  const validatePaymentStep = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.paymentMethod === 'card') {
      if (!cardAuthorized || !cardPaymentIntentId) {
        newErrors.payment = 'Please complete secure card authorization before continuing';
      }
    }

    if (formData.paymentMethod === 'jazzcash' || formData.paymentMethod === 'easypaisa') {
      if (!paymentDetails.walletNumber.trim()) {
        newErrors.payment = 'Wallet number is required for mobile wallet payments';
      } else if (!/^03\d{9}$/.test(paymentDetails.walletNumber.trim())) {
        newErrors.payment = 'Enter a valid wallet number (03XXXXXXXXX)';
      } else if (!paymentDetails.accountTitle.trim()) {
        newErrors.payment = 'Account title is required for wallet payments';
      }
    }

    if (!isOtpVerified || !otpVerificationToken) {
      newErrors.payment = newErrors.payment
        ? `${newErrors.payment}. OTP verification is also required.`
        : 'Please verify OTP before continuing';
    }

    setErrors((prev) => ({ ...prev, payment: newErrors.payment }));
    return !newErrors.payment;
  };

  const sendPaymentOtp = async () => {
    if (otpChannel === 'email' && (!formData.email || !validateEmail(formData.email))) {
      setOtpError('Please enter a valid email for email OTP');
      return;
    }

    if (!availableOtpChannels[otpChannel]) {
      setOtpError(`Selected OTP channel (${otpChannel}) is not configured yet. Please select another channel.`);
      return;
    }

    if (otpCooldown > 0) {
      setOtpError(`Please wait ${otpCooldown}s before requesting another OTP.`);
      return;
    }

    setIsOtpSending(true);
    setOtpError('');
    setOtpMessage('');

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();
      const response = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          email: normalizedEmail || undefined,
          phone: formData.phone,
          otpChannel,
          purpose: `payment-${formData.paymentMethod}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setOtpError(data.error || 'Failed to send OTP');
        return;
      }

      setOtpExpiry(data.expiry || '');
      setOtpMessage(`OTP sent successfully via ${(data.channels || [otpChannel]).join(', ')}.`);
      setIsOtpVerified(false);
      setOtpVerificationToken('');
      setOtpVerifiedAt('');
      setOtpCode('');
      setOtpCooldown(60);
    } catch {
      setOtpError('Failed to send OTP. Please try again.');
    } finally {
      setIsOtpSending(false);
    }
  };

  const verifyPaymentOtp = async () => {
    if (!otpCode.trim()) {
      setOtpError('Please enter OTP code');
      return;
    }

    setIsOtpVerifying(true);
    setOtpError('');
    setOtpMessage('');

    try {
      const response = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          email: formData.email.trim().toLowerCase() || undefined,
          phone: formData.phone,
          otpChannel,
          otp: otpCode.trim(),
          purpose: `payment-${formData.paymentMethod}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setOtpError(data.error || 'OTP verification failed');
        setIsOtpVerified(false);
        return;
      }

      setIsOtpVerified(true);
      setOtpVerificationToken(data.verificationToken || '');
      setOtpVerifiedAt(new Date().toISOString());
      setOtpMessage('OTP verified successfully. You can continue now.');
      setErrors((prev) => ({ ...prev, payment: undefined }));
    } catch {
      setOtpError('OTP verification failed. Please try again.');
      setIsOtpVerified(false);
    } finally {
      setIsOtpVerifying(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'paymentMethod' || name === 'email' || name === 'phone') {
      setCardAuthorized(false);
      setCardPaymentIntentId('');
      setCardAuthorizedAt('');
      setIsOtpVerified(false);
      setOtpVerificationToken('');
      setOtpVerifiedAt('');
      setOtpCode('');
      setOtpExpiry('');
      setOtpCooldown(0);
      setOtpError('');
      setOtpMessage('');
      setErrors((prev) => ({ ...prev, payment: undefined }));
    }
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const applyCoupon = () => {
    const offer = resolveCheckoutOffer(coupon, totalPrice);
    setCouponError(offer.error);
    setDiscount(offer.discount);
    setAppliedCoupon(offer.couponCode);
  };

  const nextStep = () => {
    if (currentStep === 'info' && !validateInfoStep()) {
      return;
    }
    if (currentStep === 'shipping' && !validateShippingStep()) {
      return;
    }
    if (currentStep === 'payment' && !validatePaymentStep()) {
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
      if (items.length === 0) {
        alert('Your cart is empty.');
        return;
      }

      if (formData.paymentMethod === 'jazzcash' && !availablePaymentProviders.jazzcash) {
        alert('JazzCash is not configured right now. Please use Cash on Delivery or card.');
        return;
      }

      if (formData.paymentMethod === 'easypaisa' && !availablePaymentProviders.easypaisa) {
        alert('Easypaisa is not configured right now. Please use Cash on Delivery or card.');
        return;
      }

      if (!validatePaymentStep()) {
        alert('Please complete payment verification before placing order.');
        return;
      }

      const response = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          shippingMethod: formData.shippingMethod,
          paymentMethod: formData.paymentMethod,
          items,
          subtotal: totalPrice,
          shippingCost,
          couponCode: appliedCoupon,
          discount,
          total: finalTotal,
          paymentVerification: {
            otpVerificationToken,
            otpVerifiedAt,
            stripePaymentIntentId: formData.paymentMethod === 'card' ? cardPaymentIntentId : undefined,
            cardAuthorizedAt: formData.paymentMethod === 'card' ? cardAuthorizedAt : undefined,
            walletNumberMasked:
              formData.paymentMethod === 'jazzcash' || formData.paymentMethod === 'easypaisa'
                ? paymentDetails.walletNumber.replace(/\d(?=\d{4})/g, '*')
                : undefined,
            walletAccountTitle:
              formData.paymentMethod === 'jazzcash' || formData.paymentMethod === 'easypaisa'
                ? paymentDetails.accountTitle
                : undefined,
            walletTransactionReference:
              formData.paymentMethod === 'jazzcash' || formData.paymentMethod === 'easypaisa'
                ? paymentDetails.transactionReference || undefined
                : undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to place order. Please try again.');
        return;
      }

      const persistedOrder = data.order;
      const persistedOrderId = persistedOrder.legacyId || persistedOrder.id;

      if (formData.paymentMethod === 'jazzcash' || formData.paymentMethod === 'easypaisa') {
        const publicOrderId = persistLastOrder(persistedOrder, 'pending_payment');
        setOrderId(publicOrderId);

        const initResponse = await fetch('/api/payments/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: formData.paymentMethod,
            orderId: persistedOrderId,
            amount: persistedOrder.total,
            email: formData.email,
            phone: formData.phone,
          }),
        });

        const initData = await initResponse.json();

        if (!initResponse.ok || !initData?.success) {
          alert(initData?.error || 'Failed to initiate wallet payment. Please try again.');
          return;
        }

        if (initData?.transaction?.paymentUrl) {
          window.location.href = initData.transaction.paymentUrl;
          return;
        }

        setOrderPlaced(true);
        return;
      }

      const publicOrderId = persistLastOrder(persistedOrder, 'confirmed');
      setOrderId(publicOrderId);

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

  const shippingCost = calculateShippingCost(formData.shippingMethod);
  const finalTotal = calculateOrderTotal(totalPrice, shippingCost, discount);

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
                    <div className="grid gap-4 sm:grid-cols-2">
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
                    <div className="grid gap-4 sm:grid-cols-2">
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
                          <span className="text-gold font-semibold">{formatCurrency(25, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'payment' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-bold text-gold mb-6">Payment Method</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <label className={`flex items-center justify-between p-4 bg-[#0a0a23] rounded-lg cursor-pointer border transition ${formData.paymentMethod === 'cod' ? 'border-gold' : 'border-gold/30 hover:border-gold/70'}`}>
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

                    <label className={`flex items-center justify-between p-4 bg-[#0a0a23] rounded-lg cursor-pointer border transition ${formData.paymentMethod === 'card' ? 'border-gold' : 'border-gold/30 hover:border-gold/70'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gold"
                        />
                        <span className="text-white">Visa / Mastercard</span>
                      </div>
                      <div className="flex gap-2 text-white/50 text-xs">
                        <span>Visa</span>
                        <span>Master</span>
                      </div>
                    </label>

                    <label className={`flex items-center justify-between rounded-lg border p-4 transition ${availablePaymentProviders.jazzcash ? `bg-[#0a0a23] cursor-pointer ${formData.paymentMethod === 'jazzcash' ? 'border-gold' : 'border-gold/30 hover:border-gold/70'}` : 'cursor-not-allowed border-gold/10 bg-[#0a0a23]/50 opacity-50'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="jazzcash"
                          checked={formData.paymentMethod === 'jazzcash'}
                          onChange={handleInputChange}
                          disabled={!availablePaymentProviders.jazzcash}
                          className="w-4 h-4 text-gold"
                        />
                        <span className="text-white">JazzCash{!availablePaymentProviders.jazzcash ? ' (Unavailable)' : ''}</span>
                      </div>
                      <Smartphone className="w-4 h-4 text-gold" />
                    </label>

                    <label className={`flex items-center justify-between rounded-lg border p-4 transition ${availablePaymentProviders.easypaisa ? `bg-[#0a0a23] cursor-pointer ${formData.paymentMethod === 'easypaisa' ? 'border-gold' : 'border-gold/30 hover:border-gold/70'}` : 'cursor-not-allowed border-gold/10 bg-[#0a0a23]/50 opacity-50'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="easypaisa"
                          checked={formData.paymentMethod === 'easypaisa'}
                          onChange={handleInputChange}
                          disabled={!availablePaymentProviders.easypaisa}
                          className="w-4 h-4 text-gold"
                        />
                        <span className="text-white">Easypaisa{!availablePaymentProviders.easypaisa ? ' (Unavailable)' : ''}</span>
                      </div>
                      <Smartphone className="w-4 h-4 text-gold" />
                    </label>
                  </div>

                  {(!availablePaymentProviders.jazzcash || !availablePaymentProviders.easypaisa) && (
                    <p className="mb-4 text-sm text-amber-300">
                      Some wallet payment methods are temporarily unavailable because server payment configuration is incomplete.
                    </p>
                  )}

                  {formData.paymentMethod === 'card' && (
                    <div className="mt-4 p-4 bg-[#0a0a23] rounded-lg border border-gold/30 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center gap-2 text-white/80 text-sm">
                          <input
                            type="radio"
                            name="cardNetwork"
                            checked={paymentDetails.cardNetwork === 'visa'}
                            onChange={() => setPaymentDetails((prev) => ({ ...prev, cardNetwork: 'visa' }))}
                            className="w-4 h-4"
                          />
                          Visa
                        </label>
                        <label className="flex items-center gap-2 text-white/80 text-sm">
                          <input
                            type="radio"
                            name="cardNetwork"
                            checked={paymentDetails.cardNetwork === 'mastercard'}
                            onChange={() => setPaymentDetails((prev) => ({ ...prev, cardNetwork: 'mastercard' }))}
                            className="w-4 h-4"
                          />
                          Mastercard
                        </label>
                      </div>

                      <StripePayment
                        amount={finalTotal}
                        billingDetails={{
                          email: formData.email,
                          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
                          phone: formData.phone,
                          city: formData.city,
                          country: formData.country,
                          postalCode: formData.postalCode,
                          addressLine1: formData.address,
                        }}
                        onSuccess={(result) => {
                          setCardAuthorized(true);
                          setCardPaymentIntentId(result.paymentIntentId);
                          setCardAuthorizedAt(new Date().toISOString());
                          setErrors((prev) => ({ ...prev, payment: undefined }));
                        }}
                        onCancel={() => {
                          setCardAuthorized(false);
                          setCardPaymentIntentId('');
                          setCardAuthorizedAt('');
                          setFormData({ ...formData, paymentMethod: 'cod' });
                        }}
                      />

                      {cardAuthorized && (
                        <p className="text-green-400 text-sm flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" /> Card authorization completed.
                        </p>
                      )}

                      {cardAuthorized && cardPaymentIntentId && (
                        <p className="text-white/60 text-xs">Authorization Reference: {cardPaymentIntentId}</p>
                      )}
                    </div>
                  )}

                  {(formData.paymentMethod === 'jazzcash' || formData.paymentMethod === 'easypaisa') && (
                    <div className="mt-4 p-4 bg-[#0a0a23] rounded-lg border border-gold/30 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="tel"
                        value={paymentDetails.walletNumber}
                        onChange={(e) => setPaymentDetails((prev) => ({ ...prev, walletNumber: e.target.value }))}
                        placeholder="Wallet Number (03XXXXXXXXX)"
                        className="w-full px-4 py-3 bg-[#10153a] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold"
                      />
                      <input
                        type="text"
                        value={paymentDetails.accountTitle}
                        onChange={(e) => setPaymentDetails((prev) => ({ ...prev, accountTitle: e.target.value }))}
                        placeholder="Account Title"
                        className="w-full px-4 py-3 bg-[#10153a] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold"
                      />
                      <input
                        type="text"
                        value={paymentDetails.transactionReference}
                        onChange={(e) => setPaymentDetails((prev) => ({ ...prev, transactionReference: e.target.value }))}
                        placeholder="Transaction Reference (optional)"
                        className="w-full px-4 py-3 bg-[#10153a] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold md:col-span-2"
                      />
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-[#0a0a23] rounded-lg border border-gold/40">
                    <h3 className="text-gold font-semibold mb-3">Payment OTP Verification</h3>
                    <p className="text-white/70 text-sm mb-3">
                      OTP verification is delivered via email.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                      <button
                        type="button"
                        disabled={!availableOtpChannels.email}
                        className={`px-3 py-2 rounded-lg text-sm border transition ${availableOtpChannels.email ? 'bg-gold text-[#0a0a23] border-gold' : 'text-white/80 border-gold/30 opacity-40 cursor-not-allowed'}`}
                      >
                        Email OTP{!availableOtpChannels.email ? ' (Not Configured)' : ''}
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                      <button
                        type="button"
                        onClick={sendPaymentOtp}
                        disabled={isOtpSending || otpCooldown > 0}
                        className="px-4 py-2 rounded-lg border border-gold text-gold hover:bg-gold hover:text-[#0a0a23] transition disabled:opacity-50"
                      >
                        {isOtpSending ? 'Sending OTP...' : otpCooldown > 0 ? `Resend in ${otpCooldown}s` : 'Send OTP'}
                      </button>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter OTP"
                        className="flex-1 px-4 py-2 bg-[#10153a] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={verifyPaymentOtp}
                        disabled={isOtpVerifying || otpCode.trim().length !== 6}
                        className="px-4 py-2 rounded-lg bg-gold text-[#0a0a23] font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
                      >
                        {isOtpVerifying ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </div>

                    {otpMessage && <p className="text-green-400 text-sm mt-2">{otpMessage}</p>}
                    {otpError && <p className="text-red-400 text-sm mt-2">{otpError}</p>}
                    {otpExpiry && <p className="text-white/50 text-xs mt-1">Expires at: {new Date(otpExpiry).toLocaleTimeString()}</p>}
                    {otpCooldown > 0 && <p className="text-white/50 text-xs mt-1">You can request a new OTP in {otpCooldown}s.</p>}

                    {isOtpVerified && (
                      <p className="text-green-400 text-sm mt-2 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> OTP verified for this payment method.
                      </p>
                    )}

                    <div className="mt-4 rounded-lg border border-gold/30 bg-[#10153a] p-3">
                      <h4 className="text-gold text-sm font-semibold mb-2">Advanced Security Checks</h4>
                      <ul className="space-y-1.5 text-xs text-white/70">
                        <li>Contact and address verification: {formData.email && formData.address ? 'Ready' : 'Pending'}</li>
                        <li>Payment OTP proof token: {otpVerificationToken ? 'Verified' : 'Pending'}</li>
                        <li>Card authorization reference: {cardPaymentIntentId ? 'Captured' : formData.paymentMethod === 'card' ? 'Pending' : 'Not required'}</li>
                      </ul>
                    </div>
                  </div>

                  {errors.payment && (
                    <p className="text-red-400 text-sm mt-3 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.payment}
                    </p>
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
                      <p className="text-white/70 capitalize">
                        {formData.paymentMethod === 'card'
                          ? `${paymentDetails.cardNetwork === 'mastercard' ? 'Mastercard' : 'Visa'} (Stripe)`
                          : formData.paymentMethod === 'cod'
                          ? 'Cash on Delivery'
                          : formData.paymentMethod}
                      </p>
                      <p className="text-white/50 text-sm mt-1">OTP Verified: {isOtpVerified ? 'Yes' : 'No'}</p>
                      {formData.paymentMethod === 'card' && cardPaymentIntentId && (
                        <p className="text-white/50 text-sm mt-1">Authorization ID: {cardPaymentIntentId}</p>
                      )}
                    </div>

                    <div className="p-4 bg-[#0a0a23] rounded-lg border border-gold/30">
                      <h3 className="text-gold font-semibold mb-2">Verification Pattern</h3>
                      <p className="text-white/70 text-sm">This checkout follows layered verification: customer identity check, payment authorization, OTP proof, and server-side final payment validation before order confirmation.</p>
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
                    <p className="text-gold font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gold/30 pt-4 space-y-2">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gold pt-2 border-t border-gold/30">
                  <span>Total</span>
                  <span>{formatCurrency(finalTotal)}</span>
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
                {couponError ? <p className="text-red-400 text-xs mt-2">{couponError}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}