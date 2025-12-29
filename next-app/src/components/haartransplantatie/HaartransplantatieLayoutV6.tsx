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
import { VideoBackgroundV6 } from '@/components/haartransplantatie/VideoBackgroundV6';

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

  // Enable scrolling on mount
  useLayoutEffect(() => {
    // Disable scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Enable page scrolling
    document.body.style.overflow = '';

    // Fix: Ensure popup-open class is removed when not on a popup route
    // This fixes the missing logo issue when navigating back from method pages
    if (!isOverlayRoute && !pathname.includes('/recharge') && !pathname.includes('/rescue') && !pathname.includes('/reborn')) {
      document.body.classList.remove('popup-open');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [pathname, isOverlayRoute]);

  return (
    <main id="ht-layout-v6-main" ref={mainRef} className={`relative min-h-screen w-full bg-transparent ${isOverlayRoute ? '' : 'overflow-hidden'}`}>
      <div id="ht-layout-v6-preloader"><TabPreloader /></div>
      <div id="ht-layout-v6-video-bg"><VideoBackgroundV6 /></div>
      <div id="ht-layout-v6-container" className="relative w-full min-h-screen">
        {/* Glass Header - 500px width on desktop */}
        {!isOverlayRoute && (
          <DesktopContainer>
            <div id="ht-layout-v6-header" className="hide-when-popup">
              <GlassHeaderV6 key={pathname} />
            </div>
          </DesktopContainer>
        )}

        {/* Main Content - Single Screen with height-responsive scaling */}
        <div id="ht-layout-v6-content-wrapper" className={`relative z-10 flex flex-col h-screen ${isHowRoute && !isMobile ? 'overflow-visible' : 'overflow-hidden'}`} style={{ paddingTop: 'clamp(2rem, 8vh, 120px)' }}>
          {/* Content Flow Container */}
          <div id="ht-layout-v6-flow-container" className={`relative flex flex-col flex-1 ${isHowRoute && !isMobile ? 'overflow-visible' : 'overflow-hidden'}`} style={{ paddingTop: 'clamp(1.5rem, 2vh, 2.5rem)' }}>

            {/* Navigation Zone - 500px width on desktop */}
            <DesktopContainer>
              {/* Animated Head Hero (Button Only) - Mobile only */}
              {isMobile && (
                <div id="ht-layout-v6-mobile-hero" className="flex-shrink-0 pb-[10px]">
                  <AnimatedHeadHero />
                </div>
              )}

              {/* Tabs */}
              <div id="ht-layout-v6-tabs" className="flex-shrink-0" style={{ padding: '1.0rem 0' }}>
                <GlassTabs activeTab={activeTab} />
              </div>
            </DesktopContainer>

            {/* Content Zone - Full width for reviews on desktop, 1000px for contact, 1250px for other tabs */}
            {!isOverlayRoute && (
              isReviewsRoute && !isMobile ? (
                // Full width for reviews on desktop
                (<div id="ht-layout-v6-reviews-container" className="flex-1 flex flex-col w-full">
                  <div
                    className="relative flex-1 overflow-hidden flex flex-col"
                    style={{
                      paddingTop: 'clamp(0rem, 0.3vh, 0.6rem)',
                      paddingBottom: 'clamp(6rem, 12vh, 8rem)'
                    }}
                  >
                    {/* Content from specific page - smooth fade transition on content only */}

                    <motion.div
                      id="ht-layout-v6-reviews-motion"
                      key={pathname}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="relative flex-1 overflow-hidden"
                    >
                      {children}
                    </motion.div>
                  </div>
                </div>)
              ) : isContactRoute && !isMobile ? (
                // 1000px container for contact on desktop
                (<MediumContentContainer className="flex-1 flex flex-col">
                  <div
                    id="ht-layout-v6-contact-container"
                    className={`relative flex-1 ${isHowRoute && !isMobile ? 'overflow-visible' : 'overflow-hidden'} flex flex-col`}
                    style={{
                      paddingTop: 'clamp(0rem, 0.3vh, 0.6rem)',
                      paddingBottom: 'clamp(6rem, 12vh, 8rem)'
                    }}
                  >
                    {/* Content from specific page - smooth fade transition on content only */}
                    {/* Content from specific page - smooth fade transition on content only */}
                    <motion.div
                      id="ht-layout-v6-contact-motion"
                      key={pathname}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`relative flex-1 ${isHowRoute && !isMobile ? 'overflow-visible' : 'overflow-hidden'}`}
                    >
                      {children}
                    </motion.div>
                  </div>
                </MediumContentContainer>)
              ) : (
                // Standard 1250px container for other tabs
                (<WideContentContainer className="flex-1 flex flex-col">
                  <div
                    id="ht-layout-v6-wide-container"
                    className={`relative flex-1 ${isHowRoute && !isMobile ? 'overflow-visible' : 'overflow-hidden'} flex flex-col`}
                    style={{
                      paddingTop: 'clamp(0rem, 0.3vh, 0.6rem)',
                      paddingBottom: isMobile
                        ? 'clamp(4rem, 10vh, 6rem)' // Original mobile spacing
                        : 'clamp(6rem, 12vh, 8rem)' // Desktop: more space from footer
                    }}
                  >
                    {/* Content from specific page - smooth fade transition on content only */}
                    {/* Content from specific page - smooth fade transition on content only */}
                    <motion.div
                      id="ht-layout-v6-wide-motion"
                      key={pathname}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`relative flex-1 ${isHowRoute && !isMobile ? 'overflow-visible' : 'overflow-hidden'}`}
                    >
                      {children}
                    </motion.div>
                  </div>
                </WideContentContainer>)
              )
            )}
          </div>
        </div>

        {/* Footer CTA - 500px width on desktop */}
        <DesktopContainer>
          <div id="ht-layout-v6-footer">
            <FooterCTAGlass />
          </div>
        </DesktopContainer>
      </div>
      {/* Package/Booking popup overlay - renders on top when route is active */}
      {isOverlayRoute && <div id="ht-layout-v6-overlay">{children}</div>}
    </main>
  );
};
