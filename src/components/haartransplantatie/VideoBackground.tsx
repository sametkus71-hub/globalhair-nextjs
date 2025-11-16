import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { useSession } from '@/hooks/useSession';
import { useIsMobile } from '@/hooks/use-mobile';

interface VideoBackgroundProps {
  className?: string;
}

export const VideoBackground = ({ className = '' }: VideoBackgroundProps) => {
  const { profile } = useSession();
  const isMobile = useIsMobile();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  
  const standardVideoRef = useRef<HTMLVideoElement>(null);
  const premiumVideoRef = useRef<HTMLVideoElement>(null);
  const eliteVideoRef = useRef<HTMLVideoElement>(null);
  
  const hlsInstancesRef = useRef<Hls[]>([]);
  
  // Video sources mapping
  const videoSources = {
    Standard: 'https://vz-104aba77-1e1.b-cdn.net/f360538a-73d6-4b0b-a2bc-c2f735dfb82a/playlist.m3u8',
    Premium: 'https://vz-104aba77-1e1.b-cdn.net/c7fe692c-a489-4911-8363-9eee6efeff85/playlist.m3u8',
    Elite: 'https://vz-104aba77-1e1.b-cdn.net/3c893e3d-e19b-4543-8ed9-08a86fe43a67/playlist.m3u8'
  };
  
  // Initialize HLS players
  useEffect(() => {
    if (isMobile === undefined) return; // Wait for mobile detection
    
    const activePackage = profile.selectedPackage || 'Standard';
    
    const videos = {
      Standard: { ref: standardVideoRef, src: videoSources.Standard },
      Premium: { ref: premiumVideoRef, src: videoSources.Premium },
      Elite: { ref: eliteVideoRef, src: videoSources.Elite }
    };
    
    // Cleanup previous HLS instances
    hlsInstancesRef.current.forEach(hls => hls.destroy());
    hlsInstancesRef.current = [];
    
    if (isMobile) {
      // MOBILE: Load only active video with HLS, others with metadata only
      const activeVideo = videos[activePackage as keyof typeof videos];
      
      if (activeVideo.ref.current && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,
          lowLatencyMode: false,
          backBufferLength: 30 // Reduced for mobile
        });
        
        hlsInstancesRef.current = [hls];
        
        hls.loadSource(activeVideo.src);
        hls.attachMedia(activeVideo.ref.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          activeVideo.ref.current?.play().catch(() => {});
          setIsLoaded(true);
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
        });
      } else if (activeVideo.ref.current?.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        activeVideo.ref.current.src = activeVideo.src;
        activeVideo.ref.current.addEventListener('loadeddata', () => {
          setIsLoaded(true);
          activeVideo.ref.current?.play().catch(() => {});
        });
      }
      
      // Set inactive videos to preload="metadata" only (first frame)
      Object.entries(videos).forEach(([packageName, video]) => {
        if (packageName !== activePackage && video.ref.current) {
          video.ref.current.preload = 'metadata';
          video.ref.current.src = video.src;
        }
      });
      
    } else {
      // DESKTOP: Load all videos with HLS (current behavior)
      let loadedVideos = 0;
      
      Object.values(videos).forEach(({ ref, src }) => {
        if (ref.current && Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: false,
            lowLatencyMode: false,
            backBufferLength: 60 // Slightly reduced from 90
          });
          
          hlsInstancesRef.current.push(hls);
          
          hls.loadSource(src);
          hls.attachMedia(ref.current);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (ref.current) {
              ref.current.play().catch(() => {});
            }
            
            loadedVideos++;
            setLoadedCount(loadedVideos);
            
            if (loadedVideos === 3) {
              setIsLoaded(true);
            }
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
          });
        } else if (ref.current?.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          ref.current.src = src;
          ref.current.addEventListener('loadeddata', () => {
            loadedVideos++;
            setLoadedCount(loadedVideos);
            
            if (loadedVideos === 3) {
              setIsLoaded(true);
            }
            
            if (ref.current) {
              ref.current.play().catch(() => {});
            }
          });
        }
      });
    }
    
    return () => {
      // Cleanup HLS instances
      hlsInstancesRef.current.forEach(hls => {
        hls.destroy();
      });
      hlsInstancesRef.current = [];
    };
  }, [isMobile, profile.selectedPackage]);
  
  // Get the active video based on selected package
  const getActiveVideo = () => {
    switch (profile.selectedPackage) {
      case 'Standard':
        return 'standard';
      case 'Premium':
        return 'premium';
      case 'Elite':
        return 'elite';
      default:
        return 'standard';
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
      case 'Elite':
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
      
      {/* Standard Package Video - Multi-layer camera lens blur */}
      <div className={`fixed inset-0 transition-opacity duration-500 ${
        activeVideo === 'standard' ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Main video with camera lens blur */}
        <video
          ref={standardVideoRef}
          className="fixed"
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            width: '100vw',
            height: 'var(--app-height)',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)'
          }}
          autoPlay={!isMobile || activeVideo === 'standard'}
          muted
          loop
          playsInline
          preload="none"
        />
      </div>
      
      {/* Premium Package Video - Multi-layer camera lens blur */}
      <div className={`fixed inset-0 transition-opacity duration-500 ${
        activeVideo === 'premium' ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Main video with camera lens blur */}
        <video
          ref={premiumVideoRef}
          className="fixed"
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            width: '100vw',
            height: 'var(--app-height)',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)'
          }}
          autoPlay={!isMobile || activeVideo === 'premium'}
          muted
          loop
          playsInline
          preload="none"
        />
      </div>
      
      {/* Elite Package Video - Multi-layer camera lens blur */}
      <div className={`fixed inset-0 transition-opacity duration-500 ${
        activeVideo === 'elite' ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Main video with camera lens blur */}
        <video
          ref={eliteVideoRef}
          className="fixed"
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            width: '100vw',
            height: 'var(--app-height)',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)'
          }}
          autoPlay={!isMobile || activeVideo === 'elite'}
          muted
          loop
          playsInline
          preload="none"
        />
      </div>
    </div>
  );
};