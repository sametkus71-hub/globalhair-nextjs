import { useEffect, useRef, useState } from 'react';
import { useSimpleVideo } from '@/hooks/useSimpleVideo';
import { cn } from '@/lib/utils';
import Hls from 'hls.js';

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
  const { videoSrc, loading, hasVideo } = useSimpleVideo(profile);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  
  const shouldShowVideo = hasVideo && title === "HAAR TRANSPLANTATIE" && profile.geslacht === "Man";
  
  // Initialize HLS when video source is available
  useEffect(() => {
    if (!shouldShowVideo || !videoSrc || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    console.log('Initializing video for profile:', profile, 'videoSrc:', videoSrc);
    
    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed, video ready');
        setVideoReady(true);
        
        // Auto-play the video
        video.play().then(() => {
          console.log('Video is now playing');
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Video play failed:', error);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        setVideoReady(false);
      });

      hls.loadSource(videoSrc);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = videoSrc;
      
      video.addEventListener('loadeddata', () => {
        console.log('Video loaded and ready to play (Safari)');
        setVideoReady(true);
        
        video.play().then(() => {
          console.log('Video is now playing');
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Video play failed:', error);
        });
      });

      video.load();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      setVideoReady(false);
      setIsPlaying(false);
    };
  }, [shouldShowVideo, videoSrc, profile]);
  
  // Handle visibility changes
  useEffect(() => {
    if (!videoRef.current || !isPlaying) return;
    
    const video = videoRef.current;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        setIsPlaying(false);
      } else {
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying]);
  
  return (
    <div
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
      {/* Video element - directly managed by React */}
      {shouldShowVideo && videoSrc && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            filter: 'brightness(0.7) contrast(1.1)',
            opacity: isPlaying ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          muted
          loop
          playsInline
          crossOrigin="anonymous"
        />
      )}
      
      {/* Video loading indicator */}
      {shouldShowVideo && (loading || !videoReady) && (
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