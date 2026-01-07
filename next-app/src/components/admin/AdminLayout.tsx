'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
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
  const router = useRouter();
  const currentPath = usePathname();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  // Get page title based on route logic
  const getPageTitle = () => {
    if (currentPath.includes('/admin/reviews')) return 'Reviews';
    if (currentPath.includes('/admin/pages')) return 'Pages';
    if (currentPath.includes('/admin/settings')) return 'Settings';
    if (currentPath === '/admin') return 'Dashboard';
    return 'Admin';
  };

  if (isMobile) {
    return (
      <div className="h-screen overflow-hidden bg-white flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-100 h-14 flex items-center px-4 flex-shrink-0 justify-between items-center">
          <div className="flex items-center gap-3">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-md transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 bg-[#0A1628] border-r border-white/5">
                <AdminSidebarContent
                  onNavigate={() => setSheetOpen(false)}
                  showLogout={true}
                />
              </SheetContent>
            </Sheet>
            <span className="font-semibold text-gray-900 text-sm tracking-tight">{getPageTitle()}</span>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Desktop Sidebar */}
      <aside className="w-[240px] flex-shrink-0 bg-[#0A1628] border-r border-white/5 h-full">
        <AdminSidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-full scroll-smooth">
        {children}
      </main>
    </div>
  );
};
