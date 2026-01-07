'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { GlobalHairLogo } from '@/components/logos/GlobalHairLogo';
import {
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  User,
} from 'lucide-react';

interface AdminSidebarContentProps {
  onNavigate?: () => void;
  showLogout?: boolean;
}

// Grouped Navigation
const navigationGroups = [
  {
    title: 'Content',
    items: [
      { label: 'Pages', path: '/admin/pages', icon: FileText },
      { label: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Site Settings', path: '/admin/settings', icon: Settings },
    ]
  }
];

export const AdminSidebarContent = ({ onNavigate, showLogout }: AdminSidebarContentProps) => {
  const pathname = usePathname();
  const { user, signOut } = useAdminAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex flex-col h-full font-['Inter']">
      {/* Logo Header */}
      <div className="h-20 flex items-center justify-center px-6 border-b border-white/5">
        <GlobalHairLogo className="h-14 w-auto" />
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-8 space-y-8 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-3 mb-3 text-[10px] font-light text-white/40 uppercase tracking-[0.15em] letter-spacing-wider">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.path);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    href={item.path as any}
                    onClick={onNavigate}
                    className={`
                      group relative flex items-center gap-3 px-3 py-2.5 text-[13px] font-light rounded-lg transition-all duration-200
                      ${isActive
                        ? 'text-white bg-white/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full" />
                    )}
                    <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`} strokeWidth={1.5} />
                    <span className="font-normal">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div className="p-4 mt-auto border-t border-white/5">
        <div className="px-3 py-3 flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <User className="w-[18px] h-[18px] text-white/60" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-normal text-white truncate">Admin</p>
            <p className="text-[11px] font-light text-white/40 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-light text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px]" strokeWidth={1.5} />
          <span className="font-normal">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
