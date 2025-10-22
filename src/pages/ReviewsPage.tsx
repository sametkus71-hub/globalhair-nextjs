import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { ReviewsGrid } from '@/components/reviews/ReviewsGrid';
import { ReviewsTextArea } from '@/components/reviews/ReviewsTextArea';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';

export const ReviewsPage = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [isExiting, setIsExiting] = useState(false);
  const { handlePopupClose } = usePopupClose();

  // Navigate back to appropriate page
  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(350);
  };

  return (
    <>
      <div
        className={`reviews-page-fullscreen ${isExiting ? 'reviews-page-exit' : ''}`}
        style={{
          background: 'linear-gradient(180deg, #040E15 0%, #333D46 100%)',
          overflow: 'hidden',
          position: 'fixed',
          inset: 0,
          zIndex: 30
        }}
      >
        {/* Close button */}
        <PopupCloseButton onClose={handleClose} />
        
        {/* Full screen Instagram-style grid */}
        <div 
          className="h-full overflow-y-auto pb-20"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
        >
          <ReviewsGrid />
        </div>
      </div>
      <FooterCTAGlass />
    </>
  );
};

export default ReviewsPage;