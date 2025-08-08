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
        {/* Close button */}
        <button
          onClick={handleBack}
          className="fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors transform hover:scale-105 active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Scrollable Content */}
        <div className="min-h-[var(--app-height)] bg-white">
          {/* Image Section - 65% of viewport height */}
          <div 
            className="w-full bg-gray-300 relative"
            style={{ height: 'calc(var(--app-height) * 0.65)' }}
          >
            {/* Clean placeholder - just the color */}
          </div>

          {/* Content Section */}
          <div className="px-6 py-8">
            {/* Name */}
            <h1 className="text-xl md:text-2xl font-bold text-black mb-2">
              Naam achternaam
            </h1>

            {/* Treatment */}
            <h2 className="text-base md:text-lg text-gray-600 mb-6">
              Behandeling
            </h2>

            {/* Description */}
            <div className="text-gray-800 text-sm md:text-base leading-relaxed">
              <p className="italic">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
            </div>

            {/* Extra spacing */}
            <div className="h-32"></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation Portal */}
      <BottomNavigationPortal />
    </>
  );
};

export default ReviewItemPage;