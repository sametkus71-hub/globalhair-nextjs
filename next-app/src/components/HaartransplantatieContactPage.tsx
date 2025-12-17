'use client';

import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/hooks/useLanguage';
import { ContactTabContent } from '@/components/haartransplantatie/ContactTabContent';

const HaartransplantatieContactPage = () => {
  const { language } = useLanguage();
  
  return (
    <>
      <SEOHead 
        title={language === 'nl' 
          ? 'Contact Haartransplantatie Kliniek - Locaties' 
          : 'Contact Hair Transplant Clinic - Locations'} 
        description={language === 'nl' 
          ? 'Neem contact op met GlobalHair Institute. Bezoek onze klinieken in Barendrecht, Leiden of İstanbul voor uw haartransplantatie.' 
          : 'Contact GlobalHair Institute. Visit our clinics in Barendrecht, Leiden or Istanbul for your hair transplant.'} 
      />
      <ContactTabContent />
    </>
  );
};

export default HaartransplantatieContactPage;
