import { useState } from 'react';
import { Store, Heart, PlayCircle, Plus, ExternalLink, Settings } from 'lucide-react';

export default function AppSwitcher() {
  const [hoveredApp, setHoveredApp] = useState(null);

  const blueprintApps = [
    {
      id: 1,
      name: 'SlimFuse Store',
      description: 'Modern e-commerce platform with inventory management',
      icon: Store,
      status: 'Active',
      url: '/demo/store',
      gradient: 'from-[#059669] to-[#10B981]',
      bgColor: 'bg-[#ECFDF5] dark:bg-[rgba(16,185,129,0.1)]',
      iconColor: 'text-[#059669] dark:text-[#10B981]',
      users: '2.3k',
      revenue: '$45.2k',
    },
    {
      id: 2,
      name: 'Hello Dating',
      description: 'AI-powered dating app with real-time messaging',
      icon: Heart,
      status: 'Active',
      url: '/demo/dating',
      gradient: 'from-[#DC2626] to-[#EF4444]',
      bgColor: 'bg-[#FEF2F2] dark:bg-[rgba(239,68,68,0.1)]',
      iconColor: 'text-[#DC2626] dark:text-[#EF4444]',
      users: '1.8k',
      revenue: '$32.1k',
    },
    {
      id: 3,
      name: 'Content/Video Hub',
      description: 'Video streaming platform with transcription',
      icon: PlayCircle,
      status: 'Development',
      url: '/demo/content',
      gradient: 'from-[#7C3AED] to-[#8B5CF6]',
      bgColor: 'bg-[#FAF5FF] dark:bg-[rgba(139,92,246,0.1)]',
      iconColor: 'text-[#7C3AED] dark:text-[#8B5CF6]',
      users: '892',
      revenue: '$18.7k',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6 md:p-8 mb-6 md:mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-[28px] lg:text-[30px] font-bold leading-[110%] text-black dark:text-white font-sora mb-2">
            Your Blueprint Apps
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
            Manage and deploy your ZeroStack applications
          </p>
        </div>

        <button className="flex items-center gap-2 h-11 px-5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-lg font-inter text-[15px] text-white transition-all duration-150 hover:from-[#5B5EF0] hover:to-[#7E56F5] active:from-[#524DF0] active:to-[#7049F4] active:scale-[0.98] w-full sm:w-auto justify-center">
          <Plus size={16} />
          Create New App
        </button>
      </div>

      {/* App Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {blueprintApps.map((app) => {
          const Icon = app.icon;
          const isHovered = hoveredApp === app.id;

          return (
            <div
              key={app.id}
              className={`relative bg-white dark:bg-[#262626] rounded-xl border border-[#E5E7EB] dark:border-[#404040] p-6 transition-all duration-200 cursor-pointer ${
                isHovered
                  ? 'shadow-lg scale-[1.02] border-[#D1D5DB] dark:border-[#505050]'
                  : 'hover:shadow-md hover:border-[#D1D5DB] dark:hover:border-[#505050] active:scale-[0.98]'
              }`}
              onMouseEnter={() => setHoveredApp(app.id)}
              onMouseLeave={() => setHoveredApp(null)}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    app.status === 'Active'
                      ? 'bg-[#DCFCE7] dark:bg-[rgba(34,197,94,0.15)] text-[#16A34A] dark:text-[#22C55E] border border-[#BBF7D0] dark:border-[#22C55E]/30'
                      : 'bg-[#FEF3C7] dark:bg-[rgba(245,158,11,0.15)] text-[#D97706] dark:text-[#F59E0B] border border-[#FDE68A] dark:border-[#F59E0B]/30'
                  } font-inter`}
                >
                  {app.status}
                </span>
              </div>

              {/* App Icon */}
              <div
                className={`w-16 h-16 rounded-xl ${app.bgColor} flex items-center justify-center mb-4`}
              >
                <Icon size={32} className={app.iconColor} />
              </div>

              {/* App Info */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black dark:text-white mb-2 font-sora">
                  {app.name}
                </h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm leading-relaxed font-inter">
                  {app.description}
                </p>
              </div>

              {/* Metrics */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-lg font-bold text-black dark:text-white font-sora">
                    {app.users}
                  </div>
                  <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                    Active Users
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-black dark:text-white font-sora">
                    {app.revenue}
                  </div>
                  <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                    Monthly Revenue
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 h-10 px-4 bg-gradient-to-r from-[#374151] to-[#4B5563] text-white font-medium text-sm rounded-lg transition-all duration-150 hover:from-[#4B5563] hover:to-[#6B7280] active:from-[#374151] active:to-[#4B5563] active:scale-95 font-inter">
                  <ExternalLink size={16} />
                  Open App
                </button>
                <button className="w-10 h-10 bg-[#F9FAFB] dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg flex items-center justify-center transition-all duration-150 hover:bg-[#F3F4F6] dark:hover:bg-[#4B5563] hover:border-[#D1D5DB] dark:hover:border-[#6B7280] active:bg-[#E5E7EB] dark:active:bg-[#374151] active:scale-95">
                  <Settings size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#374151]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-black dark:text-white mb-1 font-sora">3</div>
            <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">Active Apps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black dark:text-white mb-1 font-sora">5.0k</div>
            <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black dark:text-white mb-1 font-sora">$96k</div>
            <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">
              Total Revenue
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#22C55E] dark:text-[#34D058] mb-1 font-sora">
              99.9%
            </div>
            <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}
