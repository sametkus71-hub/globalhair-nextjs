import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';

export const ReviewItemPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Navigate back to reviews
  const handleBack = () => {
    const reviewsRoute = language === 'nl' ? '/nl/reviews' : '/en/reviews';
    navigate(reviewsRoute);
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
      <div className="review-item-page-fullscreen">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Content */}
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">
              Review Item 1
            </h1>
            <p className="text-gray-600 text-lg">
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