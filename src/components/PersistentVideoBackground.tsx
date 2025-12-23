import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export const PersistentVideoBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { pathname } = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  
  // Detect if we're on chat page for styling
  const isChat = pathname.endsWith('/chat') || pathname.includes('/chat');
  
  // Don't render background on admin routes
  const isAdminRoute = pathname.startsWith('/admin');

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

  // Cleanup: Pause and remove video source on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load(); // Forces browser to release video from memory
      }
    };
  }, []);

  if (!mounted || isAdminRoute) return null;

  // Custom video for V6 Hairboost page
  const isV6Page = pathname.includes('/v6-hairboost');
  
  let videoSrc = isMobile 
    ? 'https://GlobalHair.b-cdn.net/Bg%20Videos/P%20-%20Basic%20BG%20V0%20compressed.webm'
    : 'https://GlobalHair.b-cdn.net/Bg%20Videos/D%20-%20Basic%20BG%20V0.mp4';
    
  // Override for V6 page (same video for mobile and desktop for now as requested)
  if (isV6Page) {
    videoSrc = 'https://GlobalHair.b-cdn.net/Bg%20Videos/V6%20BG%20LOOP%20-%20V2.mp4';
  }
  
  const videoType = (isMobile && !isV6Page) ? 'video/webm' : 'video/mp4';

  return (
    <div 
      className="fixed inset-0 w-full h-screen overflow-hidden z-0"
      style={{
        height: '100vh',
        maxHeight: '100vh',
      }}
    >
      {/* Background video - only loads after delay */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          key={`${videoSrc}-${isMobile}`}
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
          <source src={videoSrc} type={videoType} />
        </video>
      )}
      
      {/* Gradient overlay - conditional based on chat page */}
      <div 
        className="absolute inset-0"
        style={{
          backdropFilter: isChat ? 'none' : (isMobile ? 'blur(6px)' : 'blur(1px)'),
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
