import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Beautiful, visible animated blobs that showcase the color system */}
      
      {/* Main hero blob - top center */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[60px] opacity-30 animate-ultra-massive-drift"
        style={{
          top: '-40%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, var(--blob-color-primary) 0%, var(--blob-color-secondary) 40%, transparent 70%)',
          animationDelay: '0s'
        }}
      />
      
      {/* Left accent blob */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[50px] opacity-25 animate-ultra-massive-float"
        style={{
          top: '30%',
          left: '-20%',
          background: 'radial-gradient(circle, var(--blob-color-accent) 0%, var(--blob-color-primary) 50%, transparent 80%)',
          animationDelay: '-30s'
        }}
      />
      
      {/* Right accent blob */}
      <div 
        className="absolute w-[650px] h-[650px] rounded-full blur-[55px] opacity-28 animate-ultra-massive-sway"
        style={{
          top: '20%',
          right: '-25%',
          background: 'radial-gradient(circle, var(--blob-color-secondary) 0%, var(--blob-color-accent) 45%, transparent 75%)',
          animationDelay: '-60s'
        }}
      />
      
      {/* Bottom left floating blob */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[45px] opacity-35 animate-ultra-massive-breathe"
        style={{
          bottom: '-15%',
          left: '10%',
          background: 'radial-gradient(circle, var(--blob-color-primary) 20%, var(--blob-color-accent) 60%, transparent 85%)',
          animationDelay: '-90s'
        }}
      />
      
      {/* Bottom right depth blob */}
      <div 
        className="absolute w-[700px] h-[700px] rounded-full blur-[65px] opacity-20 animate-ultra-massive-pulse"
        style={{
          bottom: '-30%',
          right: '15%',
          background: 'radial-gradient(circle, var(--blob-color-secondary) 10%, var(--blob-color-primary) 50%, transparent 80%)',
          animationDelay: '-120s'
        }}
      />
      
      {/* Center depth blob - subtle overlay */}
      <div 
        className="absolute w-[900px] h-[900px] rounded-full blur-[80px] opacity-15 animate-ultra-massive-center"
        style={{
          top: '60%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, var(--blob-color-accent) 0%, var(--blob-color-secondary) 30%, transparent 60%)',
          animationDelay: '-45s'
        }}
      />
      
    </div>
  );
};