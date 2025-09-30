import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Send } from 'lucide-react';

function useAuth() {
  const [token] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hello_token');
    }
    return null;
  });

  return { token };
}

function useCard(handle) {
  return useQuery({
    queryKey: ['card', handle],
    queryFn: async () => {
      const response = await fetch(`/api/card/${handle}`);

      if (!response.ok) {
        throw new Error('Failed to fetch card');
      }

      return response.json();
    },
    enabled: !!handle,
  });
}

export default function CardView({ handle, onBack, onSayHello }) {
  const [showHelloForm, setShowHelloForm] = useState(false);
  const { token } = useAuth();
  const { data: card, isLoading } = useCard(handle);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const sendHelloMutation = useMutation({
    mutationFn: async (helloData) => {
      const response = await fetch('/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(helloData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send hello');
      }

      return response.json();
    },
    onSuccess: () => {
      reset();
      setShowHelloForm(false);
      alert('Hello sent successfully!');
      onBack(); // Go back to previous screen
    },
  });

  const onSubmitHello = (data) => {
    sendHelloMutation.mutate({
      to_handle: handle,
      note: data.note || null,
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F4F0] to-[#ECEAE7] dark:from-[#1A1A1A] dark:to-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#8B70F6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666666] dark:text-[#B0B0B0]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F4F0] to-[#ECEAE7] dark:from-[#1A1A1A] dark:to-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#666666] dark:text-[#B0B0B0] mb-4">Profile not found</p>
          <button
            onClick={onBack}
            className="text-[#8B70F6] dark:text-[#9D7DFF] font-medium hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F4F0] to-[#ECEAE7] dark:from-[#1A1A1A] dark:to-[#0F0F0F]">
      {/* Header */}
      <div className="flex items-center pt-16 pb-8 px-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors mr-4"
        >
          <ArrowLeft size={24} className="text-[#0D0D0D] dark:text-white" />
        </button>
        <h1 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">Profile</h1>
      </div>

      {/* Card Display */}
      <div className="px-6 pb-8">
        <div className="max-w-sm mx-auto">
          {/* Profile Card */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 shadow-lg border border-[#E5E7EB] dark:border-[#404040] text-center mb-6">
            {/* Avatar */}
            <div className="mb-6">
              {card.avatar_url ? (
                <img
                  src={card.avatar_url}
                  alt={card.display_name}
                  className="w-20 h-20 rounded-full mx-auto object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#8B70F6] dark:bg-[#9D7DFF] mx-auto flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">
                    {getInitials(card.display_name)}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Handle */}
            <h2 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white mb-2">
              {card.display_name}
            </h2>
            <p className="text-[#666666] dark:text-[#B0B0B0] mb-4">@{card.handle}</p>

            {/* Bio */}
            {card.bio && (
              <p className="text-[#555555] dark:text-[#C0C0C0] text-sm leading-relaxed mb-6">
                {card.bio}
              </p>
            )}

            {/* Links */}
            {card.links && Object.keys(card.links).length > 0 && (
              <div className="mb-6 space-y-2">
                {card.links.email && (
                  <a
                    href={`mailto:${card.links.email}`}
                    className="block text-[#8B70F6] dark:text-[#9D7DFF] text-sm hover:underline"
                  >
                    {card.links.email}
                  </a>
                )}
                {card.links.phone && (
                  <a
                    href={`tel:${card.links.phone}`}
                    className="block text-[#8B70F6] dark:text-[#9D7DFF] text-sm hover:underline"
                  >
                    {card.links.phone}
                  </a>
                )}
                {card.links.website && (
                  <a
                    href={card.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#8B70F6] dark:text-[#9D7DFF] text-sm hover:underline"
                  >
                    {card.links.website}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Hello Form */}
          {showHelloForm ? (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-lg border border-[#E5E7EB] dark:border-[#404040]">
              <h3 className="text-lg font-semibold text-[#0D0D0D] dark:text-white mb-4 text-center">
                Say Hello to {card.display_name}
              </h3>

              <form onSubmit={handleSubmit(onSubmitHello)} className="space-y-4">
                <div>
                  <label
                    htmlFor="note"
                    className="block text-sm font-medium text-[#333] dark:text-[#E0E0E0] mb-2"
                  >
                    Message (Optional)
                  </label>
                  <textarea
                    {...register('note')}
                    id="note"
                    rows={3}
                    placeholder="Hi! I'd like to connect..."
                    className="w-full px-4 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#0D0D0D] dark:text-white placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#8B70F6] focus:border-transparent resize-none"
                  />
                </div>

                {sendHelloMutation.error && (
                  <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {sendHelloMutation.error.message}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowHelloForm(false)}
                    className="flex-1 py-3 px-6 rounded-2xl border border-[#D0D0D0] dark:border-[#404040] text-[#333] dark:text-[#E0E0E0] font-semibold hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendHelloMutation.isLoading}
                    className="flex-1 py-3 px-6 rounded-2xl bg-[#8B70F6] dark:bg-[#9D7DFF] text-white font-semibold hover:bg-[#7E64F2] dark:hover:bg-[#8B70F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sendHelloMutation.isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Hello
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Say Hello Button */
            <button
              onClick={() => setShowHelloForm(true)}
              className="w-full py-4 px-6 rounded-2xl bg-[#8B70F6] dark:bg-[#9D7DFF] text-white font-semibold hover:bg-[#7E64F2] dark:hover:bg-[#8B70F6] transition-colors flex items-center justify-center gap-3 text-lg"
            >
              <Send size={20} />
              Say Hello
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
