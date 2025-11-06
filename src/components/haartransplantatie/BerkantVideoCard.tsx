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
    <div className="w-full h-full flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-md h-full cursor-pointer group silver-grey-gradient-border"
        onClick={handleClick}
      >
        {/* Video container with gradient border */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden transition-all duration-300">
          {/* Video */}
          <video
            src={video.subbedUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay - darker at bottom, transparent at top */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
          
          {/* Top left - Name badge */}
          <div className="absolute top-4 left-4">
            <div className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20">
              <span className="text-sm font-medium text-white">Berkant Dural</span>
            </div>
          </div>
          
          {/* Top right - Mute icon */}
          <div className="absolute top-4 right-4">
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
          
          {/* Bottom info badges */}
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 px-4">
            <div className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20">
              <span className="text-sm text-white">CEO - GlobalHair Institute</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20">
              <span className="text-sm text-white">Developed 6+ methods</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20">
              <span className="text-sm text-white">Opened 3 locations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
