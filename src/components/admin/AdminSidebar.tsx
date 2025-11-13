import { cn } from '@/lib/utils';

const navigationItems = [
  { label: 'Dashboard', active: true },
  { label: 'Gebruikers', active: false },
  { label: 'Boekingen', active: false },
  { label: 'Instellingen', active: false },
];

export const AdminSidebar = () => {
  return (
    <aside className="w-44 bg-gray-800 pt-6 px-3">
      <nav className="space-y-1">
        {navigationItems.map((item) => {
          return (
            <button
              key={item.label}
              className={cn(
                "w-full text-left px-2 py-1.5 text-xs transition-colors",
                item.active
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
