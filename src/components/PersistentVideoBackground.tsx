import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export const PersistentVideoBackground = () => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  
  // Don't show video on chat pages
  const isChat = pathname.endsWith('/chat') || pathname.includes('/chat');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isChat) return null;

  const videoSrc = isMobile
    ? 'https://GlobalHair.b-cdn.net/Bg%20Videos/S3.mp4'
    : 'https://GlobalHair.b-cdn.net/Bg%20Videos/Horizontaal%20blue_1%20V2%20MP4.mp4';

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden z-0">
      {/* Background video */}
      <video
        key={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 1.0 }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      
      {/* Blue-ish transparent overlay */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgb(12 35 71 / 50%)' }}
      />
      
      {/* Gradient overlay - upper half only */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(10, 37, 64, 0.6) 0%, rgba(17, 53, 86, 0.4) 25%, rgba(24, 24, 27, 0.2) 40%, transparent 50%)',
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
