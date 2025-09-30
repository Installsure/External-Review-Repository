import React, { useState } from 'react';
import { UserPlus, Shield, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: new URLSearchParams(window.location.search).get('role') || 'client',
    ageConfirmed: false,
    termsAccepted: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.ageConfirmed) {
      setError('You must confirm you are 18+ to continue');
      return;
    }

    if (!formData.termsAccepted) {
      setError('You must accept the terms to continue');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`);
      }

      const data = await response.json();
      localStorage.setItem('ff4u_token', data.token);

      // Redirect based on role
      const redirectMap = {
        performer: '/studio',
        client: '/book',
        moderator: '/moderation',
        safety_officer: '/safety',
        admin: '/admin',
      };

      window.location.href = redirectMap[formData.role] || '/';
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-inter flex items-center justify-center">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Compliance Banner */}
      <div className="absolute top-0 w-full bg-amber-50 border-b border-amber-200 px-4 py-2">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-inter text-sm text-amber-800">
            Demo Authentication • Connect real auth system in production
          </span>
        </div>
      </div>

      <div className="w-full max-w-md px-4 pt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-playfair font-bold text-3xl text-black mb-2">Join FF4U</div>
          <p className="font-inter text-sm text-[#4D4D4D]">Create your account to get started</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block font-inter font-medium text-sm text-black mb-3">
                I want to join as a:
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="performer"
                    checked={formData.role === 'performer'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                    className="mr-3"
                  />
                  <span className="font-inter text-sm">Creator/Performer</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={formData.role === 'client'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                    className="mr-3"
                  />
                  <span className="font-inter text-sm">Client</span>
                </label>
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block font-inter font-medium text-sm text-black mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block font-inter font-medium text-sm text-black mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Create a strong password"
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block font-inter font-medium text-sm text-black mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Confirm your password"
              />
            </div>

            {/* Age Gate */}
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-sm">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.ageConfirmed}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          ageConfirmed: e.target.checked,
                        }))
                      }
                      className="mr-3 mt-1"
                    />
                    <span className="font-inter text-sm text-red-800">
                      I confirm that I am 18 years of age or older and legally permitted to view
                      adult content in my jurisdiction.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="mb-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.termsAccepted}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      termsAccepted: e.target.checked,
                    }))
                  }
                  className="mr-3 mt-1"
                />
                <span className="font-inter text-sm text-[#4D4D4D]">
                  I accept the{' '}
                  <a href="/legal" className="text-black underline hover:no-underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/legal" className="text-black underline hover:no-underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm flex items-center">
                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                <span className="font-inter text-sm text-red-800">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-inter font-semibold text-sm py-3 rounded-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="font-inter text-sm text-[#4D4D4D]">
            Already have an account?{' '}
            <a href="/auth/login" className="text-black underline hover:no-underline">
              Sign In
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <a
            href="/"
            className="font-inter text-xs text-[#4D4D4D] hover:text-black transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>

      <style jsx global>{`
        .font-inter {
          font-family:
            'Inter',
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            'Roboto',
            sans-serif;
        }
        .font-playfair {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>
    </div>
  );
}
