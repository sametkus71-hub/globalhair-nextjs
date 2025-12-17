'use client';

import { useRouter } from 'next/navigation';
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

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 animate-fade-in"
      style={{
        animation: 'fade-down 0.6s ease-out',
      }}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src={hairtransplantLogo}
            alt="GHI Hairtransplant Logo"
            style={{ height: '2.5rem', width: 'auto', cursor: 'pointer' }}
            onClick={() => router.push((language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant') as any)}
          />
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
