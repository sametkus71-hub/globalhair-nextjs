'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { ReviewsTabContent } from '@/components/haartransplantatie/ReviewsTabContent';

const HaartransplantatieReviewsPage = () => {
  const { language } = useLanguage();

  return (
    <ReviewsTabContent />
  );
};

export default HaartransplantatieReviewsPage;
