import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState('email'); // "email", "otp", "success"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      // Mock API call for sending OTP
      const response = await fetch('/api/auth/email/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode) return;

    setLoading(true);
    setError('');

    try {
      // Mock API call for verifying OTP
      const response = await fetch('/api/auth/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode }),
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      const data = await response.json();

      // Store tokens and redirect to dashboard
      localStorage.setItem('zs_access_token', data.access);
      localStorage.setItem('zs_refresh_token', data.refresh);

      setStep('success');

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ZeroStack Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl font-sora">Z</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-2xl text-black dark:text-white font-sora">
                ZeroStack
              </div>
              <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                AWS-Ready Platform
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-8 shadow-sm">
          {step === 'email' && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-black dark:text-white font-sora mb-2">
                  Welcome back
                </h1>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  Enter your email to get started
                </p>
              </div>

              <form onSubmit={handleEmailSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-2 font-inter">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] dark:text-[#6B7280]"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-[#D1D5DB] dark:border-[#4B5563] rounded-lg bg-white dark:bg-[#374151] text-black dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#6B7280] focus:border-[#6366F1] dark:focus:border-[#818CF8] focus:ring-1 focus:ring-[#6366F1] dark:focus:ring-[#818CF8] transition-colors font-inter"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-[#FEF2F2] dark:bg-[rgba(239,68,68,0.1)] border border-[#FECACA] dark:border-[rgba(239,68,68,0.3)] rounded-lg">
                    <p className="text-sm text-[#DC2626] dark:text-[#F87171] font-inter">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold rounded-lg transition-all duration-150 hover:from-[#5B5EF0] hover:to-[#7E56F5] active:from-[#524DF0] active:to-[#7049F4] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-black dark:text-white font-sora mb-2">
                  Check your email
                </h1>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  We sent a verification code to <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-2 font-inter">
                    Verification code
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-3 border border-[#D1D5DB] dark:border-[#4B5563] rounded-lg bg-white dark:bg-[#374151] text-black dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#6B7280] focus:border-[#6366F1] dark:focus:border-[#818CF8] focus:ring-1 focus:ring-[#6366F1] dark:focus:ring-[#818CF8] transition-colors font-inter text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-[#FEF2F2] dark:bg-[rgba(239,68,68,0.1)] border border-[#FECACA] dark:border-[rgba(239,68,68,0.3)] rounded-lg">
                    <p className="text-sm text-[#DC2626] dark:text-[#F87171] font-inter">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading || !otpCode}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold rounded-lg transition-all duration-150 hover:from-[#5B5EF0] hover:to-[#7E56F5] active:from-[#524DF0] active:to-[#7049F4] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        Verify & Continue
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="w-full py-3 px-4 text-[#6B7280] dark:text-[#9CA3AF] font-medium rounded-lg transition-colors hover:text-[#374151] dark:hover:text-[#D1D5DB] font-inter"
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#DCFCE7] dark:bg-[rgba(34,197,94,0.15)] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-[#16A34A] dark:text-[#22C55E]" />
              </div>
              <h1 className="text-2xl font-bold text-black dark:text-white font-sora mb-2">
                Welcome to ZeroStack!
              </h1>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter mb-6">
                You're being redirected to your dashboard...
              </p>
              <div className="flex justify-center">
                <Loader2 size={24} className="animate-spin text-[#6366F1]" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">
            Secure authentication powered by ZeroStack
          </p>
        </div>
      </div>
    </div>
  );
}
