import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const PersistentVideoBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { pathname } = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Detect if we're on chat page for styling
  const isChat = pathname.endsWith('/chat') || pathname.includes('/chat');

  useEffect(() => {
    setMounted(true);
    
    // Load video much faster for immediate playback
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (shouldLoadVideo && videoRef.current && !videoLoaded) {
      // Start loading and playing the video
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, that's ok
      });
      setVideoLoaded(true);
    }
  }, [shouldLoadVideo, videoLoaded]);

  if (!mounted) return null;

  const videoSrc = 'https://GlobalHair.b-cdn.net/pakketten%20bg%20vid/D%20-%20Basic%20BG%20V0.mp4';

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden z-0">
      {/* Background video - only loads after delay */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          key={videoSrc}
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            opacity: 1.0,
            filter: isChat ? 'blur(40px)' : 'none',
            transform: isChat ? 'scale(1.1)' : 'scale(1.0)',
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
      
      {/* Gradient overlay - conditional based on chat page */}
      <div 
        className="absolute inset-0"
        style={{
          background: isChat 
            ? 'linear-gradient(180deg, rgba(4, 14, 21, 0.80) 0%, rgba(51, 61, 70, 0.85) 100%)'
            : 'linear-gradient(rgba(10, 37, 64, 0.6) 10%, rgba(17, 53, 86, 0.4) 25%, rgba(24, 24, 27, 0.2) 40%, transparent 70%)',
          backdropFilter: isChat ? 'none' : 'blur(6px)',
        }}
      />
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
};
