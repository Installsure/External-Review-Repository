import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, MessageCircle, Clock, CheckCircle } from 'lucide-react';

function useAuth() {
  const [token] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hello_token');
    }
    return null;
  });

  return { token };
}

function useHellos(direction = 'both') {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['hellos', direction],
    queryFn: async () => {
      const params = new URLSearchParams({ direction });
      const response = await fetch(`/api/hello?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hellos');
      }

      return response.json();
    },
    enabled: !!token,
  });
}

function useIntroductions() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['introductions'],
    queryFn: async () => {
      const response = await fetch('/api/intros', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch introductions');
      }

      return response.json();
    },
    enabled: !!token,
  });
}

export default function HelloFeed({ onStartChat }) {
  const [activeTab, setActiveTab] = useState('incoming');
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: hellosData, isLoading: hellosLoading } = useHellos('both');
  const { data: introsData, isLoading: introsLoading } = useIntroductions();

  const respondToHelloMutation = useMutation({
    mutationFn: async ({ helloId, action }) => {
      const response = await fetch(`/api/hello/${helloId}/${action}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to respond to hello');
      }

      return response.json();
    },
    onSuccess: () => {
      // Refresh hellos and introductions
      queryClient.invalidateQueries({ queryKey: ['hellos'] });
      queryClient.invalidateQueries({ queryKey: ['introductions'] });
    },
  });

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMins = Math.floor((now - date) / (1000 * 60));
      return diffInMins <= 1 ? 'Just now' : `${diffInMins}m ago`;
    }

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock size={16} className="text-orange-500" />;
      case 'ACCEPTED':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'DECLINED':
        return <X size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const hellos = hellosData?.hellos || [];
  const introductions = introsData?.introductions || [];

  // Filter hellos by direction
  const incomingHellos = hellos.filter((h) => h.direction === 'incoming');
  const outgoingHellos = hellos.filter((h) => h.direction === 'outgoing');

  const renderHelloItem = (hello) => {
    const isIncoming = hello.direction === 'incoming';
    const displayName = isIncoming ? hello.from_display_name : hello.to_display_name;
    const handle = isIncoming ? hello.from_handle : hello.to_handle;
    const avatarUrl = isIncoming ? hello.from_avatar_url : hello.to_avatar_url;

    return (
      <div
        key={hello.id}
        className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-4 shadow-sm border border-[#E5E7EB] dark:border-[#404040]"
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#8B70F6] dark:bg-[#9D7DFF] flex items-center justify-center">
                <span className="text-white text-sm font-semibold">{getInitials(displayName)}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-[#0D0D0D] dark:text-white font-semibold text-sm">
                  {displayName || handle}
                </h3>
                {displayName && handle && (
                  <p className="text-[#666] dark:text-[#B0B0B0] text-xs">@{handle}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(hello.status)}
                <span className="text-xs text-[#666] dark:text-[#B0B0B0]">
                  {formatTimeAgo(hello.created_at)}
                </span>
              </div>
            </div>

            {hello.note && (
              <p className="text-[#555] dark:text-[#C0C0C0] text-sm mb-3">"{hello.note}"</p>
            )}

            {/* Action Buttons */}
            {isIncoming && hello.status === 'PENDING' && (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    respondToHelloMutation.mutate({
                      helloId: hello.id,
                      action: 'accept',
                    })
                  }
                  disabled={respondToHelloMutation.isLoading}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#8B70F6] dark:bg-[#9D7DFF] text-white text-sm font-medium hover:bg-[#7E64F2] dark:hover:bg-[#8B70F6] transition-colors disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    respondToHelloMutation.mutate({
                      helloId: hello.id,
                      action: 'decline',
                    })
                  }
                  disabled={respondToHelloMutation.isLoading}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#D0D0D0] dark:border-[#404040] text-[#333] dark:text-[#E0E0E0] text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors disabled:opacity-50"
                >
                  Decline
                </button>
              </div>
            )}

            {hello.status === 'ACCEPTED' && (
              <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                ✓ Connection established
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderIntroItem = (intro) => {
    return (
      <div
        key={intro.id}
        className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-4 shadow-sm border border-[#E5E7EB] dark:border-[#404040]"
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {intro.other_avatar_url ? (
              <img
                src={intro.other_avatar_url}
                alt={intro.other_display_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#8B70F6] dark:bg-[#9D7DFF] flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {getInitials(intro.other_display_name)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-[#0D0D0D] dark:text-white font-semibold text-sm">
                  {intro.other_display_name}
                </h3>
                <p className="text-[#666] dark:text-[#B0B0B0] text-xs">@{intro.other_handle}</p>
              </div>
              <span className="text-xs text-[#666] dark:text-[#B0B0B0]">
                {formatTimeAgo(intro.created_at)}
              </span>
            </div>

            <button
              onClick={() => onStartChat(intro.id)}
              className="flex items-center gap-2 py-2 px-3 rounded-xl bg-[#8B70F6] dark:bg-[#9D7DFF] text-white text-sm font-medium hover:bg-[#7E64F2] dark:hover:bg-[#8B70F6] transition-colors"
            >
              <MessageCircle size={16} />
              Start Chat
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F4F0] to-[#ECEAE7] dark:from-[#1A1A1A] dark:to-[#0F0F0F]">
      {/* Header */}
      <div className="pt-16 pb-6 text-center">
        <h1 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">Hello Feed</h1>
      </div>

      <div className="px-6">
        <div className="max-w-sm mx-auto">
          {/* Tab Navigation */}
          <div className="flex bg-[#E5E7EB] dark:bg-[#333] rounded-2xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                activeTab === 'incoming'
                  ? 'bg-white dark:bg-[#1E1E1E] text-[#0D0D0D] dark:text-white shadow-sm'
                  : 'text-[#666] dark:text-[#B0B0B0]'
              }`}
            >
              Incoming ({incomingHellos.length})
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                activeTab === 'outgoing'
                  ? 'bg-white dark:bg-[#1E1E1E] text-[#0D0D0D] dark:text-white shadow-sm'
                  : 'text-[#666] dark:text-[#B0B0B0]'
              }`}
            >
              Sent ({outgoingHellos.length})
            </button>
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                activeTab === 'chats'
                  ? 'bg-white dark:bg-[#1E1E1E] text-[#0D0D0D] dark:text-white shadow-sm'
                  : 'text-[#666] dark:text-[#B0B0B0]'
              }`}
            >
              Chats ({introductions.length})
            </button>
          </div>

          {/* Content */}
          <div className="space-y-3">
            {hellosLoading || introsLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-[#8B70F6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#666666] dark:text-[#B0B0B0]">Loading...</p>
              </div>
            ) : (
              <>
                {activeTab === 'incoming' && (
                  <>
                    {incomingHellos.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle
                          size={48}
                          className="text-[#666] dark:text-[#B0B0B0] mx-auto mb-4"
                        />
                        <p className="text-[#666666] dark:text-[#B0B0B0] mb-2">
                          No incoming hellos yet
                        </p>
                        <p className="text-[#999] dark:text-[#666] text-sm">
                          Share your card for others to connect with you
                        </p>
                      </div>
                    ) : (
                      incomingHellos.map(renderHelloItem)
                    )}
                  </>
                )}

                {activeTab === 'outgoing' && (
                  <>
                    {outgoingHellos.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle
                          size={48}
                          className="text-[#666] dark:text-[#B0B0B0] mx-auto mb-4"
                        />
                        <p className="text-[#666666] dark:text-[#B0B0B0] mb-2">
                          No hellos sent yet
                        </p>
                        <p className="text-[#999] dark:text-[#666] text-sm">
                          Scan someone's card to say hello
                        </p>
                      </div>
                    ) : (
                      outgoingHellos.map(renderHelloItem)
                    )}
                  </>
                )}

                {activeTab === 'chats' && (
                  <>
                    {introductions.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle
                          size={48}
                          className="text-[#666] dark:text-[#B0B0B0] mx-auto mb-4"
                        />
                        <p className="text-[#666666] dark:text-[#B0B0B0] mb-2">No active chats</p>
                        <p className="text-[#999] dark:text-[#666] text-sm">
                          Accept hello requests to start chatting
                        </p>
                      </div>
                    ) : (
                      introductions.map(renderIntroItem)
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
