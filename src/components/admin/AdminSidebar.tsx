import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const navigationItems = [
  { label: 'Dashboard', active: true },
  { label: 'Gebruikers', active: false },
  { label: 'Boekingen', active: false },
  { label: 'Instellingen', active: false },
];

export const AdminSidebar = () => {
  const { user } = useAdminAuth();

  return (
    <aside className="w-52 bg-gray-800 h-full overflow-y-auto flex flex-col">
      {/* User info section */}
      <div className="p-4 border-b border-gray-700">
        <div className="text-xs text-gray-400 mb-1">Ingelogd als</div>
        <div className="text-sm text-white truncate">{user?.email || 'gebruiker@example.com'}</div>
        <div className="text-xs text-gray-500 mt-1">Admin</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4 px-3 space-y-1">
        {navigationItems.map((item) => {
          return (
            <button
              key={item.label}
              className={cn(
                "w-full text-left px-3 py-2 text-sm transition-colors rounded",
                item.active
                  ? "text-white bg-gray-700"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
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
