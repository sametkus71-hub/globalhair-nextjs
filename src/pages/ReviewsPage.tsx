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
      {/* Top gradient bar */}
      <div
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          paddingTop: 'clamp(0.5rem, 1vh, 1rem)',
          height: 'clamp(80px, 12vh, 120px)',
          background: 'linear-gradient(180deg, rgba(4, 14, 21, 0.9) 0%, rgba(4, 14, 21, 0) 100%)',
          pointerEvents: 'none',
        }}
      />
      
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
          className="h-full overflow-y-auto"
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