import { useEffect, useRef, useState } from 'react';
import { useSimpleVideo } from '@/hooks/useSimpleVideo';
import { cn } from '@/lib/utils';

interface VideoGridItemProps {
  title: string;
  gridIndex: number;
  isActive: boolean;
  onClick?: () => void;
  variation: {
    baseDarkness: number;
    patternType: string;
    contentVariation: number;
    previewCode: string;
  };
  profile: {
    geslacht: string;
    haarkleur: string;
    haartype: string;
  };
  animationKey: number;
  navigatingItem: number | null;
}

export const VideoGridItem = ({
  title,
  gridIndex,
  isActive,
  onClick,
  variation,
  profile,
  animationKey,
  navigatingItem
}: VideoGridItemProps) => {
  const { video, loading, ready, hasVideo, playVideo } = useSimpleVideo(profile);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const shouldShowVideo = hasVideo && title === "HAAR TRANSPLANTATIE" && profile.geslacht === "Man";
  
  // Mount and play video when ready
  useEffect(() => {
    if (!shouldShowVideo || !video || !ready || !containerRef.current) return;
    
    console.log('Mounting video for profile:', profile);
    
    // Style the video
    video.className = "absolute inset-0 w-full h-full object-cover";
    video.style.filter = 'brightness(0.7) contrast(1.1)';
    
    // Clear container and add video
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(video);
    
    // Play the video
    playVideo().then((success) => {
      setIsPlaying(success);
      if (success) {
        console.log('Video is now playing');
      }
    });
    
    return () => {
      if (video && containerRef.current?.contains(video)) {
        video.pause();
        setIsPlaying(false);
      }
    };
  }, [shouldShowVideo, video, ready, playVideo, profile]);
  
  // Handle visibility changes
  useEffect(() => {
    if (!video || !isPlaying) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        setIsPlaying(false);
      } else {
        playVideo().then(setIsPlaying);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [video, isPlaying, playVideo]);
  
  return (
    <div
      ref={containerRef}
      key={`${gridIndex}-${animationKey}`}
      data-grid-item={gridIndex}
      className={cn(
        "relative w-full h-full overflow-hidden transition-all duration-500 ease-out",
        isActive ? "cursor-pointer hover:scale-[1.01] group" : "cursor-not-allowed",
        "animate-fade-in"
      )}
      style={{
        // Fallback gradient background
        background: `linear-gradient(135deg, 
          hsla(${Math.round(variation.baseDarkness * 360)}, 30%, ${20 + variation.baseDarkness * 15}%, 0.9), 
          hsla(${Math.round(variation.baseDarkness * 360)}, 25%, ${15 + variation.baseDarkness * 10}%, 0.95)
        )`,
        // Bring to front during navigation
        ...(navigatingItem === gridIndex && { position: 'relative', zIndex: 50 })
      }}
      onClick={isActive ? onClick : undefined}
    >
      {/* Video loading indicator */}
      {shouldShowVideo && loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
        </div>
      )}
      
      {/* Wireframe pattern - hidden when video is playing */}
      {(!shouldShowVideo || !isPlaying) && (
        <div className="absolute inset-0 opacity-25">
          <svg className="w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
            <defs>
              <pattern id={`grid-${gridIndex}`} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${gridIndex})`} />
          </svg>
        </div>
      )}
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-white z-20">
        {/* Title with text shadow for video readability */}
        <h3 className={cn(
          "font-bold text-center leading-tight",
          "text-lg sm:text-xl md:text-2xl mb-3 tracking-wide",
          // Enhanced text shadow for video backgrounds
          shouldShowVideo && isPlaying && "drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-shadow-lg"
        )}
        style={{
          textShadow: shouldShowVideo && isPlaying 
            ? '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' 
            : undefined
        }}>
          {title}
        </h3>
        
        {/* Profile info - only show when video is not playing */}
        {!isPlaying && (
          <div className={cn(
            "text-xs sm:text-sm opacity-75 text-center mb-4 font-medium",
            shouldShowVideo && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          )}>
            {profile.geslacht} • {profile.haarkleur} • {profile.haartype}
          </div>
        )}
        
        {/* Preview code */}
        <div className={cn(
          "text-[10px] sm:text-xs opacity-50 font-mono tracking-wider",
          shouldShowVideo && isPlaying && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        )}>
          {variation.previewCode}
        </div>
      </div>
      
      {/* Hover effect overlay */}
      {isActive && (
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30" />
      )}
    </div>
  );
};