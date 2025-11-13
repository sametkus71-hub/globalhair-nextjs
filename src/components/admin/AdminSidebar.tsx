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
    <aside className="w-52 bg-gray-900 pt-6 px-3">
      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                item.active
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
