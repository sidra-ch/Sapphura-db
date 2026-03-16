"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [userId, setUserId] = useState<number | null>(null);
  const [otp, setOtp] = useState('');
  const [otpChannel] = useState<'email'>('email');
  const [error, setError] = useState('');
  const [otpInfo, setOtpInfo] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          name: formData.name,
          email: normalizedEmail,
          phone: formData.phone,
          password: formData.password,
          otpChannel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setUserId(data.userId);
      setOtpInfo(data.message || 'OTP sent successfully');
      setStep('verify');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resend-signup-otp',
          email: normalizedEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to resend OTP');
        return;
      }

      setUserId(data.userId);
      setOtpInfo(data.message || 'OTP sent successfully');
    } catch {
      setError('Something went wrong while resending OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-otp', userId, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-[#1a1a40] border border-gold rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gold">Step 2: Verify OTP</h1>
              <p className="text-white/60 mt-2">We sent a 6-digit code to {formData.email}</p>
              {otpInfo && <p className="text-green-400 mt-2 text-sm">{otpInfo}</p>}
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:border-gold"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gold text-[#0a0a23] py-3 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Create Account'}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="w-full border border-gold text-gold py-3 rounded-lg font-semibold hover:bg-gold/10 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {resendLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Resend OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('register');
                    setOtp('');
                    setError('');
                  }}
                  className="w-full border border-gold/40 text-white py-3 rounded-lg font-semibold hover:border-gold transition"
                >
                  Edit Details
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a40] border border-gold rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gold">Step 1: Create Account</h1>
            <p className="text-white/60 mt-2">Fill details and click Send OTP to verify your email</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold"
                placeholder="+92 300 1234567"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">OTP Delivery</label>
              <p className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white/80 text-sm">
                Verification OTP will be sent to your email.
              </p>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold pr-12"
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-gold"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-[#0a0a23] py-3 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-white/60">Already have an account? </span>
            <Link href="/store/login" className="text-gold hover:text-yellow-300 font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}