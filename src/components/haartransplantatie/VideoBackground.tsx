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
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ zIndex: -10 }}>
      {/* Fallback background during loading */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 transition-colors duration-500"
          style={{ backgroundColor: getFallbackColor(), zIndex: -10 }}
        />
      )}
      
      {/* Standard Package Video */}
      <video
        ref={standardVideoRef}
        className={`absolute w-full h-full transition-opacity duration-500 ${
          activeVideo === 'standard' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          filter: 'blur(3px)',
          objectFit: 'cover',
          objectPosition: 'center bottom',
          zIndex: -9,
          left: 0,
          right: 0,
          bottom: 0,
          top: 0
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      
      {/* Premium Package Video */}
      <video
        ref={premiumVideoRef}
        className={`absolute w-full h-full transition-opacity duration-500 ${
          activeVideo === 'premium' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          filter: 'blur(3px)',
          objectFit: 'cover',
          objectPosition: 'center bottom',
          zIndex: -8,
          left: 0,
          right: 0,
          bottom: 0,
          top: 0
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      
      {/* Advanced Package Video */}
      <video
        ref={advancedVideoRef}
        className={`absolute w-full h-full transition-opacity duration-500 ${
          activeVideo === 'advanced' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          filter: 'blur(3px)',
          objectFit: 'cover',
          objectPosition: 'center bottom',
          zIndex: -7,
          left: 0,
          right: 0,
          bottom: 0,
          top: 0
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