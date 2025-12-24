'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedHeadHero } from './AnimatedHeadHero';
import Image from 'next/image';

interface GlassHeaderV6Props {
  hideButton?: boolean;
}

export const GlassHeaderV6 = ({ hideButton = false }: GlassHeaderV6Props) => {
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
        {/* Logo with Hairboost text */}
        <div className="flex items-center gap-1.5">
          <Image
            src="/logo-v6-hairboost.png"
            alt="V6 Hairboost Logo"
            width={56}
            height={56}
            style={{ height: '3.5rem', width: 'auto', cursor: 'pointer' }}
            onClick={() => {
              const homeUrl = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
              window.location.href = homeUrl;
            }}
          />
          <span className="text-white font-normal tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.3rem' }}>
            Hairboost<sup className="text-xs ml-0.5 -mt-1">®</sup>
          </span>
        </div>

        {/* Button - right side (desktop only) */}
        {!isMobile && !hideButton && (
          <div className="flex items-center">
            <AnimatedHeadHero inHeader={true} />
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
