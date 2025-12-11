import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useSlideTransition } from '@/hooks/useSlideTransition';
import { ArrowLeft } from 'lucide-react';
import { VIDEOS } from '@/data/reviewsVideos';
import { MetaHead } from '@/components/MetaHead';

export const ReviewItemPage = () => {
  const { language } = useLanguage();
  const { slideBackToReviews } = useSlideTransition();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [isExiting, setIsExiting] = useState(false);
  
  // Only handle video items (before/after items are no longer clickable)
  const isVideo = slug?.startsWith('video-');
  const item = isVideo ? VIDEOS.find(v => v.id === slug?.replace('video-', '')) : null;
  
  // Redirect to reviews if not a video or item not found
  useEffect(() => {
    if (!isVideo || !item) {
      const reviewsRoute = language === 'nl' ? '/nl/reviews' : '/en/reviews';
      navigate(reviewsRoute, { replace: true });
    }
  }, [isVideo, item, language, navigate]);

  // Handle back navigation
  const handleBack = () => {
    setIsExiting(true);
    const reviewsRoute = language === 'nl' ? '/nl/reviews' : '/en/reviews';
    setTimeout(() => {
      slideBackToReviews(reviewsRoute);
    }, 100);
  };

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  if (!item) return null;

  return (
    <>
      <MetaHead language={language} page="review-item" />
      <div className={`review-item-page-fullscreen ${isExiting ? 'slide-exit-right' : 'slide-enter-left'}`}>
        {/* Clean back button */}
        <button
          onClick={handleBack}
          className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-all duration-200"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Video full screen view */}
        <div className="w-full h-[var(--app-height)] bg-black flex items-center justify-center pb-20">
          <video
            src={item.videoUrl}
            autoPlay
            loop
            muted={false}
            playsInline
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </>
  );
};

export default ReviewItemPage;