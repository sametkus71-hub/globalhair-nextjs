'use client';

import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/hooks/useLanguage';
import { ReviewsTabContent } from '@/components/haartransplantatie/ReviewsTabContent';

const HaartransplantatieReviewsPage = () => {
  const { language } = useLanguage();
  
  return (
    <>
      <SEOHead 
        title={language === 'nl' 
          ? 'Haartransplantatie Reviews & Ervaringen' 
          : 'Hair Transplant Reviews & Experiences'} 
        description={language === 'nl' 
          ? 'Bekijk echte ervaringen en reviews van klanten die een haartransplantatie bij GlobalHair Institute hebben gehad.' 
          : 'See real experiences and reviews from clients who had a hair transplant at GlobalHair Institute.'} 
      />
      <ReviewsTabContent />
    </>
  );
};

export default HaartransplantatieReviewsPage;
