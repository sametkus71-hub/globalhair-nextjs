'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { DesktopContainer } from '@/components/layout/DesktopContainer';
import { WideContentContainer } from '@/components/layout/WideContentContainer';
import { MediumContentContainer } from '@/components/layout/MediumContentContainer';
import { GlassHeaderV6 } from '@/components/haartransplantatie/GlassHeaderV6';
import { AnimatedHeadHero } from '@/components/haartransplantatie/AnimatedHeadHero';
import { GlassTabs } from '@/components/haartransplantatie/GlassTabs';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';
import { TabPreloader } from '@/components/haartransplantatie/TabPreloader';

export const HaartransplantatieLayoutV6 = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const mainRef = useRef<HTMLElement>(null);

  // Check if we're on a package route (should render as overlay)
  const isPackageRoute = (pathname.includes('/nl/standard') ||
    pathname.includes('/nl/premium') ||
    pathname.includes('/nl/elite')) || /\/(nl|en)\/(haartransplantatie|hair-transplant)\/(nl|tr)\/(standard|premium|elite)/.test(pathname);

  // Check if we're on booking route (should render as overlay)
  const isBookingRoute = pathname.includes('/boek') || pathname.includes('/book');

  // Combined overlay check - any route that should hide header and show as overlay
  const isOverlayRoute = isPackageRoute || isBookingRoute;

  console.log('HTLayoutV6: Render', { pathname, isOverlayRoute, isBookingRoute });

  // Check if we're on reviews route (needs full width on desktop)
  const isReviewsRoute = pathname.includes('/reviews');

  // Check if we're on contact route (needs 1000px width on desktop)
  const isContactRoute = pathname.includes('/contact');

  // Check if we're on how route (needs overflow visible on desktop)
  const isHowRoute = pathname.includes('/how');

  // Determine active tab from URL
  const getActiveTab = () => {
    const path = pathname;
    if (path.includes('/reviews')) return 'Reviews';
    if (path.includes('/how')) return 'How?';
    if (path.includes('/mission')) return 'Mission';
    if (path.includes('/contact')) return 'Contact';
    return 'Treatments';
  };

  const activeTab = getActiveTab();

  // Scroll to top on pathname change
  useLayoutEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname]);

  return (
    <main
      ref={mainRef}
      className="relative min-h-[var(--app-height)] overflow-y-auto overflow-x-hidden"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <style>{`
        main::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header - Hidden on overlay routes */}
      {!isOverlayRoute && <GlassHeaderV6 />}

      {/* Tabs - Hidden on overlay routes */}
      {!isOverlayRoute && (
        <GlassTabs
          activeTab={activeTab}
          onTabChange={() => { }}
        />
      )}

      {/* Mobile CTA Button - Hidden on overlay routes */}
      {isMobile && !isOverlayRoute && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
          <div className="pointer-events-auto">
            <AnimatedHeadHero inHeader={false} />
          </div>
        </div>
      )}

      {/* Content Zone */}
      {!isPackageRoute && (
        isReviewsRoute && !isMobile ? (
          // Full width for reviews on desktop
          <div className="flex-1 flex flex-col w-full">
            <div
              className="relative flex-1 overflow-hidden flex flex-col"
              style={{
                paddingTop: 'clamp(0rem, 0.3vh, 0.6rem)',
                paddingBottom: 'clamp(6rem, 12vh, 8rem)'
              }}
            >
              {/* Content from specific page */}
              <div
                key={pathname}
                className="flex-1 flex flex-col animate-fade-in"
              >
                {children}
              </div>
            </div>
          </div>
        ) : (
          // Standard container for other tabs
          <DesktopContainer>
            <div className="flex-1 flex flex-col">
              <div
                className={`relative flex-1 ${isHowRoute && !isMobile ? 'overflow-visible' : 'overflow-hidden'} flex flex-col`}
                style={{
                  paddingTop: 'clamp(0rem, 0.3vh, 0.6rem)',
                  paddingBottom: 'clamp(6rem, 12vh, 8rem)'
                }}
              >
                {/* Content from specific page */}
                <div
                  key={pathname}
                  className="flex-1 flex flex-col animate-fade-in"
                >
                  {isContactRoute && !isMobile ? (
                    <WideContentContainer>
                      {children}
                    </WideContentContainer>
                  ) : (
                    <MediumContentContainer>
                      {children}
                    </MediumContentContainer>
                  )}
                </div>
              </div>
            </div>
          </DesktopContainer>
        )
      )}

      {/* Package Detail Overlay - Rendered directly without container */}
      {isPackageRoute && (
        <div
          key={pathname}
          className="flex-1 flex flex-col animate-fade-in"
        >
          {children}
        </div>
      )}

      {/* Footer CTA - Hidden on overlay routes */}
      {!isOverlayRoute && <FooterCTAGlass />}
    </main>
  );
};
