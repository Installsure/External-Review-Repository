import { User, QrCode, MessageCircle, Settings } from 'lucide-react';

export default function Nav({ currentPage, onPageChange }) {
  const navItems = [
    {
      id: 'my-card',
      label: 'My Card',
      icon: User,
    },
    {
      id: 'scan',
      label: 'Scan',
      icon: QrCode,
    },
    {
      id: 'hellos',
      label: 'Hellos',
      icon: MessageCircle,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="bg-white dark:bg-[#1A1A1A] border-t border-[#E5E7EB] dark:border-[#404040] px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-colors ${
                isActive
                  ? 'text-[#8B70F6] dark:text-[#9D7DFF]'
                  : 'text-[#6B6B6B] dark:text-[#B0B0B0] hover:text-[#333] dark:hover:text-[#E0E0E0]'
              }`}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
