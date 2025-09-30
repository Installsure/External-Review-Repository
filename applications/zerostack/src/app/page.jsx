import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AppSwitcher from '../components/AppSwitcher';
import OverviewStats from '../components/OverviewStats';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col xl:flex-row">
            {/* Left content column */}
            <div className="flex-1 p-4 md:p-8 xl:pr-4 min-w-0">
              <OverviewStats />
              <AppSwitcher />
            </div>

            {/* Right sidebar column */}
            <div className="xl:w-80 p-4 md:p-8 xl:pl-4 flex flex-col space-y-6 md:space-y-8">
              {/* Additional panels can go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
