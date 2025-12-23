'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedHeadHero } from './AnimatedHeadHero';
import Image from 'next/image';
import hairtransplantLogo from '@/assets/hairtransplant-logo.png';

interface GlassHeaderProps {
  hideButton?: boolean;
}

export const GlassHeader = ({ hideButton = false }: GlassHeaderProps) => {
  const router = useRouter();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isBookingPage = pathname?.includes('/boek') || pathname?.includes('/book');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 animate-fade-in transition-all duration-500 ease-out ${isBookingPage ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      style={{
        animation: !isBookingPage ? 'fade-down 0.6s ease-out' : 'none',
      }}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src={hairtransplantLogo}
            alt="GHI Hairtransplant Logo"
            priority={true}
            style={{ height: '2.5rem', width: 'auto', cursor: 'pointer' }}
            onClick={() => {
              const homeUrl = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
              window.location.href = homeUrl;
            }}
          />
        </div>


        {/* Button - right side (desktop only) - Removed as per request */}
        {!isMobile && !hideButton && (
          <div className="flex items-center hidden">
            {/* Hidden to preserve structure if needed, or just remove content */}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};
