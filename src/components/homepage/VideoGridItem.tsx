import { useEffect, useRef, useState } from 'react';
import { useHaartransplantatieVideos } from '@/hooks/useHaartransplantatieVideos';
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
  const {
    isVideoAvailableForProfile,
    getVideoForProfile,
    isVideoLoadedForProfile,
    isVideoLoadingForProfile
  } = useHaartransplantatieVideos();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const [videoMounted, setVideoMounted] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  
  const shouldShowVideo = isVideoAvailableForProfile(profile) && title === "HAAR TRANSPLANTATIE" && profile.geslacht === "Man";
  
  // Mount video element when available
  useEffect(() => {
    if (!shouldShowVideo || !containerRef.current) return;
    
    const video = getVideoForProfile(profile);
    if (video && video !== videoElementRef.current && isVideoLoadedForProfile(profile)) {
      // Clean up previous video
      if (videoElementRef.current) {
        videoElementRef.current.pause();
        if (containerRef.current.contains(videoElementRef.current)) {
          containerRef.current.removeChild(videoElementRef.current);
        }
      }
      
      // Mount new video
      videoElementRef.current = video;
      video.className = "absolute inset-0 w-full h-full object-cover";
      video.style.filter = 'brightness(0.7) contrast(1.1)';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      
      containerRef.current.appendChild(video);
      setVideoMounted(true);
      
      // Wait a moment for the video to be ready, then try to play
      setTimeout(() => {
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
          video.play().then(() => {
            console.log('Video started playing successfully');
            setVideoPlaying(true);
          }).catch((error) => {
            console.warn('Video autoplay failed:', error);
            setVideoPlaying(false);
          });
        } else {
          // If not ready, wait for loadeddata event
          video.addEventListener('loadeddata', () => {
            video.play().then(() => {
              console.log('Video started playing after loadeddata');
              setVideoPlaying(true);
            }).catch((error) => {
              console.warn('Video autoplay failed after loadeddata:', error);
              setVideoPlaying(false);
            });
          }, { once: true });
        }
      }, 100);
    }
  }, [shouldShowVideo, getVideoForProfile, profile, isVideoLoadedForProfile]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (videoElementRef.current) {
        videoElementRef.current.pause();
        setVideoPlaying(false);
      }
    };
  }, []);
  
  // Handle visibility changes to pause/resume video
  useEffect(() => {
    const video = videoElementRef.current;
    if (!video) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        setVideoPlaying(false);
      } else {
        video.play().then(() => {
          setVideoPlaying(true);
        }).catch(() => {
          setVideoPlaying(false);
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [videoMounted]);
  
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
      {/* Video loading indicator - only show when actively loading */}
      {shouldShowVideo && isVideoLoadingForProfile(profile) && !isVideoLoadedForProfile(profile) && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
        </div>
      )}
      
      {/* Wireframe pattern - hidden when video is playing */}
      {(!shouldShowVideo || !videoPlaying) && (
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
          shouldShowVideo && videoPlaying && "drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-shadow-lg"
        )}
        style={{
          textShadow: shouldShowVideo && videoPlaying 
            ? '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' 
            : undefined
        }}>
          {title}
        </h3>
        
        {/* Profile info - only show when video is not playing */}
        {!videoPlaying && (
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
          shouldShowVideo && videoPlaying && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
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