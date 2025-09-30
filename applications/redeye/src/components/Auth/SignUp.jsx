import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export default function SignUp({ onSignUp, onSwitchToSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // Call the parent callback
      if (onSignUp) {
        onSignUp(data);
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const onSubmit = (data) => {
    setError('');
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F3F3] dark:bg-[#0A0A0A] px-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E4E4E7] dark:border-[#333333] p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black dark:bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-white dark:text-black" />
          </div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white font-sora mb-2">
            Create Your Account
          </h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
            Get started with RedEye today
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm font-inter">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-2 font-inter">
              Full Name
            </label>
            <input
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              className="w-full px-4 py-3 border border-[#D1D5DB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors font-inter"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-inter">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-2 font-inter">
              Email
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-4 py-3 border border-[#D1D5DB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors font-inter"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-inter">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-2 font-inter">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                className="w-full px-4 py-3 pr-12 border border-[#D1D5DB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors font-inter"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-[#6B7280] dark:text-[#9CA3AF]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#6B7280] dark:text-[#9CA3AF]" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-inter">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || signupMutation.isLoading}
            className="w-full py-3 px-4 bg-gradient-to-b from-[#252525] to-[#0F0F0F] dark:from-[#FFFFFF] dark:to-[#E0E0E0] text-white dark:text-black font-semibold rounded-lg transition-all duration-150 hover:from-[#2d2d2d] hover:to-[#171717] dark:hover:from-[#F0F0F0] dark:hover:to-[#D0D0D0] active:from-[#1a1a1a] active:to-[#000000] dark:active:from-[#E0E0E0] dark:active:to-[#C0C0C0] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-inter"
          >
            {isSubmitting || signupMutation.isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Switch to Sign In */}
        <div className="mt-6 text-center">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
            Already have an account?{' '}
            <button
              onClick={onSwitchToSignIn}
              className="text-black dark:text-white font-medium hover:underline transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
