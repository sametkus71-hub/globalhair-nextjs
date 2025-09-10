import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { ReviewsGrid } from '@/components/reviews/ReviewsGrid';
import { ReviewsTextArea } from '@/components/reviews/ReviewsTextArea';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';

export const ReviewsPage = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [isExiting, setIsExiting] = useState(false);
  const { handlePopupClose } = usePopupClose();

  // Navigate back to appropriate page
  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(300);
  };

  return (
    <>
      <div className={`reviews-page-fullscreen ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Close button */}
        <PopupCloseButton onClose={handleClose} />
        
        {/* Full screen Instagram-style grid */}
        <div className="h-full">
          <ReviewsGrid />
        </div>
      </div>
      <BottomNavigationPortal />
    </>
  );
};

export default ReviewsPage;