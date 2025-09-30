import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
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

      window.location.href = redirectMap[data.user.role] || '/';
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
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
          <div className="font-playfair font-bold text-3xl text-black mb-2">Welcome Back</div>
          <p className="font-inter text-sm text-[#4D4D4D]">Sign in to your FF4U account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border border-[#E8E8E8] p-6">
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
            <div className="mb-6">
              <label className="block font-inter font-medium text-sm text-black mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-[#DCDCDC] rounded-sm font-inter text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Enter your password"
              />
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
                'Signing In...'
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Accounts */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-inter font-medium text-sm text-blue-800 mb-3">
            Demo Accounts (Development Only)
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-blue-700">Admin:</span>
              <span className="text-blue-600">admin@ff4u.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Performer:</span>
              <span className="text-blue-600">performer1@ff4u.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Client:</span>
              <span className="text-blue-600">client1@ff4u.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Moderator:</span>
              <span className="text-blue-600">moderator@ff4u.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Safety Officer:</span>
              <span className="text-blue-600">safety@ff4u.com</span>
            </div>
            <p className="text-blue-600 italic mt-2">Password: "demo123" for all accounts</p>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="font-inter text-sm text-[#4D4D4D]">
            Don't have an account?{' '}
            <a href="/auth/register" className="text-black underline hover:no-underline">
              Join FF4U
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
