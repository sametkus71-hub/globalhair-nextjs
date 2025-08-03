import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large atmospheric blobs - barely visible but mood-setting */}
      
      {/* Primary mood blob - top left */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-20 animate-ultra-massive-drift"
        style={{
          top: '5%',
          left: '5%',
          background: 'radial-gradient(circle, var(--blob-color-primary) 0%, transparent 70%)',
          animationDelay: '0s'
        }}
      />
      
      {/* Secondary mood blob - bottom right */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[90px] opacity-15 animate-ultra-massive-breathe"
        style={{
          bottom: '5%',
          right: '5%',
          background: 'radial-gradient(circle, var(--blob-color-secondary) 0%, transparent 70%)',
          animationDelay: '-40s'
        }}
      />
      
      {/* Accent mood blob - center left */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[70px] opacity-25 animate-ultra-massive-float"
        style={{
          top: '60%',
          left: '10%',
          background: 'radial-gradient(circle, var(--blob-color-accent) 0%, transparent 70%)',
          animationDelay: '-20s'
        }}
      />
      
      {/* Large ambient blob - top right */}
      <div 
        className="absolute w-[550px] h-[550px] rounded-full blur-[85px] opacity-18 animate-ultra-massive-sway"
        style={{
          top: '10%',
          right: '10%',
          background: 'radial-gradient(circle, var(--blob-color-primary) 0%, transparent 70%)',
          animationDelay: '-60s'
        }}
      />
      
      {/* Deep background blob - center */}
      <div 
        className="absolute w-[700px] h-[700px] rounded-full blur-[100px] opacity-12 animate-ultra-massive-pulse"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, var(--blob-color-secondary) 0%, transparent 60%)',
          animationDelay: '-80s'
        }}
      />
      
      {/* Subtle overlay blob - bottom left */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full blur-[75px] opacity-22 animate-ultra-massive-center"
        style={{
          bottom: '15%',
          left: '15%',
          background: 'radial-gradient(circle, var(--blob-color-accent) 0%, transparent 70%)',
          animationDelay: '-100s'
        }}
      />
      
    </div>
  );
};