import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Onboarding from '@/components/Onboarding';
import MyCard from '@/components/MyCard';
import Scan from '@/components/Scan';
import HelloFeed from '@/components/HelloFeed';
import CardView from '@/components/CardView';
import Nav from '@/components/Nav';

// Auth hooks
function useAuth() {
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hello_token');
    }
    return null;
  });

  const [userId, setUserId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hello_user_id');
    }
    return null;
  });

  const login = async (existingUserId = null) => {
    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: existingUserId }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }

      const data = await response.json();
      setToken(data.token);
      setUserId(data.userId);

      if (typeof window !== 'undefined') {
        localStorage.setItem('hello_token', data.token);
        localStorage.setItem('hello_user_id', data.userId);
      }

      return data;
    } catch (error) {
      console.error('Auth failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hello_token');
      localStorage.removeItem('hello_user_id');
    }
  };

  return { token, userId, login, logout, isAuthenticated: !!token };
}

function useProfile() {
  const { token, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!isAuthenticated || !token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/profile/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        return null; // Profile doesn't exist yet
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return response.json();
    },
    enabled: isAuthenticated,
  });
}

export default function HelloApp() {
  const [currentPage, setCurrentPage] = useState('my-card');
  const [selectedIntroId, setSelectedIntroId] = useState(null);
  const [viewingCard, setViewingCard] = useState(null);
  const { isAuthenticated, login } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  // Auto-login on mount if no token exists
  useEffect(() => {
    if (!isAuthenticated) {
      login();
    }
  }, [isAuthenticated, login]);

  // Show chat page when intro is selected
  if (selectedIntroId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F4F0] dark:bg-[#121212]">
        <p className="text-[#666666] dark:text-[#B0B0B0]">Chat page - Coming soon</p>
        <button
          onClick={() => setSelectedIntroId(null)}
          className="ml-4 text-[#8B70F6] dark:text-[#9D7DFF] font-medium hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Show card view when viewing someone's card
  if (viewingCard) {
    return (
      <CardView
        handle={viewingCard}
        onBack={() => setViewingCard(null)}
        onSayHello={(handle) => {
          setViewingCard(null);
          setCurrentPage('scan');
        }}
      />
    );
  }

  // Show onboarding if authenticated but no profile
  if (isAuthenticated && !profileLoading && !profile) {
    return <Onboarding onComplete={() => setCurrentPage('my-card')} />;
  }

  // Main app with navigation
  const renderPage = () => {
    switch (currentPage) {
      case 'my-card':
        return <MyCard />;
      case 'scan':
        return <Scan onCardFound={(handle) => setViewingCard(handle)} />;
      case 'hellos':
        return <HelloFeed onStartChat={(introId) => setSelectedIntroId(introId)} />;
      case 'settings':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-[#666666] dark:text-[#B0B0B0]">Settings page - Coming soon</p>
          </div>
        );
      default:
        return <MyCard />;
    }
  };

  if (!isAuthenticated || profileLoading) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#8B70F6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666666] dark:text-[#B0B0B0]">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] dark:bg-[#121212]">
      <div className="max-w-md mx-auto bg-white dark:bg-[#1A1A1A] min-h-screen flex flex-col">
        {/* Page content */}
        <div className="flex-1">{renderPage()}</div>

        {/* Bottom navigation */}
        <Nav currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
