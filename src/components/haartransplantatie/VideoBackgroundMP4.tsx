import { useEffect, useRef, useState } from 'react';
import { useSession } from '@/hooks/useSession';

interface VideoBackgroundMP4Props {
  className?: string;
}

export const VideoBackgroundMP4 = ({ className = '' }: VideoBackgroundMP4Props) => {
  const { profile } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  
  const standardVideoRef = useRef<HTMLVideoElement>(null);
  const premiumVideoRef = useRef<HTMLVideoElement>(null);
  const advancedVideoRef = useRef<HTMLVideoElement>(null);
  
  // MP4 video sources mapping - Bunny CDN MP4 links
  const videoSources = {
    Standard: 'https://GlobalHair.b-cdn.net/haartransplantatie%20bg/Verticaal%20Standard%20V0%20(1).mp4',
    Premium: 'https://GlobalHair.b-cdn.net/haartransplantatie%20bg/Verticaal%20Premium%20V0%20(1).mp4',
    Advanced: 'https://GlobalHair.b-cdn.net/haartransplantatie%20bg/Verticaal%20Advanced%20V0%20(1).mp4'
  };
  
  // Initialize MP4 videos with intelligent preloading
  useEffect(() => {
    const videos = [
      { ref: standardVideoRef, src: videoSources.Standard, package: 'Standard' },
      { ref: premiumVideoRef, src: videoSources.Premium, package: 'Premium' },
      { ref: advancedVideoRef, src: videoSources.Advanced, package: 'Advanced' }
    ];
    
    let loadedVideos = 0;
    
    // Preload the selected package video first, then others
    const selectedPackage = profile.selectedPackage || 'Standard';
    const priorityVideo = videos.find(v => v.package === selectedPackage);
    const otherVideos = videos.filter(v => v.package !== selectedPackage);
    
    const loadVideo = (video: typeof videos[0], priority: boolean = false) => {
      if (video.ref.current) {
        const videoElement = video.ref.current;
        
        // Set preload strategy based on priority
        videoElement.preload = priority ? 'auto' : 'metadata';
        videoElement.src = video.src;
        
        const handleLoad = () => {
          loadedVideos++;
          setLoadedCount(loadedVideos);
          
          if (loadedVideos === 3) {
            setIsLoaded(true);
          }
          
          // Auto-play the current selected video
          if (video.package === profile.selectedPackage) {
            videoElement.play().catch(() => {
              // Autoplay might be blocked, that's ok
            });
          }
        };
        
        const handleError = (error: any) => {
          console.error(`MP4 Video Error for ${video.package}:`, error);
          // Still count as loaded to prevent blocking
          loadedVideos++;
          setLoadedCount(loadedVideos);
          
          if (loadedVideos === 3) {
            setIsLoaded(true);
          }
        };
        
        videoElement.addEventListener('loadeddata', handleLoad);
        videoElement.addEventListener('error', handleError);
        
        // Cleanup event listeners
        return () => {
          videoElement.removeEventListener('loadeddata', handleLoad);
          videoElement.removeEventListener('error', handleError);
        };
      }
    };
    
    // Load priority video first
    const cleanupFunctions: (() => void)[] = [];
    
    if (priorityVideo) {
      const cleanup = loadVideo(priorityVideo, true);
      if (cleanup) cleanupFunctions.push(cleanup);
    }
    
    // Load other videos with slight delay for better performance
    setTimeout(() => {
      otherVideos.forEach(video => {
        const cleanup = loadVideo(video, false);
        if (cleanup) cleanupFunctions.push(cleanup);
      });
    }, 100);
    
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [profile.selectedPackage]);
  
  // Smart video switching with enhanced CSS animations
  useEffect(() => {
    const videos = [standardVideoRef, premiumVideoRef, advancedVideoRef];
    const activeIndex = getActiveVideoIndex();
    
    videos.forEach((videoRef, index) => {
      if (videoRef.current) {
        if (index === activeIndex) {
          // Play active video
          videoRef.current.play().catch(() => {
            // Autoplay might be blocked
          });
        } else {
          // Pause inactive videos to save resources
          videoRef.current.pause();
        }
      }
    });
  }, [profile.selectedPackage]);
  
  // Get the active video based on selected package
  const getActiveVideo = () => {
    switch (profile.selectedPackage) {
      case 'Standard':
        return 'standard';
      case 'Premium':
        return 'premium';
      case 'Advanced':
        return 'advanced';
      default:
        return 'standard';
    }
  };
  
  const getActiveVideoIndex = () => {
    switch (profile.selectedPackage) {
      case 'Standard':
        return 0;
      case 'Premium':
        return 1;
      case 'Advanced':
        return 2;
      default:
        return 0;
    }
  };
  
  const activeVideo = getActiveVideo();
  
  // Fallback colors for each package during loading
  const getFallbackColor = () => {
    switch (profile.selectedPackage) {
      case 'Standard':
        return '#E4E5E0'; // Current background color
      case 'Premium':
        return '#E8E4E0'; // Slightly warmer
      case 'Advanced':
        return '#E0E8E4'; // Slightly cooler
      default:
        return '#E4E5E0';
    }
  };
  
  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`} style={{ zIndex: 1 }}>
      {/* Fallback background during loading */}
      {!isLoaded && (
        <div 
          className="fixed inset-0 transition-colors duration-500"
          style={{ backgroundColor: getFallbackColor(), zIndex: 1 }}
        />
      )}
      
      {/* Standard Package Video - Enhanced transitions */}
      <div className={`fixed inset-0 video-crossfade-current ${
        activeVideo === 'standard' ? 'opacity-100' : 'opacity-0'
      }`}>
        <video
          ref={standardVideoRef}
          className="fixed"
          style={{ 
            filter: 'blur(8px) brightness(0.85) contrast(1.2) saturate(1.1)',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            width: 'calc(100vw + 100px)',
            height: 'calc(100vh + 100px)',
            left: '50%',
            top: '-50px',
            transform: 'translateX(-50%) scale(1.05)'
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
      
      {/* Premium Package Video - Enhanced transitions */}
      <div className={`fixed inset-0 video-crossfade-next ${
        activeVideo === 'premium' ? 'opacity-100' : 'opacity-0'
      }`}>
        <video
          ref={premiumVideoRef}
          className="fixed"
          style={{ 
            filter: 'blur(8px) brightness(0.85) contrast(1.2) saturate(1.1)',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            width: 'calc(100vw + 100px)',
            height: 'calc(100vh + 100px)',
            left: '50%',
            top: '-50px',
            transform: 'translateX(-50%) scale(1.05)'
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
      
      {/* Advanced Package Video - Enhanced transitions */}
      <div className={`fixed inset-0 video-crossfade-current ${
        activeVideo === 'advanced' ? 'opacity-100' : 'opacity-0'
      }`}>
        <video
          ref={advancedVideoRef}
          className="fixed"
          style={{ 
            filter: 'blur(8px) brightness(0.85) contrast(1.2) saturate(1.1)',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            width: 'calc(100vw + 100px)',
            height: 'calc(100vh + 100px)',
            left: '50%',
            top: '-50px',
            transform: 'translateX(-50%) scale(1.05)'
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  );
};