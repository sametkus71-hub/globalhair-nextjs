import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { BERKANT_VIDEOS } from '@/data/berkantVideos';
import { useLanguage } from '@/hooks/useLanguage';

const BerkantDuralPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('video');

  // Find the video or default to first one
  const video = BERKANT_VIDEOS.find(v => v.id === videoId) || BERKANT_VIDEOS[0];

  const handleClose = () => {
    navigate(`/${language}/haartransplantatie/mission`);
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-fade-in">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-200"
        aria-label="Close video"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Video with grow animation */}
      <div className="w-full h-full flex items-center justify-center animate-grow-fullscreen">
        <video
          key={video.id}
          src={video.unsubbedUrl}
          autoPlay
          loop
          playsInline
          className="w-full h-full object-contain"
          style={{ maxHeight: '100vh' }}
        />
      </div>

      <style>{`
        @keyframes grow-fullscreen {
          0% {
            transform: scale(0.75);
            opacity: 0.9;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-grow-fullscreen {
          animation: grow-fullscreen 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default BerkantDuralPage;
