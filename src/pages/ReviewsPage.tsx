import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { ReviewsGrid } from '@/components/reviews/ReviewsGrid';
import { ReviewsTextArea } from '@/components/reviews/ReviewsTextArea';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';

export const ReviewsPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [isExiting, setIsExiting] = useState(false);

  // Navigate back to previous page
  const handleClose = () => {
    setIsExiting(true);
    // Wait for animation to complete before navigating
    setTimeout(() => {
      navigate(-1); // Go back to previous page
    }, 300);
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      <div className={`reviews-page-fullscreen ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors transform hover:scale-105 active:scale-95"
          aria-label={t('reviews.close')}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Content split: 75% grid, 25% text */}
        <div className="h-full flex flex-col">
          {/* Reviews Grid - 75% */}
          <div className="flex-1" style={{ height: '75%' }}>
            <ReviewsGrid />
          </div>
          
          {/* Text Area - 25% */}
          <div style={{ height: '25%' }}>
            <ReviewsTextArea />
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation Portal */}
      <BottomNavigationPortal />
    </>
  );
};

export default ReviewsPage;