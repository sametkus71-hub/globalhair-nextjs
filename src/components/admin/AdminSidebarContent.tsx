import { Link, useLocation } from 'react-router-dom';
import hairtransplantLogo from '@/assets/hairtransplant-logo.png';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminSidebarContentProps {
  onNavigate?: () => void;
  showLogout?: boolean;
}

const navigationItems = [
  { label: 'Dashboard', path: '/admin', enabled: true },
  { label: 'Reviews', path: '/admin/reviews', enabled: true },
  { label: 'Bookings', path: '/admin/bookings', enabled: false },
  { label: 'Availability', path: '/admin/availability', enabled: false },
];

export const AdminSidebarContent = ({ onNavigate, showLogout = false }: AdminSidebarContentProps) => {
  const location = useLocation();
  const { user, signOut } = useAdminAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <img src={hairtransplantLogo} alt="Logo" className="h-10 object-contain" />
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-700">
        <p className="text-sm text-gray-400 mb-1">Ingelogd als</p>
        <p className="text-sm text-white font-medium truncate">{user?.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = item.path === '/admin/reviews' 
            ? location.pathname.startsWith('/admin/reviews')
            : location.pathname === item.path;
          
          if (!item.enabled) {
            return (
              <div
                key={item.path}
                className="flex items-center px-4 py-3 text-sm text-gray-500 rounded cursor-not-allowed"
              >
                {item.label}
                <span className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded">Binnenkort</span>
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center px-4 py-3 text-sm rounded transition-colors ${
                isActive
                  ? 'bg-gray-700 text-white border-l-2 border-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout button (mobile only) */}
      {showLogout && (
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors text-left"
          >
            Uitloggen
          </button>
        </div>
      )}
    </div>
  );
};
