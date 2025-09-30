import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Share, Download, QrCode } from 'lucide-react';

function useAuth() {
  const [token] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hello_token');
    }
    return null;
  });

  return { token };
}

function useProfile() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('/api/profile/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return response.json();
    },
    enabled: !!token,
  });
}

export default function MyCard() {
  const [showQR, setShowQR] = useState(false);
  const { data: profile, isLoading } = useProfile();

  const handleShareLink = async () => {
    const url = `${window.location.origin}/card/${profile?.handle}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.display_name}'s Hello Card`,
          text: `Connect with ${profile?.display_name}`,
          url: url,
        });
      } catch (err) {
        // User cancelled sharing
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const handleDownloadVCard = () => {
    if (profile?.handle) {
      window.open(`/api/card/${profile.handle}/vcard`, '_blank');
    }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#8B70F6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666666] dark:text-[#B0B0B0]">Loading your card...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#666666] dark:text-[#B0B0B0]">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F4F0] to-[#ECEAE7] dark:from-[#1A1A1A] dark:to-[#0F0F0F]">
      {/* Header */}
      <div className="pt-16 pb-8 text-center">
        <h1 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">My Card</h1>
      </div>

      {/* Card Display */}
      <div className="px-6 pb-8">
        <div className="max-w-sm mx-auto">
          {/* Main Card */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 shadow-lg border border-[#E5E7EB] dark:border-[#404040] text-center">
            {/* Avatar */}
            <div className="mb-6">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="w-20 h-20 rounded-full mx-auto object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#8B70F6] dark:bg-[#9D7DFF] mx-auto flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">
                    {getInitials(profile.display_name)}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Handle */}
            <h2 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white mb-2">
              {profile.display_name}
            </h2>
            <p className="text-[#666666] dark:text-[#B0B0B0] mb-4">@{profile.handle}</p>

            {/* Bio */}
            {profile.bio && (
              <p className="text-[#555555] dark:text-[#C0C0C0] text-sm leading-relaxed mb-6">
                {profile.bio}
              </p>
            )}

            {/* Links */}
            {profile.links && Object.keys(profile.links).length > 0 && (
              <div className="mb-6 space-y-2">
                {profile.links.email && (
                  <a
                    href={`mailto:${profile.links.email}`}
                    className="block text-[#8B70F6] dark:text-[#9D7DFF] text-sm hover:underline"
                  >
                    {profile.links.email}
                  </a>
                )}
                {profile.links.phone && (
                  <a
                    href={`tel:${profile.links.phone}`}
                    className="block text-[#8B70F6] dark:text-[#9D7DFF] text-sm hover:underline"
                  >
                    {profile.links.phone}
                  </a>
                )}
                {profile.links.website && (
                  <a
                    href={profile.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#8B70F6] dark:text-[#9D7DFF] text-sm hover:underline"
                  >
                    {profile.links.website}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* QR Code Display */}
          {showQR && (
            <div className="mt-6 bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 shadow-lg border border-[#E5E7EB] dark:border-[#404040] text-center">
              <h3 className="text-lg font-semibold text-[#0D0D0D] dark:text-white mb-4">
                Scan to Connect
              </h3>
              <div className="flex justify-center mb-4">
                <img
                  src={`/api/card/${profile.handle}/qrcode`}
                  alt="QR Code"
                  className="w-48 h-48 border border-[#E5E7EB] dark:border-[#404040] rounded-2xl"
                />
              </div>
              <p className="text-sm text-[#666666] dark:text-[#B0B0B0]">
                Others can scan this code to view your card
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-2xl border border-[#8B70F6] dark:border-[#9D7DFF] text-[#8B70F6] dark:text-[#9D7DFF] font-semibold hover:bg-[#8B70F6] hover:text-white dark:hover:bg-[#9D7DFF] dark:hover:text-white transition-colors"
            >
              <QrCode size={20} />
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>

            <button
              onClick={handleShareLink}
              className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-2xl bg-[#8B70F6] dark:bg-[#9D7DFF] text-white font-semibold hover:bg-[#7E64F2] dark:hover:bg-[#8B70F6] transition-colors"
            >
              <Share size={20} />
              Share Link
            </button>

            <button
              onClick={handleDownloadVCard}
              className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-2xl border border-[#D0D0D0] dark:border-[#404040] text-[#333] dark:text-[#E0E0E0] font-semibold hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
            >
              <Download size={20} />
              Download vCard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
