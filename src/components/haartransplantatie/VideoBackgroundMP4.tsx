import { useEffect, useRef, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

interface VideoBackgroundMP4Props {
  className?: string;
}

export const VideoBackgroundMP4 = ({ className = '' }: VideoBackgroundMP4Props) => {
  const { profile } = useSession();
  
  // Dual video system refs for smooth crossfades
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  
  // State management for layered transitions
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<string>(profile.selectedPackage || 'Standard');
  const [foregroundVideoRef, setForegroundVideoRef] = useState<'current' | 'next'>('current');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // MP4 video sources mapping - Bunny CDN MP4 links
  const videoSources = {
    Standard: 'https://GlobalHair.b-cdn.net/haartransplantatie%20bg/Verticaal%20Standard%20V0%20(1).mp4',
    Premium: 'https://GlobalHair.b-cdn.net/haartransplantatie%20bg/Verticaal%20Premium%20V0%20(1).mp4',
    Advanced: 'https://GlobalHair.b-cdn.net/haartransplantatie%20bg/Verticaal%20Advanced%20V0%20(1).mp4'
  };
  
  // Load video with optimized settings
  const loadVideo = async (videoElement: HTMLVideoElement, src: string, seekTime: number = 0) => {
    return new Promise<void>((resolve, reject) => {
      if (!videoElement) {
        reject(new Error('No video element'));
        return;
      }
      
      const handleLoad = () => {
        // Seek to sync time if needed
        if (seekTime > 0) {
          videoElement.currentTime = seekTime;
        }
        
        videoElement.removeEventListener('loadeddata', handleLoad);
        videoElement.removeEventListener('error', handleError);
        resolve();
      };
      
      const handleError = (error: any) => {
        console.error('Video load error:', error);
        videoElement.removeEventListener('loadeddata', handleLoad);
        videoElement.removeEventListener('error', handleError);
        reject(error);
      };
      
      videoElement.addEventListener('loadeddata', handleLoad);
      videoElement.addEventListener('error', handleError);
      
      videoElement.preload = 'auto';
      videoElement.src = src;
    });
  };
  
  // Enhanced layered transition - new video behind, fade out foreground only
  const startLayeredTransition = async (newPackage: string) => {
    if (isTransitioning || newPackage === currentPackage) return;
    
    setIsTransitioning(true);
    
    // Get current foreground video and background video
    const foregroundVideo = foregroundVideoRef === 'current' ? currentVideoRef.current : nextVideoRef.current;
    const backgroundVideo = foregroundVideoRef === 'current' ? nextVideoRef.current : currentVideoRef.current;
    
    if (!foregroundVideo || !backgroundVideo) {
      setIsTransitioning(false);
      return;
    }
    
    try {
      // Get current playback time for perfect synchronization
      const currentTime = foregroundVideo.currentTime || 0;
      
      // Load new video in background synchronized to current time
      await loadVideo(backgroundVideo, videoSources[newPackage as keyof typeof videoSources], currentTime);
      
      // Start playing background video (behind foreground)
      await backgroundVideo.play();
      
      // Only fade out the foreground video - background stays visible
      foregroundVideo.classList.add('video-fade-out-smooth');
      
      // Complete transition after smooth fade
      setTimeout(() => {
        // Swap video refs - background becomes new foreground
        setForegroundVideoRef(foregroundVideoRef === 'current' ? 'next' : 'current');
        setCurrentPackage(newPackage);
        
        // Clean up and reset
        foregroundVideo.classList.remove('video-fade-out-smooth');
        foregroundVideo.pause(); // Save resources
        
        setIsTransitioning(false);
      }, 800); // Smooth transition timing
      
    } catch (error) {
      console.error('Layered transition failed:', error);
      setIsTransitioning(false);
    }
  };
  
  // Initialize first video on mount
  useEffect(() => {
    const initialVideo = currentVideoRef.current;
    if (!initialVideo || isLoaded) return;
    
    const selectedPackage = profile.selectedPackage || 'Standard';
    
    loadVideo(initialVideo, videoSources[selectedPackage as keyof typeof videoSources])
      .then(() => {
        setCurrentPackage(selectedPackage);
        setIsLoaded(true);
        return initialVideo.play();
      })
      .catch((error) => {
        console.error('Initial video load failed:', error);
        setIsLoaded(true); // Still mark as loaded to prevent blocking
      });
  }, [profile.selectedPackage]);
  
  // Handle package changes with smooth transitions
  useEffect(() => {
    if (!isLoaded) return;
    
    const selectedPackage = profile.selectedPackage || 'Standard';
    
    if (selectedPackage !== currentPackage) {
      startLayeredTransition(selectedPackage);
    }
  }, [profile.selectedPackage, currentPackage, isLoaded]);
  
  // Handle document visibility changes for active video
  useEffect(() => {
    const handleVisibilityChange = () => {
      const activeVideo = foregroundVideoRef === 'current' ? currentVideoRef.current : nextVideoRef.current;
      
      if (document.hidden) {
        activeVideo?.pause();
      } else {
        activeVideo?.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [foregroundVideoRef]);
  
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
      
      {/* Background Video - Always behind (z-index: 1) */}
      <video
        ref={nextVideoRef}
        className="fixed inset-0 w-full h-full object-cover"
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
      
      {/* Foreground Video - Always on top (z-index: 2) */}
      <video
        ref={currentVideoRef}
        className="fixed inset-0 w-full h-full object-cover"
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
    </div>
  );
};