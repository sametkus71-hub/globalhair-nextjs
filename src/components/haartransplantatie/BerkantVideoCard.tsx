import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { BERKANT_VIDEOS } from '@/data/berkantVideos';
import { useLanguage } from '@/hooks/useLanguage';

interface BerkantVideoCardProps {
  videoId?: string;
}

export const BerkantVideoCard = ({ videoId }: BerkantVideoCardProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  // Random video selection on each load
  const video = useMemo(() => {
    if (videoId) {
      return BERKANT_VIDEOS.find(v => v.id === videoId) || BERKANT_VIDEOS[0];
    }
    const randomIndex = Math.floor(Math.random() * BERKANT_VIDEOS.length);
    return BERKANT_VIDEOS[randomIndex];
  }, [videoId]);

  const handleClick = () => {
    navigate(`/${language}/mission?video=${video.id}`);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
      <div 
        className="relative w-full max-w-sm h-full cursor-pointer group"
        onClick={handleClick}
      >
        {/* Video container with gradient border */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden silver-grey-gradient-border transition-all duration-300">
          {/* Video */}
          <video
            src={video.subbedUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 1 }}
          />
          
          {/* Gradient overlay - darker at bottom, transparent at top */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"
            style={{ zIndex: 2 }}
          />
          
          {/* Top left - Name badge */}
          <div className="absolute top-4 left-4" style={{ zIndex: 3 }}>
            <div className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20">
              <span className="text-sm font-medium text-white">Berkant Dural</span>
            </div>
          </div>
          
          {/* Top right - Mute icon */}
          <div className="absolute top-4 right-4" style={{ zIndex: 3 }}>
            <svg 
              className="w-6 h-6 text-white/80" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" 
              />
            </svg>
          </div>
        </div>
      </div>
      <style>{`
        .silver-grey-gradient-border {
          position: relative;
        }

        .silver-grey-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .silver-grey-gradient-border > * {
          position: relative;
          z-index: 1;
        }

      `}</style>
    </div>
  );
};
