import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gold bg-[#1a1a40] p-8 text-white">
        <h1 className="mb-4 text-3xl font-bold text-gold">Forgot Password</h1>
        <p className="mb-6 text-white/80">Password reset flow is being updated. Please contact support for immediate help.</p>
        <div className="flex gap-3">
          <Link href="/contact" className="flex-1 rounded-lg bg-gold px-4 py-3 text-center font-semibold text-[#0a0a23] hover:bg-yellow-300 transition">
            Contact Support
          </Link>
          <Link href="/store/login" className="flex-1 rounded-lg border border-gold/50 px-4 py-3 text-center text-gold hover:bg-gold/10 transition">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
