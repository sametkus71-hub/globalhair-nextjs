import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { useSession } from '@/hooks/useSession';

interface VideoBackgroundProps {
  className?: string;
}

export const VideoBackground = ({ className = '' }: VideoBackgroundProps) => {
  const { profile } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  
  const standardVideoRef = useRef<HTMLVideoElement>(null);
  const premiumVideoRef = useRef<HTMLVideoElement>(null);
  const advancedVideoRef = useRef<HTMLVideoElement>(null);
  
  const hlsInstancesRef = useRef<Hls[]>([]);
  
  // Video sources mapping
  const videoSources = {
    Standard: 'https://vz-104aba77-1e1.b-cdn.net/f360538a-73d6-4b0b-a2bc-c2f735dfb82a/playlist.m3u8',
    Premium: 'https://vz-104aba77-1e1.b-cdn.net/c7fe692c-a489-4911-8363-9eee6efeff85/playlist.m3u8',
    Advanced: 'https://vz-104aba77-1e1.b-cdn.net/3c893e3d-e19b-4543-8ed9-08a86fe43a67/playlist.m3u8'
  };
  
  // Initialize HLS players
  useEffect(() => {
    const videos = [
      { ref: standardVideoRef, src: videoSources.Standard },
      { ref: premiumVideoRef, src: videoSources.Premium },
      { ref: advancedVideoRef, src: videoSources.Advanced }
    ];
    
    let loadedVideos = 0;
    
    videos.forEach(({ ref, src }) => {
      if (ref.current && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        
        hlsInstancesRef.current.push(hls);
        
        hls.loadSource(src);
        hls.attachMedia(ref.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Video is ready to play
          if (ref.current) {
            ref.current.play().catch(() => {
              // Autoplay might be blocked, that's ok
            });
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
            ref.current.play().catch(() => {
              // Autoplay might be blocked, that's ok
            });
          }
        });
      }
    });
    
    return () => {
      // Cleanup HLS instances
      hlsInstancesRef.current.forEach(hls => {
        hls.destroy();
      });
      hlsInstancesRef.current = [];
    };
  }, []);
  
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
      
      {/* Standard Package Video - Multi-layer camera lens blur */}
      <div className={`fixed inset-0 transition-opacity duration-500 ${
        activeVideo === 'standard' ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Main video with camera lens blur */}
        <video
          ref={standardVideoRef}
          className="fixed"
          style={{ 
            filter: 'blur(8px) brightness(0.85) contrast(1.2) saturate(1.1)',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            width: 'calc(100vw + 100px)',
            height: 'calc(var(--app-height) + 100px)',
            left: '50%',
            top: '-50px',
            transform: 'translateX(-50%) scale(1.05)'
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
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
            filter: 'blur(8px) brightness(0.85) contrast(1.2) saturate(1.1)',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            width: 'calc(100vw + 100px)',
            height: 'calc(var(--app-height) + 100px)',
            left: '50%',
            top: '-50px',
            transform: 'translateX(-50%) scale(1.05)'
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
      
      {/* Advanced Package Video - Multi-layer camera lens blur */}
      <div className={`fixed inset-0 transition-opacity duration-500 ${
        activeVideo === 'advanced' ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Main video with camera lens blur */}
        <video
          ref={advancedVideoRef}
          className="fixed"
          style={{ 
            filter: 'blur(8px) brightness(0.85) contrast(1.2) saturate(1.1)',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            width: 'calc(100vw + 100px)',
            height: 'calc(var(--app-height) + 100px)',
            left: '50%',
            top: '-50px',
            transform: 'translateX(-50%) scale(1.05)'
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
    </div>
  );
};