import { Home, Users, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { label: 'Dashboard', icon: Home, active: true },
  { label: 'Gebruikers', icon: Users, active: false },
  { label: 'Boekingen', icon: Calendar, active: false },
  { label: 'Instellingen', icon: Settings, active: false },
];

export const AdminSidebar = () => {
  return (
    <aside className="w-60 bg-gray-900 p-6 border-r border-gray-800">
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                item.active
                  ? "bg-gray-800 text-white border-l-2 border-white"
                  : "text-gray-300 hover:bg-gray-800"
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
