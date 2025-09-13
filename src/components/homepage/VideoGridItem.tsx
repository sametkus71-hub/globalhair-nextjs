import { useEffect, useRef, useState } from 'react';
import { useSimpleVideo } from '@/hooks/useSimpleVideo';
import { cn } from '@/lib/utils';
import Hls from 'hls.js';

interface VideoGridItemProps {
  title: string;
  gridIndex: number;
  isActive: boolean;
  onClick?: () => void;
  variation?: {
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
  navigatingItem: number | null;
}

export const VideoGridItem = ({
  title,
  gridIndex,
  isActive,
  onClick,
  variation,
  profile,
  navigatingItem
}: VideoGridItemProps) => {
  const { videoSrc, loading, hasVideo } = useSimpleVideo(profile);
  
  // Dual video system for smooth crossfades
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const currentHlsRef = useRef<Hls | null>(null);
  const nextHlsRef = useRef<Hls | null>(null);
  
  // State for managing video transitions
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string | null>(null);
  const [isCurrentVisible, setIsCurrentVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const shouldShowVideo = hasVideo && title === "HAAR TRANSPLANTATIE" && profile.geslacht === "Man";
  const baseDarkness = variation?.baseDarkness || 0.5;

  // Initialize video or handle smooth crossfade transitions
  useEffect(() => {
    if (!shouldShowVideo || !videoSrc) {
      setCurrentVideoSrc(null);
      return;
    }

    // First time initialization
    if (!currentVideoSrc) {
      console.log('🎥 Initial video setup:', videoSrc);
      loadVideoIntoElement(currentVideoRef.current, currentHlsRef, videoSrc, () => {
        setCurrentVideoSrc(videoSrc);
      });
      return;
    }

    // Start crossfade transition for source change
    if (videoSrc !== currentVideoSrc && !isTransitioning) {
      console.log('🔄 Starting smooth crossfade from', currentVideoSrc, 'to', videoSrc);
      setIsTransitioning(true);

      const nextVideo = isCurrentVisible ? nextVideoRef.current : currentVideoRef.current;
      const nextHls = isCurrentVisible ? nextHlsRef : currentHlsRef;

      // Preload the next video
      loadVideoIntoElement(nextVideo, nextHls, videoSrc, () => {
        console.log('✨ Next video ready, starting crossfade');
        startCrossfade();
      });
    }
  }, [shouldShowVideo, videoSrc, currentVideoSrc, isTransitioning, isCurrentVisible]);

  // Load video into specified element with HLS support
  const loadVideoIntoElement = (
    video: HTMLVideoElement | null, 
    hlsRef: React.MutableRefObject<Hls | null>, 
    src: string, 
    onReady: () => void
  ) => {
    if (!video) return;

    if (src.includes('.m3u8')) {
      if (Hls.isSupported()) {
        // Clean up existing HLS instance
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        hlsRef.current = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          startLevel: -1,
        });
        
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('🎬 HLS manifest parsed');
          video.play().catch(() => console.log('Autoplay prevented'));
          onReady();
        });
        
        hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
        });
        
        hlsRef.current.loadSource(src);
        hlsRef.current.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('canplay', onReady, { once: true });
        video.load();
      }
    } else {
      video.src = src;
      video.addEventListener('canplay', onReady, { once: true });
      video.load();
    }
  };

  // Start smooth crossfade animation
  const startCrossfade = () => {
    requestAnimationFrame(() => {
      // Start crossfade by toggling visibility
      setIsCurrentVisible(!isCurrentVisible);
      
      // After transition completes, update state and cleanup
      setTimeout(() => {
        setCurrentVideoSrc(videoSrc);
        setIsTransitioning(false);
        console.log('🎬 Crossfade completed');
      }, 600); // Match CSS transition duration
    });
  };

  // Cleanup HLS instances on unmount
  useEffect(() => {
    return () => {
      if (currentHlsRef.current) {
        currentHlsRef.current.destroy();
        currentHlsRef.current = null;
      }
      if (nextHlsRef.current) {
        nextHlsRef.current.destroy();
        nextHlsRef.current = null;
      }
    };
  }, []);

  // Handle document visibility changes for both videos
  useEffect(() => {
    const handleVisibilityChange = () => {
      const currentVideo = currentVideoRef.current;
      const nextVideo = nextVideoRef.current;
      
      if (document.hidden) {
        currentVideo?.pause();
        nextVideo?.pause();
      } else {
        if (isCurrentVisible) {
          currentVideo?.play().catch(() => {});
        } else {
          nextVideo?.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isCurrentVisible]);
  
  return (
    <div
      data-grid-item={gridIndex}
      className={cn(
        "relative w-full h-full overflow-hidden transition-all duration-500 ease-in-out",
        isActive ? "cursor-pointer hover:scale-[1.02] hover:brightness-110" : "cursor-not-allowed"
      )}
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, 
          rgba(${Math.round(baseDarkness * 255)}, ${Math.round(baseDarkness * 255)}, ${Math.round(baseDarkness * 255)}, 0.3), 
          rgba(${Math.round(baseDarkness * 200)}, ${Math.round(baseDarkness * 200)}, ${Math.round(baseDarkness * 200)}, 0.7)
        )`
      }}
    >
      {/* Dual Video System for Smooth Crossfades */}
      {shouldShowVideo && (
        <>
          {/* Current Video */}
          <video
            ref={currentVideoRef}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-600 ease-in-out",
              isCurrentVisible ? "opacity-100" : "opacity-0"
            )}
            playsInline
            muted
            loop
            preload="metadata"
          />
          
          {/* Next Video (for transitions) */}
          <video
            ref={nextVideoRef}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-600 ease-in-out",
              isCurrentVisible ? "opacity-0" : "opacity-100"
            )}
            playsInline
            muted
            loop
            preload="metadata"
          />
        </>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Wireframe pattern background - show when no video */}
      {!hasVideo && !loading && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      )}
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-white z-20">
        <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-light tracking-[0.2em] uppercase font-bold text-center leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
};