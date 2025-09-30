import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useAuth() {
  const [token] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hello_token');
    }
    return null;
  });

  return { token };
}

export default function Onboarding({ onComplete }) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const createProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const response = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create profile');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      onComplete();
    },
    onError: (error) => {
      if (error.message.includes('Handle already taken')) {
        setError('handle', { message: 'This handle is already taken' });
      } else {
        setError('root', { message: error.message });
      }
    },
  });

  const onSubmit = (data) => {
    createProfileMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F4F0] to-[#ECEAE7] dark:from-[#1A1A1A] dark:to-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="text-center pt-16 pb-8">
        <div className="w-16 h-16 bg-[#8B70F6] dark:bg-[#9D7DFF] rounded-3xl flex items-center justify-center mx-auto mb-6">
          <div className="text-white text-2xl font-semibold">👋</div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-[#0D0D0D] dark:text-white mb-4">
          Welcome to Hello
        </h1>
        <p className="text-base text-[#666666] dark:text-[#B0B0B0] max-w-sm mx-auto px-6">
          Create your digital card to connect with people instantly
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6">
        <div className="max-w-sm mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Display Name */}
            <div>
              <label
                htmlFor="display_name"
                className="block text-sm font-medium text-[#333] dark:text-[#E0E0E0] mb-2"
              >
                Display Name *
              </label>
              <input
                {...register('display_name', {
                  required: 'Display name is required',
                  minLength: {
                    value: 2,
                    message: 'Must be at least 2 characters',
                  },
                })}
                type="text"
                id="display_name"
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#8B70F6] focus:border-transparent"
              />
              {errors.display_name && (
                <p className="text-red-500 text-sm mt-1">{errors.display_name.message}</p>
              )}
            </div>

            {/* Handle */}
            <div>
              <label
                htmlFor="handle"
                className="block text-sm font-medium text-[#333] dark:text-[#E0E0E0] mb-2"
              >
                Handle *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666] dark:text-[#B0B0B0]">
                  @
                </span>
                <input
                  {...register('handle', {
                    required: 'Handle is required',
                    pattern: {
                      value: /^[a-zA-Z0-9_-]{3,20}$/,
                      message: 'Handle must be 3-20 characters (letters, numbers, _, -)',
                    },
                  })}
                  type="text"
                  id="handle"
                  placeholder="yourusername"
                  className="w-full pl-8 pr-4 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#8B70F6] focus:border-transparent"
                />
              </div>
              {errors.handle && (
                <p className="text-red-500 text-sm mt-1">{errors.handle.message}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-[#333] dark:text-[#E0E0E0] mb-2"
              >
                Bio (Optional)
              </label>
              <textarea
                {...register('bio')}
                id="bio"
                rows={3}
                placeholder="Tell people about yourself..."
                className="w-full px-4 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#8B70F6] focus:border-transparent resize-none"
              />
            </div>

            {/* Error message */}
            {errors.root && (
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.root.message}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={createProfileMutation.isLoading}
              className="w-full py-3 px-6 rounded-2xl bg-[#8B70F6] dark:bg-[#9D7DFF] hover:bg-[#7E64F2] dark:hover:bg-[#8B70F6] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {createProfileMutation.isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Profile...
                </>
              ) : (
                'Create Profile'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 px-6">
        <p className="text-xs text-[#999] dark:text-[#666]">
          By continuing, you agree to share your profile publicly
        </p>
      </div>
    </div>
  );
}
