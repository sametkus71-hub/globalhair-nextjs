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
      <article 
        className="berkant-card"
        onClick={handleClick}
      >
        {/* Video background */}
        <video
          src={video.subbedUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="berkant-card-bg"
          style={{ 
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        />
        
        {/* Gradient overlay */}
        <div className="berkant-card-overlay" />
        
        {/* Content on top */}
        <div className="berkant-card-content">
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
        </div>
      </article>
      <style>{`
        .berkant-card {
          position: relative;
          width: 100%;
          max-width: 28rem;
          height: 100%;
          border-radius: 1rem;
          overflow: hidden;
          cursor: pointer;
          backdrop-filter: blur(10px);
          background: rgba(0,0,0,.15);
        }

        .berkant-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 1.8px;
          background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 3;
        }

        .berkant-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2), transparent);
          pointer-events: none;
          z-index: 1;
        }

        .berkant-card-content {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};
