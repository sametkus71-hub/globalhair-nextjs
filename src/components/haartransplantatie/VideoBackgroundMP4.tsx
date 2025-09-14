import { useEffect, useRef, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { useTimeSyncedVideo } from '@/hooks/useTimeSyncedVideo';
import { cn } from '@/lib/utils';
import Hls from 'hls.js';

interface VideoBackgroundMP4Props {
  className?: string;
}

export const VideoBackgroundMP4 = ({ className = '' }: VideoBackgroundMP4Props) => {
  const { profile } = useSession();
  
  // Enhanced time-synced video system
  const {
    loadVideoWithTimeSync,
    trackVideoTime,
    startTimeSyncedCrossfade,
    getCurrentTime,
    isTransitioning
  } = useTimeSyncedVideo({
    onVideoReady: () => {
      console.log('✅ Background video ready');
    },
    onError: (error) => {
      console.error('❌ Background video error:', error);
    }
  });
  
  // Dual video system refs for smooth crossfades
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const currentHlsRef = useRef<Hls | null>(null);
  const nextHlsRef = useRef<Hls | null>(null);
  
  // Simplified state management
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<string>(profile.selectedPackage || 'Standard');
  const [isCurrentVisible, setIsCurrentVisible] = useState(true);
  
  // MP4 video sources mapping - Bunny CDN MP4 links
  const videoSources = {
    Standard: 'https://GlobalHair.b-cdn.net/haartransplantatie%20bg/Verticaal%20Standard%20V0%20(1).mp4',
    Premium: 'https://GlobalHair.b-cdn.net/haartransplantatie%20bg/Verticaal%20Premium%20V0%20(1).mp4',
    Advanced: 'https://GlobalHair.b-cdn.net/haartransplantatie%20bg/Verticaal%20Advanced%20V0%20(1).mp4'
  };
  
  // Enhanced cleanup function
  const cleanupVideo = (
    video: HTMLVideoElement | null,
    hlsRef: React.MutableRefObject<Hls | null>
  ) => {
    if (video) {
      video.pause();
      video.src = '';
      video.load();
    }
    
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
      } catch (error) {
        console.warn('HLS cleanup warning:', error);
      }
      hlsRef.current = null;
    }
  };
  
  // Initialize first video on mount
  useEffect(() => {
    const initialVideo = currentVideoRef.current;
    if (!initialVideo || isLoaded) return;
    
    const selectedPackage = profile.selectedPackage || 'Standard';
    
    console.log('🎬 Initializing background video:', selectedPackage);
    
    loadVideoWithTimeSync(initialVideo, currentHlsRef, videoSources[selectedPackage as keyof typeof videoSources], 0)
      .then(() => {
        setCurrentPackage(selectedPackage);
        setIsLoaded(true);
        
        // Start time tracking and playback
        trackVideoTime(initialVideo);
        return initialVideo.play();
      })
      .catch((error) => {
        console.error('Initial video load failed:', error);
        setIsLoaded(true); // Still mark as loaded to prevent blocking
      });
  }, [loadVideoWithTimeSync, trackVideoTime]);
  
  // Handle package changes with time-synced transitions
  useEffect(() => {
    if (!isLoaded) return;
    
    const selectedPackage = profile.selectedPackage || 'Standard';
    
    if (selectedPackage !== currentPackage && !isTransitioning) {
      console.log('🔄 Starting background time-synced transition from', currentPackage, 'to', selectedPackage);
      
      const currentVideo = isCurrentVisible ? currentVideoRef.current : nextVideoRef.current;
      const nextVideo = isCurrentVisible ? nextVideoRef.current : currentVideoRef.current;
      const nextHls = isCurrentVisible ? nextHlsRef : currentHlsRef;
      
      startTimeSyncedCrossfade(
        currentVideo,
        nextVideo,
        nextHls,
        videoSources[selectedPackage as keyof typeof videoSources],
        () => {
          // Start visual crossfade after videos are synchronized
          setIsCurrentVisible(!isCurrentVisible);
          
          // Update state after animation completes
          setTimeout(() => {
            setCurrentPackage(selectedPackage);
            
            // Start time tracking on the new current video
            if (nextVideo) {
              trackVideoTime(nextVideo);
            }
            
            console.log('✅ Background crossfade completed');
          }, 750); // Match CSS transition duration
        }
      );
    }
  }, [profile.selectedPackage, currentPackage, isLoaded, isTransitioning, isCurrentVisible, startTimeSyncedCrossfade, trackVideoTime]);
  
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
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupVideo(currentVideoRef.current, currentHlsRef);
      cleanupVideo(nextVideoRef.current, nextHlsRef);
    };
  }, []);
  
  // Fallback color for loading state
  const getFallbackColor = () => {
    switch (currentPackage) {
      case 'Standard':
        return '#E4E5E0';
      case 'Premium':
        return '#E8E4E0';
      case 'Advanced':
        return '#E0E8E4';
      default:
        return '#E4E5E0';
    }
  };
  
  return (
    <div className={cn("fixed inset-0 overflow-hidden", className)} style={{ zIndex: 1 }}>
      {/* Fallback background during loading */}
      {!isLoaded && (
        <div 
          className="fixed inset-0 transition-colors duration-500"
          style={{ backgroundColor: getFallbackColor(), zIndex: 1 }}
        />
      )}
      
      {/* Dual Video System for Smooth Time-Synced Crossfades */}
      
      {/* Current Video - GPU accelerated with conditional visibility */}
      <video
        ref={currentVideoRef}
        className={cn(
          "fixed inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out",
          isCurrentVisible ? "opacity-100" : "opacity-0",
          isTransitioning && isCurrentVisible && "video-fade-out-phase"
        )}
        style={{ 
          filter: 'blur(8px) brightness(0.85) contrast(1.2) saturate(1.1)',
          objectFit: 'cover',
          objectPosition: 'center center',
          zIndex: 2,
          width: 'calc(100vw + 100px)',
          height: 'calc(100vh + 100px)',
          left: '50%',
          top: '-50px',
          transform: 'translateX(-50%) scale(1.05) translate3d(0, 0, 0)',
          isolation: 'isolate',
          mixBlendMode: 'normal'
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      
      {/* Next Video - Enhanced with staggered timing */}
      <video
        ref={nextVideoRef}
        className={cn(
          "fixed inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out",
          isCurrentVisible ? "opacity-0" : "opacity-100",
          isTransitioning && !isCurrentVisible && "video-fade-in-phase"
        )}
        style={{ 
          filter: 'blur(8px) brightness(0.85) contrast(1.2) saturate(1.1)',
          objectFit: 'cover',
          objectPosition: 'center center',
          zIndex: 1,
          width: 'calc(100vw + 100px)',
          height: 'calc(100vh + 100px)',
          left: '50%',
          top: '-50px',
          transform: 'translateX(-50%) scale(1.05) translate3d(0, 0, 0)',
          isolation: 'isolate',
          mixBlendMode: 'normal'
        }}
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
};