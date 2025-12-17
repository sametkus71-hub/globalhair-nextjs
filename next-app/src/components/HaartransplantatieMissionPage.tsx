'use client';

import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/hooks/useLanguage';
import { MissionTabContent } from '@/components/haartransplantatie/MissionTabContent';

const HaartransplantatieMissionPage = () => {
  const { language } = useLanguage();
  
  return (
    <>
      <SEOHead 
        title={language === 'nl' 
          ? 'Onze Missie - Haartransplantatie Specialisten' 
          : 'Our Mission - Hair Transplant Specialists'} 
        description={language === 'nl' 
          ? 'Ontdek de missie van GlobalHair Institute. Maak kennis met Dr. Berkant Dural en Özlem Aslan - onze haartransplantatie specialisten.' 
          : 'Discover the mission of GlobalHair Institute. Meet Dr. Berkant Dural and Özlem Aslan - our hair transplant specialists.'} 
      />
      <MissionTabContent />
    </>
  );
};

export default HaartransplantatieMissionPage;
