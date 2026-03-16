"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthContext';

type LoginMode = 'password' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMode, setLoginMode] = useState<LoginMode>('password');
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [otp, setOtp] = useState('');
  const [otpInfo, setOtpInfo] = useState('');
  const [otpUserId, setOtpUserId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: normalizedEmail, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      authLogin(data.token, data.user);
      
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const sendLoginOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Please enter your email first');
      return;
    }

    setLoading(true);
    setError('');
    setOtpInfo('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login-otp', email: normalizedEmail, otpChannel: 'email' }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send login OTP');
        return;
      }

      setOtpStep('verify');
      setOtpInfo(data.message || 'OTP sent to your email');
      setOtpUserId(data.userId || null);
    } catch {
      setError('Something went wrong while sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpUserId || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-login-otp', userId: otpUserId, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'OTP verification failed');
        return;
      }

      authLogin(data.token, data.user);
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a40] border border-gold rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gold">Welcome Back</h1>
            <p className="text-white/60 mt-2">Sign in to your Sapphura account</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-6 bg-[#0a0a23] p-1 rounded-lg border border-gold/20">
            <button
              type="button"
              onClick={() => {
                setLoginMode('password');
                setError('');
                setOtpStep('request');
                setOtp('');
                setOtpInfo('');
              }}
              className={`py-2 rounded-md text-sm font-semibold transition ${
                loginMode === 'password' ? 'bg-gold text-[#0a0a23]' : 'text-white/70 hover:text-white'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('otp');
                setError('');
                setOtpStep('request');
                setOtp('');
                setOtpInfo('');
              }}
              className={`py-2 rounded-md text-sm font-semibold transition ${
                loginMode === 'otp' ? 'bg-gold text-[#0a0a23]' : 'text-white/70 hover:text-white'
              }`}
            >
              Email OTP Login
            </button>
          </div>

          {loginMode === 'password' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold pr-12"
                    placeholder="Enter your password"
                    required
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gold/30 bg-[#0a0a23]" />
                  <span className="text-white/60 text-sm">Remember me</span>
                </label>
                <Link href="/store/forgot-password" className="text-gold text-sm hover:text-yellow-300">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-[#0a0a23] py-3 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyLoginOtp} className="space-y-6">
              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold"
                  placeholder="your@email.com"
                  required
                  disabled={otpStep === 'verify'}
                />
              </div>

              {otpStep === 'verify' && (
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
              )}

              {otpInfo && <p className="text-green-400 text-sm text-center">{otpInfo}</p>}

              {otpStep === 'request' ? (
                <button
                  type="button"
                  onClick={sendLoginOtp}
                  disabled={loading}
                  className="w-full bg-gold text-[#0a0a23] py-3 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Login OTP'}
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gold text-[#0a0a23] py-3 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify OTP & Sign In'}
                  </button>

                  <button
                    type="button"
                    onClick={sendLoginOtp}
                    disabled={loading}
                    className="w-full border border-gold text-gold py-3 rounded-lg font-semibold hover:bg-gold/10 transition disabled:opacity-50"
                  >
                    Resend OTP
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep('request');
                      setOtp('');
                      setOtpInfo('');
                      setError('');
                      setOtpUserId(null);
                    }}
                    className="w-full border border-gold/40 text-white py-3 rounded-lg font-semibold hover:border-gold transition"
                  >
                    Change Email
                  </button>
                </>
              )}
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-gold hover:text-yellow-300 font-medium">
              ← Back to Sapphura Homepage
            </Link>
          </div>
          
          <div className="mt-4 text-center">
            <span className="text-white/60">Don&apos;t have an account? </span>
            <Link href="/store/register" className="text-gold hover:text-yellow-300 font-medium">
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}