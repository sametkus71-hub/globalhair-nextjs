import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useSlideTransition } from '@/hooks/useSlideTransition';
import { ArrowLeft } from 'lucide-react';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';
import { BEFORE_AFTER_ITEMS } from '@/data/reviewsBeforeAfter';
import { VIDEOS } from '@/data/reviewsVideos';

export const ReviewItemPage = () => {
  const { language } = useLanguage();
  const { slideBackToReviews } = useSlideTransition();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [isExiting, setIsExiting] = useState(false);
  
  // Determine content type and find item
  const isVideo = slug?.startsWith('video-');
  const item = isVideo 
    ? VIDEOS.find(v => v.id === slug?.replace('video-', ''))
    : BEFORE_AFTER_ITEMS.find(item => item.slug === slug);

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

  // Redirect if item not found
  useEffect(() => {
    if (!item) {
      const reviewsRoute = language === 'nl' ? '/nl/reviews' : '/en/reviews';
      navigate(reviewsRoute, { replace: true });
    }
  }, [item, language, navigate]);

  if (!item) return null;

  return (
    <>
      <div className={`review-item-page-fullscreen ${isExiting ? 'slide-exit-right' : 'slide-enter-left'}`}>
        {/* Back button */}
        <button
          onClick={handleBack}
          className="fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors transform hover:scale-105 active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        {isVideo && 'videoUrl' in item ? (
          // Video full screen view
          <div className="w-full h-[var(--app-height)] bg-black flex items-center justify-center">
            <video
              src={item.videoUrl}
              controls
              autoPlay
              className="max-w-full max-h-full"
              poster={item.thumbnail}
            />
          </div>
        ) : !isVideo && 'beforeImage' in item ? (
          // Before/after item view
          <div className="min-h-[var(--app-height)] bg-white">
            {/* Before/After Images Section - 65% of viewport height */}
            <div 
              className="w-full relative"
              style={{ height: 'calc(var(--app-height) * 0.65)' }}
            >
              <div className="grid grid-cols-2 h-full">
                <div className="relative">
                  <img
                    src={item.beforeImage}
                    alt={`${item.patientName} - Before ${item.treatmentType}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                    Before
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={item.afterImage}
                    alt={`${item.patientName} - After ${item.treatmentType}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                    After
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-6 py-8">
              {/* Name */}
              <h1 className="text-xl md:text-2xl font-bold text-black mb-2">
                {item.patientName}
              </h1>

              {/* Treatment */}
              <h2 className="text-base md:text-lg text-gray-600 mb-6">
                {item.treatmentType}
              </h2>

              {/* Description */}
              <div className="text-gray-800 text-sm md:text-base leading-relaxed mb-6">
                <p className="italic">
                  {item.content.description}
                </p>
              </div>

              {/* Treatment Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Treatment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Procedure:</span>
                    <p className="text-gray-800">{item.content.treatmentDetails.procedure}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Duration:</span>
                    <p className="text-gray-800">{item.content.treatmentDetails.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Recovery:</span>
                    <p className="text-gray-800">{item.content.treatmentDetails.recovery}</p>
                  </div>
                  {item.content.treatmentDetails.grafts && (
                    <div>
                      <span className="font-medium text-gray-600">Grafts:</span>
                      <p className="text-gray-800">{item.content.treatmentDetails.grafts}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-2">Results</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {item.content.results}
                </p>
              </div>

              {/* Extra spacing for bottom navigation */}
              <div className="h-32"></div>
            </div>
          </div>
        ) : null}
      </div>
      
      <BottomNavigationPortal />
    </>
  );
};

export default ReviewItemPage;