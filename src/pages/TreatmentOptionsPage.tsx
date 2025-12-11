import { useLayoutEffect, useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { SEOHead } from '@/components/SEOHead';
import { PageTransition } from '@/components/PageTransition';
import { DesktopContainer } from '@/components/layout/DesktopContainer';
import { PackageLocationSelector } from '@/components/haartransplantatie/PackageLocationSelector';
import { PackageDetailContent } from '@/components/haartransplantatie/PackageDetailContent';

const TreatmentOptionsPage = () => {
  const { language } = useLanguage();
  const { height } = useViewportHeight();
  const [phoneSize, setPhoneSize] = useState<'small' | 'large'>('small');
  
  // Check if user comes from hair transplant page
  const isFromTransplantPage = () => {
    const referrer = document.referrer;
    return referrer.includes('/haartransplantatie') || referrer.includes('/hair-transplant');
  };
  
  const [comesFromTransplant] = useState(() => isFromTransplantPage());

  // Phone size detection for responsive design
  useEffect(() => {
    const detectPhoneSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width <= 480 && height > width) {
        if (width <= 390) {
          setPhoneSize('small');
        } else {
          setPhoneSize('large');
        }
      } else {
        setPhoneSize('large');
      }
    };

    detectPhoneSize();
    window.addEventListener('resize', detectPhoneSize);
    return () => window.removeEventListener('resize', detectPhoneSize);
  }, []);

  // Disable scrolling on mount
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const pageName = language === 'nl' ? 'behandelopties' : 'treatment-options';

  return (
    <>
      <SEOHead 
        title={language === 'nl' ? 'Behandelopties - Haartransplantatie Pakketten' : 'Treatment Options - Hair Transplant Packages'}
        description={language === 'nl' ? 'Ontdek gedetailleerde informatie over onze haartransplantatie pakketten en kies de beste behandeling voor u.' : 'Discover detailed information about our hair transplant packages and choose the best treatment for you.'}
      />
      <DesktopContainer>
        <PageTransition isNewPage={true}>
          {/* Main Content Section */}
          <section 
            className="w-full relative overflow-hidden flex flex-col"
            style={{ 
              height: 'var(--app-height)'
            }}
          >
            {/* Header Section */}
            <div className="relative z-20 flex-shrink-0 pt-8 pb-4">
              <div className="text-center">
                <h1 className="font-lato text-[28px] font-normal text-white mb-2 uppercase">
                  {language === 'nl' ? 'BEHANDELOPTIES' : 'TREATMENT OPTIONS'}
                </h1>
                <p className="font-lato text-[14px] font-normal text-white/80">
                  {language === 'nl' ? 'Kies het perfecte pakket voor uw situatie' : 'Choose the perfect package for your situation'}
                </p>
              </div>
            </div>

            {/* Package & Location Selector */}
            <div className="relative z-20 flex-shrink-0">
              <PackageLocationSelector />
            </div>

            {/* Detailed Package Content */}
            <div className="relative z-20 flex-1 overflow-y-auto">
              <PackageDetailContent />
            </div>
          </section>
        </PageTransition>
      </DesktopContainer>
    </>
  );
};

export default TreatmentOptionsPage;