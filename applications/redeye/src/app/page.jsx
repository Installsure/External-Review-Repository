import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Menu, X, User, ChevronDown, LogOut, Building, Search, Bell, Settings } from 'lucide-react';

// Components
import SignIn from '../components/Auth/SignIn';
import SignUp from '../components/Auth/SignUp';
import Dashboard from '../components/Dashboard';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Sidebar({ isOpen, onClose, currentOrg, orgs, onSelectOrg, currentView, onViewChange }) {
  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'projects', name: 'Projects', icon: '📁' },
    { id: 'tasks', name: 'Tasks', icon: '✓' },
    { id: 'files', name: 'Files', icon: '📎' },
    { id: 'activity', name: 'Activity', icon: '📈' },
    { id: 'search', name: 'Search', icon: '🔍' },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#F3F3F3] dark:bg-[#1A1A1A] transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out lg:w-60 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#E4E4E4] dark:border-[#404040]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
            <span className="text-white dark:text-black font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-lg text-black dark:text-white font-sora">RedEye</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md hover:bg-[#E4E4E4] dark:hover:bg-[#404040] transition-colors"
        >
          <X size={20} className="text-black dark:text-white" />
        </button>
      </div>

      {/* Organization Selector */}
      <div className="p-4 border-b border-[#E4E4E4] dark:border-[#404040]">
        <div className="relative">
          <select
            value={currentOrg?.id || ''}
            onChange={(e) => {
              const org = orgs.find((o) => o.id === e.target.value);
              onSelectOrg(org);
            }}
            className="w-full p-3 bg-white dark:bg-[#262626] border border-[#D1D5DB] dark:border-[#404040] rounded-lg text-black dark:text-white appearance-none cursor-pointer font-inter"
          >
            <option value="">Select organization</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF] pointer-events-none"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 font-inter ${
                currentView === item.id
                  ? 'bg-white dark:bg-[#262626] border border-[#E4E4E4] dark:border-[#404040] text-black dark:text-white'
                  : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 active:scale-[0.98]'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#E4E4E4] dark:border-[#404040]">
        <button className="w-10 h-10 bg-white dark:bg-[#262626] rounded-full border border-[#DADADA] dark:border-[#404040] flex items-center justify-center transition-all duration-200 hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] hover:border-[#C0C0C0] dark:hover:border-[#505050] active:scale-95">
          <Settings size={18} className="text-black/70 dark:text-white/70" />
        </button>
      </div>
    </div>
  );
}

function Header({ onMenuClick, user, onLogout }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-[#F3F3F3] dark:bg-[#1A1A1A] border-b border-[#E4E4E4] dark:border-[#404040] flex items-center justify-between px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[#E4E4E4] dark:hover:bg-[#404040] transition-colors"
        >
          <Menu size={20} className="text-black dark:text-white" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 h-10 pl-10 pr-4 rounded-full bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white placeholder-[#6E6E6E] dark:placeholder-[#888888] focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors font-inter"
            />
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#6E6E6E] dark:text-[#888888]"
            />
          </div>
        </div>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-full bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] flex items-center justify-center hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] transition-colors">
          <Bell size={18} className="text-black dark:text-white" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#E4E4E4] dark:hover:bg-[#404040] transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-b from-[#252525] to-[#0F0F0F] dark:from-[#FFFFFF] dark:to-[#E0E0E0] rounded-full flex items-center justify-center">
              <User size={16} className="text-white dark:text-black" />
            </div>
            <span className="hidden md:block font-medium text-black dark:text-white font-inter">
              {user?.name}
            </span>
            <ChevronDown size={16} className="text-black dark:text-white" />
          </button>

          {userMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] rounded-lg shadow-lg z-50">
              <div className="p-2">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] rounded-md transition-colors font-inter text-red-600 dark:text-red-400"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('signin'); // 'signin' or 'signup'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentOrg, setCurrentOrg] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // TODO: Validate token and fetch user data
      // For now, we'll assume the token is valid
      setIsAuthenticated(true);

      // Mock user data - in real app, fetch from API
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const mockOrgs = [
        { id: '1', name: 'RedEye HQ', role: 'OWNER' },
        { id: '2', name: 'Demo Organization', role: 'MEMBER' },
      ];

      setUser(mockUser);
      setOrgs(mockOrgs);
      setCurrentOrg(mockOrgs[0]);
    }
    setIsLoading(false);
  }, []);

  const handleAuth = (authData) => {
    setUser(authData.user);
    setOrgs(authData.orgs || []);
    setCurrentOrg(authData.orgs?.[0] || authData.org);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setOrgs([]);
    setCurrentOrg(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleSelectOrg = (org) => {
    setCurrentOrg(org);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-black dark:bg-white rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-white dark:text-black font-bold text-xl">R</span>
          </div>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">Loading RedEye...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        {authView === 'signin' ? (
          <SignIn onSignIn={handleAuth} onSwitchToSignUp={() => setAuthView('signup')} />
        ) : (
          <SignUp onSignUp={handleAuth} onSwitchToSignIn={() => setAuthView('signin')} />
        )}
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentOrg={currentOrg}
          orgs={orgs}
          onSelectOrg={handleSelectOrg}
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setSidebarOpen(true)} user={user} onLogout={handleLogout} />

          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            {currentView === 'dashboard' && (
              <Dashboard user={user} currentOrg={currentOrg} onSelectOrg={handleSelectOrg} />
            )}

            {currentView === 'projects' && (
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white font-sora">
                  Projects
                </h2>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  Projects view coming soon...
                </p>
              </div>
            )}

            {currentView === 'tasks' && (
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white font-sora">
                  Tasks
                </h2>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  Tasks view coming soon...
                </p>
              </div>
            )}

            {currentView === 'files' && (
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white font-sora">
                  Files
                </h2>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  Files view coming soon...
                </p>
              </div>
            )}

            {currentView === 'activity' && (
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white font-sora">
                  Activity
                </h2>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  Activity view coming soon...
                </p>
              </div>
            )}

            {currentView === 'search' && (
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white font-sora">
                  Search
                </h2>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  Search view coming soon...
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
