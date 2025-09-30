import { useState } from 'react';
import {
  ChevronDown,
  Server,
  DollarSign,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  Activity,
  Users,
  Globe,
} from 'lucide-react';

export default function OverviewStats() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOptionClick = (option) => {
    setIsDropdownOpen(false);
    // Handle option selection here
  };

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-[28px] lg:text-[30px] font-bold leading-[110%] text-black dark:text-white font-sora mb-2">
            Infrastructure Overview
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
            Monitor your ZeroStack deployments and performance
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center h-11 px-5 bg-white dark:bg-[#262626] border border-[#D9D9D9] dark:border-[#404040] rounded-[24px] font-opensans text-[15px] text-[#4D4D4D] dark:text-[#B0B0B0] transition-all duration-150 hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] hover:border-[#C0C0C0] dark:hover:border-[#505050] active:bg-[#EEEEEE] dark:active:bg-[#333333] active:scale-[0.98] w-full sm:w-auto justify-between sm:justify-start"
          >
            Last 30 days
            <ChevronDown
              size={16}
              className="ml-3 text-[#4D4D4D] dark:text-[#B0B0B0]"
              strokeWidth={1.5}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-[#262626] border border-[#D9D9D9] dark:border-[#404040] rounded-lg z-10">
              <div className="py-2">
                {['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last year'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className="w-full text-left px-4 py-2 text-sm text-[#4D4D4D] dark:text-[#B0B0B0] transition-colors duration-150 hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] active:bg-[#EEEEEE] dark:active:bg-[#333333]"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Deployments */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#DBEAFE] dark:bg-[rgba(59,130,246,0.15)] rounded-lg flex items-center justify-center">
              <Server size={20} className="text-[#3B82F6] dark:text-[#60A5FA]" strokeWidth={1.8} />
            </div>
            <span className="font-opensans font-semibold text-[16px] text-[#4D4D4D] dark:text-[#B0B0B0]">
              Active Deployments
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-2">
            <span className="font-sora font-bold text-[48px] sm:text-[52px] leading-none text-black dark:text-white tracking-[-0.01em]">
              12
            </span>

            <div className="flex items-center gap-2 h-[30px] px-4 bg-[rgba(34,197,94,0.08)] dark:bg-[rgba(34,197,94,0.15)] border border-[#BEEBD1] dark:border-[#22C55E]/30 rounded-[9999px] transition-all duration-150 hover:bg-[rgba(34,197,94,0.12)] dark:hover:bg-[rgba(34,197,94,0.20)] hover:border-[#A8E6C1] dark:hover:border-[#22C55E]/40 cursor-pointer w-fit">
              <ArrowUp size={14} className="text-[#22C55E] dark:text-[#34D058]" strokeWidth={1.6} />
              <span className="font-jetbrains font-bold text-[14px] text-[#22C55E] dark:text-[#34D058]">
                8.3%
              </span>
            </div>
          </div>

          <p className="font-opensans text-[14px] text-[#8A8A8A] dark:text-[#888888]">
            vs last month
          </p>
        </div>

        {/* Monthly Spend */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#ECFDF5] dark:bg-[rgba(34,197,94,0.15)] rounded-lg flex items-center justify-center">
              <DollarSign
                size={20}
                className="text-[#22C55E] dark:text-[#34D058]"
                strokeWidth={1.8}
              />
            </div>
            <span className="font-opensans font-semibold text-[16px] text-[#4D4D4D] dark:text-[#B0B0B0]">
              Monthly Spend
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-2">
            <span className="font-sora font-bold text-[48px] sm:text-[52px] leading-none text-black dark:text-white tracking-[-0.01em]">
              $1.2k
            </span>

            <div className="flex items-center gap-2 h-[30px] px-4 bg-[rgba(239,68,68,0.08)] dark:bg-[rgba(239,68,68,0.15)] border border-[#FECACA] dark:border-[#EF4444]/30 rounded-[9999px] transition-all duration-150 hover:bg-[rgba(239,68,68,0.12)] dark:hover:bg-[rgba(239,68,68,0.20)] hover:border-[#FCA5A5] dark:hover:border-[#EF4444]/40 cursor-pointer w-fit">
              <ArrowUp size={14} className="text-[#EF4444] dark:text-[#F87171]" strokeWidth={1.6} />
              <span className="font-jetbrains font-bold text-[14px] text-[#EF4444] dark:text-[#F87171]">
                12.4%
              </span>
            </div>
          </div>

          <p className="font-opensans text-[14px] text-[#8A8A8A] dark:text-[#888888]">
            vs last month
          </p>
        </div>

        {/* System Health */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#F0FDF4] dark:bg-[rgba(34,197,94,0.15)] rounded-lg flex items-center justify-center">
              <Activity
                size={20}
                className="text-[#16A34A] dark:text-[#22C55E]"
                strokeWidth={1.8}
              />
            </div>
            <span className="font-opensans font-semibold text-[16px] text-[#4D4D4D] dark:text-[#B0B0B0]">
              System Health
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-2">
            <span className="font-sora font-bold text-[48px] sm:text-[52px] leading-none text-[#22C55E] dark:text-[#34D058] tracking-[-0.01em]">
              99.8%
            </span>

            <div className="flex items-center gap-2 h-[30px] px-4 bg-[rgba(34,197,94,0.08)] dark:bg-[rgba(34,197,94,0.15)] border border-[#BEEBD1] dark:border-[#22C55E]/30 rounded-[9999px] transition-all duration-150 hover:bg-[rgba(34,197,94,0.12)] dark:hover:bg-[rgba(34,197,94,0.20)] hover:border-[#A8E6C1] dark:hover:border-[#22C55E]/40 cursor-pointer w-fit">
              <span className="font-jetbrains font-bold text-[14px] text-[#22C55E] dark:text-[#34D058]">
                Healthy
              </span>
            </div>
          </div>

          <p className="font-opensans text-[14px] text-[#8A8A8A] dark:text-[#888888]">
            uptime this month
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="font-sora font-bold text-[20px] md:text-[24px] text-[#0D0D0D] dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] dark:bg-[#1F2937] border border-[#E2E8F0] dark:border-[#374151] rounded-lg transition-all duration-150 hover:bg-[#F1F5F9] dark:hover:bg-[#374151] hover:border-[#CBD5E1] dark:hover:border-[#4B5563] active:bg-[#E2E8F0] dark:active:bg-[#1F2937] active:scale-95">
            <Globe size={24} className="text-[#6366F1] dark:text-[#818CF8] mb-2" />
            <span className="text-sm font-medium text-[#374151] dark:text-[#D1D5DB] font-inter">
              Deploy New
            </span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] dark:bg-[#1F2937] border border-[#E2E8F0] dark:border-[#374151] rounded-lg transition-all duration-150 hover:bg-[#F1F5F9] dark:hover:bg-[#374151] hover:border-[#CBD5E1] dark:hover:border-[#4B5563] active:bg-[#E2E8F0] dark:active:bg-[#1F2937] active:scale-95">
            <Users size={24} className="text-[#10B981] dark:text-[#34D399] mb-2" />
            <span className="text-sm font-medium text-[#374151] dark:text-[#D1D5DB] font-inter">
              Manage Users
            </span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] dark:bg-[#1F2937] border border-[#E2E8F0] dark:border-[#374151] rounded-lg transition-all duration-150 hover:bg-[#F1F5F9] dark:hover:bg-[#374151] hover:border-[#CBD5E1] dark:hover:border-[#4B5563] active:bg-[#E2E8F0] dark:active:bg-[#1F2937] active:scale-95">
            <DollarSign size={24} className="text-[#F59E0B] dark:text-[#FBBF24] mb-2" />
            <span className="text-sm font-medium text-[#374151] dark:text-[#D1D5DB] font-inter">
              View Billing
            </span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] dark:bg-[#1F2937] border border-[#E2E8F0] dark:border-[#374151] rounded-lg transition-all duration-150 hover:bg-[#F1F5F9] dark:hover:bg-[#374151] hover:border-[#CBD5E1] dark:hover:border-[#4B5563] active:bg-[#E2E8F0] dark:active:bg-[#1F2937] active:scale-95">
            <Activity size={24} className="text-[#EF4444] dark:text-[#F87171] mb-2" />
            <span className="text-sm font-medium text-[#374151] dark:text-[#D1D5DB] font-inter">
              System Logs
            </span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sora font-bold text-[20px] text-[#0D0D0D] dark:text-white">
            Recent Activity
          </h3>
          <button className="flex items-center gap-2 text-sm text-[#6366F1] dark:text-[#818CF8] font-medium font-inter transition-colors duration-150 hover:text-[#5B5EF0] dark:hover:text-[#9CA3F7] active:text-[#4F46E5] dark:active:text-[#6366F1]">
            View all
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {[
            {
              action: 'SlimFuse Store deployed successfully',
              time: '2 minutes ago',
              status: 'success',
            },
            {
              action: 'Hello Dating API updated',
              time: '1 hour ago',
              status: 'success',
            },
            {
              action: 'Content/Video Hub scaling initiated',
              time: '3 hours ago',
              status: 'warning',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-[#F8FAFC] dark:bg-[#1F2937] border border-[#E2E8F0] dark:border-[#374151] rounded-lg"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  item.status === 'success'
                    ? 'bg-[#22C55E] dark:bg-[#34D058]'
                    : 'bg-[#F59E0B] dark:bg-[#FBBF24]'
                }`}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-[#374151] dark:text-[#D1D5DB] font-inter">
                  {item.action}
                </div>
                <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
