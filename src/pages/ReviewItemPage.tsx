import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSlideTransition } from '@/hooks/useSlideTransition';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';

export const ReviewItemPage = () => {
  const { language } = useLanguage();
  const { slideBackToReviews } = useSlideTransition();
  const [isExiting, setIsExiting] = useState(false);

  // Navigate back to reviews with slide animation
  const handleBack = () => {
    setIsExiting(true);
    const reviewsRoute = language === 'nl' ? '/nl/reviews' : '/en/reviews';
    // Wait for animation to complete before navigating
    setTimeout(() => {
      slideBackToReviews(reviewsRoute);
    }, 100);
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      <div className={`review-item-page-fullscreen ${isExiting ? 'slide-exit-right' : 'slide-enter-left'}`}>
        {/* Back button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors transform hover:scale-105 active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Content */}
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4">
              Review Item 1
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
              This is the review detail page for item 1.
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation Portal */}
      <BottomNavigationPortal />
    </>
  );
};

export default ReviewItemPage;