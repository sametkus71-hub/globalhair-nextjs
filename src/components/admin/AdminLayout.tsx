import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';
import hairtransplantLogo from '@/assets/hairtransplant-logo.png';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-4 py-4 flex items-center justify-between">
          <img 
            src={hairtransplantLogo} 
            alt="GHI Hairtransplant Logo" 
            className="h-12 object-contain"
          />
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
          >
            Uitloggen
          </button>
        </div>
      </header>

      {/* Main area with sidebar + content */}
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
