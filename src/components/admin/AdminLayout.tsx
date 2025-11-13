import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminSidebarContent } from './AdminSidebarContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  // Get page title based on route
  const getPageTitle = () => {
    if (location.pathname === '/admin/reviews') return 'Reviews';
    if (location.pathname === '/admin') return 'Dashboard';
    return 'Admin';
  };

  if (isMobile) {
    return (
      <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4 flex-shrink-0">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-gray-800 border-gray-700">
              <AdminSidebarContent 
                onNavigate={() => setSheetOpen(false)}
                showLogout={true}
              />
            </SheetContent>
          </Sheet>
          <h1 className="ml-4 text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
        </header>

        {/* Mobile Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      {/* Desktop: Fixed logout button */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-6 z-50 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        Uitloggen
      </button>

      {/* Desktop: Sidebar + Content */}
      <div className="flex h-screen">
        <aside className="w-64 bg-gray-800 flex-shrink-0">
          <AdminSidebarContent />
        </aside>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
