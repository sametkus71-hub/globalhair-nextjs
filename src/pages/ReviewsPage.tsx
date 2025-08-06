import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { ReviewsGrid } from '@/components/reviews/ReviewsGrid';
import { ReviewsTextArea } from '@/components/reviews/ReviewsTextArea';

export const ReviewsPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  // Navigate back to home
  const handleClose = () => {
    const homeRoute = language === 'nl' ? '/nl' : '/en';
    navigate(homeRoute);
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="reviews-popup-overlay">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={handleClose}
      />
      
      {/* Popup content */}
      <div className="reviews-popup-content">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
          aria-label={t('reviews.close')}
        >
          <X className="w-5 h-5 text-white" />
        </button>
        
        {/* Content split: 65% grid, 35% text */}
        <div className="h-full flex flex-col">
          {/* Reviews Grid - 65% */}
          <div className="flex-1" style={{ height: '65%' }}>
            <ReviewsGrid />
          </div>
          
          {/* Text Area - 35% */}
          <div style={{ height: '35%' }}>
            <ReviewsTextArea />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;