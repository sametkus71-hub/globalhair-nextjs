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
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string | null>(null);
  const [nextVideoSrc, setNextVideoSrc] = useState<string | null>(null);
  const [showNext, setShowNext] = useState(false);
  const [swapVideos, setSwapVideos] = useState(false); // New state to swap video elements
  
  const shouldShowVideo = hasVideo && title === "HAAR TRANSPLANTATIE" && profile.geslacht === "Man";
  const baseDarkness = variation?.baseDarkness || 0.5;

  // Helper function to setup HLS
  const setupHLS = (video: HTMLVideoElement, src: string): Hls | null => {
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
      });

      hls.loadSource(src);
      hls.attachMedia(video);
      return hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = src;
      video.load();
      return null;
    }
    return null;
  };

  // Initialize video source
  useEffect(() => {
    if (!shouldShowVideo || !videoSrc) {
      setCurrentVideoSrc(null);
      setNextVideoSrc(null);
      return;
    }

    if (!currentVideoSrc) {
      setCurrentVideoSrc(videoSrc);
      return;
    }

    if (videoSrc !== currentVideoSrc) {
      console.log('🎬 Starting seamless video transition from', currentVideoSrc, 'to', videoSrc);
      setNextVideoSrc(videoSrc);
      setIsTransitioning(true);
    }
  }, [shouldShowVideo, videoSrc, currentVideoSrc]);

  // Setup and play current video
  useEffect(() => {
    const video = currentVideoRef.current;
    if (!video || !currentVideoSrc) return;

    let hls: Hls | null = null;

    const initializeVideo = async () => {
      console.log('🎥 Initializing current video:', currentVideoSrc);
      
      if (currentVideoSrc.includes('.m3u8')) {
        hls = setupHLS(video, currentVideoSrc);
      } else {
        video.src = currentVideoSrc;
      }

      try {
        await video.play();
        console.log('▶️ Current video playing successfully');
      } catch (error) {
        console.log('⏸️ Current video autoplay prevented');
      }
    };

    initializeVideo();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [currentVideoSrc]);

  // Setup and play next video, then crossfade - true seamless transition
  useEffect(() => {
    const video = nextVideoRef.current;
    if (!video || !nextVideoSrc || !isTransitioning) return;

    let hls: Hls | null = null;

    const initializeNextVideo = async () => {
      console.log('🎥 Preparing next video for seamless transition:', nextVideoSrc);
      
      if (nextVideoSrc.includes('.m3u8')) {
        hls = setupHLS(video, nextVideoSrc);
      } else {
        video.src = nextVideoSrc;
      }

      try {
        await video.play();
        console.log('▶️ Next video ready, starting smooth crossfade');
        
        // Start crossfade immediately when video is ready
        setShowNext(true);
        
        // Complete transition by swapping video elements - no source change!
        setTimeout(() => {
          // Instead of changing sources, we swap which video is "current"
          setSwapVideos(!swapVideos); // Toggle swap state
          setCurrentVideoSrc(nextVideoSrc); // Update state but don't touch video src
          setNextVideoSrc(null);
          setIsTransitioning(false);
          setShowNext(false);
          console.log('✨ Seamless video transition complete - video continues playing');
        }, 450); // Even faster transition
      } catch (error) {
        console.log('⏸️ Next video autoplay prevented, completing transition');
        setSwapVideos(!swapVideos);
        setCurrentVideoSrc(nextVideoSrc);
        setNextVideoSrc(null);
        setIsTransitioning(false);
        setShowNext(false);
      }
    };

    initializeNextVideo();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [nextVideoSrc, isTransitioning, swapVideos]);

  // Pause videos when document becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      const currentVideo = currentVideoRef.current;
      const nextVideo = nextVideoRef.current;
      
      if (document.hidden) {
        currentVideo?.pause();
        nextVideo?.pause();
      } else {
        currentVideo?.play().catch(() => {});
        nextVideo?.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  
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
      {/* Current Video - conditionally swap which element is "current" */}
      <video
        ref={swapVideos ? nextVideoRef : currentVideoRef}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-all duration-450 ease-in-out",
          showNext ? "opacity-0 scale-105" : "opacity-100 scale-100"
        )}
        playsInline
        muted
        loop
        preload="metadata"
      />

      {/* Next Video (for transitions) - conditionally swap which element is "next" */}
      {nextVideoSrc && (
        <video
          ref={swapVideos ? currentVideoRef : nextVideoRef}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-450 ease-in-out",
            showNext ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
          playsInline
          muted
          loop
          preload="metadata"
        />
      )}

      {/* Loading indicator - only show for initial load, hide during transitions */}
      {(loading || (!currentVideoSrc && !nextVideoSrc)) && !isTransitioning && (
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
      
      {/* Content overlay - only show title, hide profile info completely during video playback */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-white z-20">
        <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-light tracking-[0.2em] uppercase font-bold text-center leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
};