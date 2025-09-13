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
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const currentHlsRef = useRef<Hls | null>(null);
  const nextHlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string | null>(null);
  const [nextVideoSrc, setNextVideoSrc] = useState<string | null>(null);
  const [showNext, setShowNext] = useState(false);
  
  const shouldShowVideo = hasVideo && title === "HAAR TRANSPLANTATIE" && profile.geslacht === "Man";

  // Helper function to setup HLS for a video element
  const setupHLS = (video: HTMLVideoElement, src: string, hlsRef: React.MutableRefObject<Hls | null>, onReady: () => void) => {
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed, video ready');
        onReady();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
      });

      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = src;
      
      video.addEventListener('loadeddata', () => {
        console.log('Video loaded and ready to play (Safari)');
        onReady();
      });

      video.load();
    }
  };

  // Handle video source changes with crossfade transition
  useEffect(() => {
    if (!shouldShowVideo || !videoSrc) {
      // Reset everything if no video should be shown
      setCurrentVideoSrc(null);
      setNextVideoSrc(null);
      setIsPlaying(false);
      setVideoReady(false);
      return;
    }

    // If this is the first video or no current video
    if (!currentVideoSrc) {
      setCurrentVideoSrc(videoSrc);
      return;
    }

    // If video source changed, start crossfade transition
    if (videoSrc !== currentVideoSrc && !isTransitioning) {
      console.log('Starting crossfade transition from', currentVideoSrc, 'to', videoSrc);
      setIsTransitioning(true);
      setNextVideoSrc(videoSrc);
    }
  }, [shouldShowVideo, videoSrc, currentVideoSrc, isTransitioning]);

  // Initialize current video
  useEffect(() => {
    if (!shouldShowVideo || !currentVideoSrc || !currentVideoRef.current) {
      return;
    }

    const video = currentVideoRef.current;
    console.log('Initializing current video:', currentVideoSrc);
    
    // Clean up previous HLS instance
    if (currentHlsRef.current) {
      currentHlsRef.current.destroy();
      currentHlsRef.current = null;
    }

    setupHLS(video, currentVideoSrc, currentHlsRef, () => {
      setVideoReady(true);
      
      // Auto-play the video
      video.play().then(() => {
        console.log('Current video is now playing');
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Current video play failed:', error);
      });
    });

    return () => {
      if (currentHlsRef.current) {
        currentHlsRef.current.destroy();
        currentHlsRef.current = null;
      }
    };
  }, [shouldShowVideo, currentVideoSrc]);

  // Initialize next video for crossfade
  useEffect(() => {
    if (!shouldShowVideo || !nextVideoSrc || !nextVideoRef.current || !isTransitioning) {
      return;
    }

    const video = nextVideoRef.current;
    console.log('Initializing next video for crossfade:', nextVideoSrc);
    
    // Clean up previous HLS instance
    if (nextHlsRef.current) {
      nextHlsRef.current.destroy();
      nextHlsRef.current = null;
    }

    setupHLS(video, nextVideoSrc, nextHlsRef, () => {
      // Start crossfade when next video is ready
      video.play().then(() => {
        console.log('Next video loaded, starting crossfade');
        setShowNext(true);
        
        // Complete transition after animation
        setTimeout(() => {
          setCurrentVideoSrc(nextVideoSrc);
          setNextVideoSrc(null);
          setIsTransitioning(false);
          setShowNext(false);
          
          // Clean up current video HLS
          if (currentHlsRef.current) {
            currentHlsRef.current.destroy();
            currentHlsRef.current = null;
          }
        }, 800); // Match transition duration
      }).catch((error) => {
        console.error('Next video play failed:', error);
        setIsTransitioning(false);
        setNextVideoSrc(null);
      });
    });

    return () => {
      if (nextHlsRef.current) {
        nextHlsRef.current.destroy();
        nextHlsRef.current = null;
      }
    };
  }, [shouldShowVideo, nextVideoSrc, isTransitioning]);
  
  // Handle visibility changes
  useEffect(() => {
    if (!currentVideoRef.current || !isPlaying) return;
    
    const video = currentVideoRef.current;
    
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
      {/* Current Video */}
      {shouldShowVideo && currentVideoSrc && (
        <video
          ref={currentVideoRef}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-out"
          style={{ 
            filter: 'brightness(0.7) contrast(1.1)',
            opacity: isPlaying && !showNext ? 1 : 0,
            transform: showNext ? 'scale(1.05)' : 'scale(1)',
            zIndex: showNext ? 1 : 2
          }}
          muted
          loop
          playsInline
          crossOrigin="anonymous"
        />
      )}

      {/* Next Video - for crossfade transition */}
      {shouldShowVideo && nextVideoSrc && isTransitioning && (
        <video
          ref={nextVideoRef}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-out"
          style={{ 
            filter: 'brightness(0.7) contrast(1.1)',
            opacity: showNext ? 1 : 0,
            transform: showNext ? 'scale(1)' : 'scale(0.95)',
            zIndex: showNext ? 2 : 1
          }}
          muted
          loop
          playsInline
          crossOrigin="anonymous"
        />
      )}
      
      {/* Video loading indicator */}
      {shouldShowVideo && (loading || !videoReady || isTransitioning) && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
        </div>
      )}
      
      {/* Wireframe pattern - hidden when video is playing */}
      {(!shouldShowVideo || (!isPlaying && !isTransitioning)) && (
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
        {(!isPlaying || isTransitioning) && (
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
          shouldShowVideo && (isPlaying || isTransitioning) && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
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