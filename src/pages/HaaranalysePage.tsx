import { useLayoutEffect, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { SEOHead } from '@/components/SEOHead';
import { PageTransition } from '@/components/PageTransition';
import { DesktopContainer } from '@/components/layout/DesktopContainer';
import { GlassHeader } from '@/components/haartransplantatie/GlassHeader';

const HaaranalysePage = () => {
  const { language } = useLanguage();
  const location = useLocation();

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
      <SEOHead 
        title={language === 'nl' ? 'GHI Haaranalyse' : 'GHI Hair Analysis'}
        description={language === 'nl' 
          ? 'Analyseer je haar met onze geavanceerde technologie bij GlobalHair Institute.' 
          : 'Analyze your hair with our advanced technology at GlobalHair Institute.'}
      />
      <DesktopContainer>
        <PageTransition isNewPage={true}>
          {/* Glass Header */}
          <GlassHeader />

          {/* Main Content */}
          <div className="relative z-10 flex flex-col min-h-screen pt-16 px-4">
            <div className="flex-1 py-8">
              <div className="text-center mb-8">
                <h1 
                  className="text-4xl font-bold text-white mb-4"
                  style={{ fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif' }}
                >
                  {language === 'nl' ? 'GHI Haaranalyse' : 'GHI Hair Analysis'}
                </h1>
                <p 
                  className="text-white/80 text-lg"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {language === 'nl' 
                    ? 'Ontdek de toestand van je haar met onze geavanceerde analyse' 
                    : 'Discover the condition of your hair with our advanced analysis'}
                </p>
              </div>

              {/* Content area - to be designed */}
              <div 
                className="rounded-3xl p-8 text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <p 
                  className="text-white/60 text-base"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {language === 'nl' 
                    ? 'Pagina inhoud wordt binnenkort toegevoegd...' 
                    : 'Page content coming soon...'}
                </p>
              </div>
            </div>
          </div>
        </PageTransition>
      </DesktopContainer>
    </>
  );
};

export default HaaranalysePage;
