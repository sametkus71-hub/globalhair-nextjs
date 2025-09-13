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
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string | null>(null);
  
  const shouldShowVideo = hasVideo && title === "HAAR TRANSPLANTATIE" && profile.geslacht === "Man";
  const baseDarkness = variation?.baseDarkness || 0.5;

  // Initialize and change video sources seamlessly
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldShowVideo || !videoSrc) {
      setCurrentVideoSrc(null);
      return;
    }

    // First time initialization
    if (!currentVideoSrc) {
      console.log('🎥 Initial video setup:', videoSrc);
      setCurrentVideoSrc(videoSrc);
      
      if (videoSrc.includes('.m3u8')) {
        if (Hls.isSupported()) {
          hlsRef.current = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            startLevel: -1,
          });
          
          hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('🎬 HLS manifest parsed, starting playback');
            video.play().catch(() => console.log('Autoplay prevented'));
          });
          
          hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data);
          });
          
          hlsRef.current.loadSource(videoSrc);
          hlsRef.current.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = videoSrc;
          video.addEventListener('loadedmetadata', () => {
            video.play().catch(() => console.log('Autoplay prevented'));
          });
        }
      } else {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(() => console.log('Autoplay prevented'));
        });
      }
      return;
    }

    // Seamless source change for existing video
    if (videoSrc !== currentVideoSrc) {
      console.log('🔄 Instant source change from', currentVideoSrc, 'to', videoSrc);
      
      if (videoSrc.includes('.m3u8') && hlsRef.current) {
        // Use HLS loadSource for seamless transition
        hlsRef.current.loadSource(videoSrc);
        
        // Update state immediately when manifest is parsed
        const onManifestParsed = () => {
          console.log('🎬 New source loaded, resuming playback');
          video.play().catch(() => console.log('Autoplay prevented during transition'));
          setCurrentVideoSrc(videoSrc);
          hlsRef.current?.off(Hls.Events.MANIFEST_PARSED, onManifestParsed);
        };
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, onManifestParsed);
      } else {
        // For non-HLS, update immediately after metadata loads
        video.src = videoSrc;
        const onLoadedMetadata = () => {
          video.play().catch(() => {});
          setCurrentVideoSrc(videoSrc);
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.load();
      }
    }
  }, [shouldShowVideo, videoSrc, currentVideoSrc]);

  // Cleanup HLS on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  // Handle document visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;
      
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
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
      {/* Single Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        loop
        preload="metadata"
      />

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
        <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-light tracking-[0.2em] uppercase font-bold text-center leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
};