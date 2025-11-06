import { useNavigate } from 'react-router-dom';
import { BERKANT_VIDEOS } from '@/data/berkantVideos';
import { useLanguage } from '@/hooks/useLanguage';

interface BerkantVideoCardProps {
  videoId?: string;
}

export const BerkantVideoCard = ({ videoId = 'berkant-1' }: BerkantVideoCardProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const video = BERKANT_VIDEOS.find(v => v.id === videoId) || BERKANT_VIDEOS[0];

  const handleClick = () => {
    navigate(`/${language}/mission?video=${video.id}`);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
      <div 
        className="relative w-full max-w-5xl cursor-pointer group"
        onClick={handleClick}
        style={{ aspectRatio: '16/9' }}
      >
        {/* Glass morphism container */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/20 backdrop-blur-sm bg-white/5 shadow-2xl transition-all duration-300 group-hover:border-white/30 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]">
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
          
          {/* Gradient overlays for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
          
          {/* Top overlay - Name and title */}
          <div className="absolute top-0 left-0 right-0 p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  Berkant Dural
                </h2>
                <p className="text-sm sm:text-base text-white/80">
                  CEO & Founder - GlobalHair
                </p>
              </div>
              
              {/* Muted indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
                <svg 
                  className="w-4 h-4 text-white/80" 
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
                <span className="text-xs text-white/80">CC</span>
              </div>
            </div>
          </div>
          
          {/* Center play hint overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-white ml-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          
          {/* Bottom overlay - Description */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="text-sm sm:text-base text-white/90 max-w-2xl">
              {video.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
