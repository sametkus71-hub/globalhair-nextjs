import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { ReviewsGrid } from '@/components/reviews/ReviewsGrid';
import { ReviewsTextArea } from '@/components/reviews/ReviewsTextArea';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { FooterCTAGlass } from '@/components/haartransplantatie/FooterCTAGlass';
import { SEOHead } from '@/components/SEOHead';

export const ReviewsPage = () => {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [isExiting, setIsExiting] = useState(false);
  const { handlePopupClose } = usePopupClose();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Cleanup all videos when leaving the reviews page
  useEffect(() => {
    return () => {
      if (scrollContainerRef.current) {
        const videos = scrollContainerRef.current.querySelectorAll('video');
        videos.forEach(video => {
          video.pause();
          video.removeAttribute('src');
          video.load();
          video.src = ''; // Force garbage collection hint
        });
      }
    };
  }, []);

  // Navigate back to appropriate page
  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(350);
  };

  return (
    <>
      <SEOHead 
        title={language === 'nl' ? 'Ervaringen & Reviews' : 'Experiences & Reviews'} 
        description={language === 'nl' ? 'Bekijk de ervaringen van onze klanten met haartransplantatie bij GlobalHair Institute.' : 'View our clients experiences with hair transplantation at GlobalHair Institute.'} 
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
        
        {/* Top gradient overlay */}
        <div 
          className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-40"
          style={{
            background: 'linear-gradient(180deg, #040E15 0%, transparent 100%)'
          }}
        />
        
        {/* Full screen Instagram-style grid - horizontal scrolling */}
        <div
          ref={scrollContainerRef}
          data-scroll-container="reviews"
          className="reviews-scrollbar w-full h-full overflow-x-auto overflow-y-hidden pl-4 pr-4 md:pl-8 md:pr-8 flex items-center"
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
      
      {/* Desktop-only custom scrollbar */}
      <style>{`
        @media (min-width: 768px) {
          .reviews-scrollbar::-webkit-scrollbar {
            height: 6px;
          }

          .reviews-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
          }

          .reviews-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }

          .reviews-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.35);
          }

          /* Firefox */
          .reviews-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
          }
        }
      `}</style>
      
      <FooterCTAGlass />
    </>
  );
};

export default ReviewsPage;