import { useLayoutEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { MetaHead } from '@/components/MetaHead';
import { PageTransition } from '@/components/PageTransition';
import { DesktopContainer } from '@/components/layout/DesktopContainer';
import { GlassBackground } from '@/components/haartransplantatie/GlassBackground';
import { GlassHeader } from '@/components/haartransplantatie/GlassHeader';
import { AnimatedHeadHero } from '@/components/haartransplantatie/AnimatedHeadHero';
import { GlassTabs } from '@/components/haartransplantatie/GlassTabs';
import { PackageTierSwitcher } from '@/components/haartransplantatie/PackageTierSwitcher';
import { PackageCardGlass } from '@/components/haartransplantatie/PackageCardGlass';
import { ReviewsSectionGlass } from '@/components/haartransplantatie/ReviewsSectionGlass';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';
import { PlaceholderContent } from '@/components/haartransplantatie/PlaceholderContent';


const HaartransplantatiePage = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('Packages');
  const [activePackage, setActivePackage] = useState<'Standard' | 'Premium' | 'Advanced'>('Standard');

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
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <MetaHead language={language} page="haartransplantatie" />
      <DesktopContainer>
        <PageTransition isNewPage={true}>
          {/* Glassmorphic Background */}
          <GlassBackground />
          
          {/* Glass Header */}
          <GlassHeader />

          {/* Main Content - Scrollable */}
          <div className="relative z-10 pt-16 pb-32 overflow-y-auto" style={{ minHeight: '100vh' }}>
            {/* Animated Head Hero */}
            <AnimatedHeadHero />

            {/* Tabs */}
            <GlassTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div className="relative">
              {activeTab === 'Packages' && (
                <div>
                  {/* Package Tier Switcher */}
                  <PackageTierSwitcher 
                    activePackage={activePackage} 
                    onPackageChange={(pkg) => setActivePackage(pkg as 'Standard' | 'Premium' | 'Advanced')} 
                  />

                  {/* Package Card */}
                  <PackageCardGlass package={activePackage} />
                </div>
              )}

              {activeTab === 'Traject' && <PlaceholderContent type="Traject" />}
              {activeTab === 'Mission' && <PlaceholderContent type="Mission" />}
              {activeTab === 'Contact' && <PlaceholderContent type="Contact" />}
            </div>

            {/* Reviews Section */}
            <ReviewsSectionGlass />
          </div>

          {/* Footer CTA (replaces bottom nav) */}
          <FooterCTAGlass />
        </PageTransition>
      </DesktopContainer>
    </>
  );
};

export default HaartransplantatiePage;