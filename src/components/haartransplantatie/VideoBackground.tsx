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
    Standard: 'https://vz-104aba77-1e1.b-cdn.net/daaa1c28-4f86-4ddf-8b04-751b69ff1de5/playlist.m3u8',
    Premium: 'https://vz-104aba77-1e1.b-cdn.net/6b07484c-4e59-4bf3-af4a-709d75c6c45a/playlist.m3u8',
    Advanced: 'https://vz-104aba77-1e1.b-cdn.net/7c5056c5-8d47-47a2-9b7b-6fcc6f9fde1f/playlist.m3u8'
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
        {/* Background layer - Heavy blur */}
        <video
          ref={standardVideoRef}
          className="fixed"
          style={{ 
            filter: 'blur(12px) brightness(0.9) contrast(1.15) saturate(1.3) sepia(0.05) hue-rotate(2deg)',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            width: 'calc(100vw + 120px)',
            height: 'calc(100vh + 120px)',
            left: '50%',
            top: '-60px',
            transform: 'translateX(-50%) scale(1.08)',
            opacity: 0.7
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* Mid layer - Medium blur */}
        <video
          className="fixed"
          style={{ 
            filter: 'blur(6px) brightness(0.95) contrast(1.1) saturate(1.2) sepia(0.02)',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 2,
            width: 'calc(100vw + 100px)',
            height: 'calc(100vh + 100px)',
            left: '50%',
            top: '-50px',
            transform: 'translateX(-50%) scale(1.05)',
            opacity: 0.8,
            maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
          }}
          src={standardVideoRef.current?.src}
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
        {/* Background layer - Heavy blur */}
        <video
          ref={premiumVideoRef}
          className="fixed"
          style={{ 
            filter: 'blur(12px) brightness(0.9) contrast(1.15) saturate(1.3) sepia(0.05) hue-rotate(2deg)',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            width: 'calc(100vw + 120px)',
            height: 'calc(100vh + 120px)',
            left: '50%',
            top: '-60px',
            transform: 'translateX(-50%) scale(1.08)',
            opacity: 0.7
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* Mid layer - Medium blur */}
        <video
          className="fixed"
          style={{ 
            filter: 'blur(6px) brightness(0.95) contrast(1.1) saturate(1.2) sepia(0.02)',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 2,
            width: 'calc(100vw + 100px)',
            height: 'calc(100vh + 100px)',
            left: '50%',
            top: '-50px',
            transform: 'translateX(-50%) scale(1.05)',
            opacity: 0.8,
            maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
          }}
          src={premiumVideoRef.current?.src}
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
        {/* Background layer - Heavy blur */}
        <video
          ref={advancedVideoRef}
          className="fixed"
          style={{ 
            filter: 'blur(12px) brightness(0.9) contrast(1.15) saturate(1.3) sepia(0.05) hue-rotate(2deg)',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 1,
            width: 'calc(100vw + 120px)',
            height: 'calc(100vh + 120px)',
            left: '50%',
            top: '-60px',
            transform: 'translateX(-50%) scale(1.08)',
            opacity: 0.7
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* Mid layer - Medium blur */}
        <video
          className="fixed"
          style={{ 
            filter: 'blur(6px) brightness(0.95) contrast(1.1) saturate(1.2) sepia(0.02)',
            objectFit: 'cover',
            objectPosition: 'center center',
            zIndex: 2,
            width: 'calc(100vw + 100px)',
            height: 'calc(100vh + 100px)',
            left: '50%',
            top: '-50px',
            transform: 'translateX(-50%) scale(1.05)',
            opacity: 0.8,
            maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
          }}
          src={advancedVideoRef.current?.src}
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