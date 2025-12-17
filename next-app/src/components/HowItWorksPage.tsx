'use client';

import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/hooks/useLanguage';
import { HowTabContent } from '@/components/haartransplantatie/HowTabContent';
import { HowTabContentDesktop } from '@/components/haartransplantatie/HowTabContentDesktop';
import { useIsMobile } from '@/hooks/use-mobile';

const HowItWorksPage = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <>
      <SEOHead 
        title={language === 'nl' 
          ? 'Hoe Werkt Een Haartransplantatie - Het Proces' 
          : 'How Does Hair Transplant Work - The Process'} 
        description={language === 'nl' 
          ? 'Ontdek hoe een haartransplantatie werkt bij GlobalHair Institute. Van voorbereiding tot nazorg - bekijk het volledige behandelproces.' 
          : 'Discover how a hair transplant works at GlobalHair Institute. From preparation to aftercare - see the complete treatment process.'} 
      />
      {isMobile ? <HowTabContent /> : <HowTabContentDesktop />}
    </>
  );
};

export default HowItWorksPage;
