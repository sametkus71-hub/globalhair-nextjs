import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';
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
    <div className="h-screen overflow-hidden bg-gray-50">
      {/* Fixed logout button */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-6 z-50 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        Uitloggen
      </button>

      {/* Main area with sidebar + content */}
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
