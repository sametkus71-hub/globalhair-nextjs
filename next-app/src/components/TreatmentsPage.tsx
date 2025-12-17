'use client';

import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/hooks/useLanguage';
import { TreatmentsTabContent } from '@/components/haartransplantatie/TreatmentsTabContent';

const TreatmentsPage = () => {
  const { language } = useLanguage();
  
  return (
    <>
      <SEOHead 
        title={language === 'nl' 
          ? 'Haartransplantatie Behandelingen - FUE Methode' 
          : 'Hair Transplant Treatments - FUE Method'} 
        description={language === 'nl' 
          ? 'Bekijk onze haartransplantatie behandelingen. Premium FUE haartransplantatie in Nederland en Turkije met V6 Hairboost® technologie.' 
          : 'View our hair transplant treatments. Premium FUE hair transplant in Netherlands and Turkey with V6 Hairboost® technology.'} 
      />
      <TreatmentsTabContent />
    </>
  );
};

export default TreatmentsPage;
