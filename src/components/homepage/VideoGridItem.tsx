import { useEffect, useRef, useState } from 'react';
import { useSimpleVideo } from '@/hooks/useSimpleVideo';
import { useTimeSyncedVideo } from '@/hooks/useTimeSyncedVideo';
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
  
  // Enhanced time-synced video system
  const {
    loadVideoWithTimeSync,
    trackVideoTime,
    startTimeSyncedCrossfade,
    getCurrentTime,
    isTransitioning: isCrossfading
  } = useTimeSyncedVideo({
    onTimeUpdate: (time) => {
      // Optional: Track video progress for analytics
    },
    onVideoReady: () => {
      console.log('✅ Video ready for playback');
    },
    onError: (error) => {
      console.error('❌ Video error:', error);
    }
  });
  
  // Dual video system for smooth crossfades
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const currentHlsRef = useRef<Hls | null>(null);
  const nextHlsRef = useRef<Hls | null>(null);
  
  // State for managing video transitions
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string | null>(null);
  const [isCurrentVisible, setIsCurrentVisible] = useState(true);
  const [previousShouldShowVideo, setPreviousShouldShowVideo] = useState<boolean | null>(null);
  
  const shouldShowVideo = hasVideo && title === "HAAR TRANSPLANTATIE" && (profile.geslacht === "Man" || profile.geslacht === "Vrouw");
  const baseDarkness = variation?.baseDarkness || 0.5;

  // Reset video state when shouldShowVideo changes from true to false or vice versa
  useEffect(() => {
    console.log('📱 shouldShowVideo changed:', { 
      previous: previousShouldShowVideo, 
      current: shouldShowVideo, 
      currentVideoSrc,
      videoSrc,
      profile: profile.geslacht 
    });

    // When switching away from video (Man -> Vrouw)
    if (previousShouldShowVideo === true && shouldShowVideo === false) {
      console.log('🚫 Switching away from video - resetting state');
      setCurrentVideoSrc(null);
      setIsCurrentVisible(true);
      
      // Clean up video elements and HLS instances
      cleanupVideo(currentVideoRef.current, currentHlsRef);
      cleanupVideo(nextVideoRef.current, nextHlsRef);
    }

    // When switching back to video (Vrouw -> Man)
    if (previousShouldShowVideo === false && shouldShowVideo === true) {
      console.log('✅ Switching back to video - forcing reload');
      setCurrentVideoSrc(null);
      setIsCurrentVisible(true);
    }

    setPreviousShouldShowVideo(shouldShowVideo);
  }, [shouldShowVideo, previousShouldShowVideo]);

  // Initialize video with time tracking or handle smooth crossfade transitions
  useEffect(() => {
    console.log('🎥 Video effect triggered:', { 
      shouldShowVideo, 
      videoSrc, 
      currentVideoSrc, 
      isCrossfading,
      hasVideo 
    });

    if (!shouldShowVideo || !videoSrc) {
      console.log('❌ Video should not show or no videoSrc');
      return;
    }

    // First time initialization or force reload after state reset
    if (!currentVideoSrc) {
      console.log('🎬 Initial video setup with time tracking:', videoSrc);
      
      loadVideoWithTimeSync(currentVideoRef.current, currentHlsRef, videoSrc, 0)
        .then(() => {
          setCurrentVideoSrc(videoSrc);
          
          // Start time tracking on the current video
          if (currentVideoRef.current) {
            trackVideoTime(currentVideoRef.current);
            currentVideoRef.current.play().catch(console.warn);
          }
          
          console.log('✅ Initial video loaded with time sync');
        })
        .catch((error) => {
          console.error('❌ Failed to load initial video:', error);
        });
      return;
    }

    // Start time-synchronized crossfade transition for source change
    if (videoSrc !== currentVideoSrc && !isCrossfading) {
      console.log('🔄 Starting time-synced crossfade from', currentVideoSrc, 'to', videoSrc);
      
      const currentVideo = isCurrentVisible ? currentVideoRef.current : nextVideoRef.current;
      const nextVideo = isCurrentVisible ? nextVideoRef.current : currentVideoRef.current;
      const nextHls = isCurrentVisible ? nextHlsRef : currentHlsRef;

      startTimeSyncedCrossfade(
        currentVideo,
        nextVideo,
        nextHls,
        videoSrc,
        () => {
          // Start visual crossfade after videos are synchronized
          setIsCurrentVisible(!isCurrentVisible);
          
          // Update state after animation completes
            setTimeout(() => {
              setCurrentVideoSrc(videoSrc);
              
              // Start time tracking on the new current video
              if (nextVideo) {
                trackVideoTime(nextVideo);
              }
              
              // Clean up GPU acceleration hints for memory optimization
              const videos = [currentVideoRef.current, nextVideoRef.current];
              videos.forEach(video => {
                if (video) {
                  video.classList.add('video-animation-complete');
                  video.classList.remove('video-fade-out-phase', 'video-fade-in-phase');
                }
              });
              
              console.log('🎬 Time-synced crossfade completed with GPU cleanup');
            }, 350); // Much faster transition for smooth mobile experience
        }
      );
    }
  }, [shouldShowVideo, videoSrc, currentVideoSrc, isCrossfading, isCurrentVisible, loadVideoWithTimeSync, trackVideoTime, startTimeSyncedCrossfade]);

  // Enhanced cleanup with better error handling
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

  // Enhanced cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupVideo(currentVideoRef.current, currentHlsRef);
      cleanupVideo(nextVideoRef.current, nextHlsRef);
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
        "relative w-full h-full overflow-hidden transition-all duration-300 ease-out",
        isActive ? "cursor-pointer hover:scale-[1.01] hover:brightness-105" : "cursor-not-allowed"
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
          {/* Current Video - Enhanced with GPU acceleration and blend modes */}
          <video
            ref={currentVideoRef}
            className={cn(
              "absolute inset-0 w-full h-full object-cover video-crossfade-current",
              isCurrentVisible ? "opacity-100" : "opacity-0",
              isCrossfading && isCurrentVisible && "video-fade-out-phase"
            )}
            playsInline
            muted
            loop
            preload="auto"
            style={{
              transform: 'translate3d(0, 0, 0)',
              isolation: 'isolate',
              mixBlendMode: 'normal'
            }}
          />
          
          {/* Next Video - Enhanced with staggered timing */}
          <video
            ref={nextVideoRef}
            className={cn(
              "absolute inset-0 w-full h-full object-cover video-crossfade-next",
              isCurrentVisible ? "opacity-0" : "opacity-100",
              isCrossfading && !isCurrentVisible && "video-fade-in-phase"
            )}
            playsInline
            muted
            loop
            preload="auto"
            style={{
              transform: 'translate3d(0, 0, 0)',
              isolation: 'isolate',
              mixBlendMode: 'normal'
            }}
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
        <h3 className="text-lg sm:text-xl md:text-2xl text-white font-light tracking-[0.15em] uppercase text-center leading-tight" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
          {title}
        </h3>
      </div>
    </div>
  );
};