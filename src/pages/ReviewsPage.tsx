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
        
        {/* Top gradient overlay */}
        <div 
          className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-40"
          style={{
            background: 'linear-gradient(180deg, #040E15 0%, transparent 100%)'
          }}
        />
        
        {/* Full screen Instagram-style grid - horizontal scrolling */}
        <div
          className="w-full h-full overflow-x-auto overflow-y-hidden pl-4 pr-4 md:pl-8 md:pr-8 flex items-center"
          style={{ 
            WebkitOverflowScrolling: 'touch', 
            overscrollBehavior: 'contain',
            overflowX: 'scroll',
            overflowY: 'hidden'
          }}
        >
          <ReviewsGrid />
        </div>
      </div>
      <FooterCTAGlass />
    </>
  );
};

export default ReviewsPage;