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
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.08] animate-ultra-massive-drift"
        style={{
          top: '-20%',
          left: '-15%',
          background: 'radial-gradient(circle, var(--blob-color-primary) 0%, transparent 70%)',
          animationDelay: '0s'
        }}
      />
      
      {/* Secondary mood blob - bottom right */}
      <div 
        className="absolute w-[700px] h-[700px] rounded-full blur-[150px] opacity-[0.06] animate-ultra-massive-breathe"
        style={{
          bottom: '-25%',
          right: '-20%',
          background: 'radial-gradient(circle, var(--blob-color-secondary) 0%, transparent 70%)',
          animationDelay: '-40s'
        }}
      />
      
      {/* Accent mood blob - center left */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.09] animate-ultra-massive-float"
        style={{
          top: '40%',
          left: '-10%',
          background: 'radial-gradient(circle, var(--blob-color-accent) 0%, transparent 70%)',
          animationDelay: '-20s'
        }}
      />
      
      {/* Large ambient blob - top right */}
      <div 
        className="absolute w-[650px] h-[650px] rounded-full blur-[130px] opacity-[0.07] animate-ultra-massive-sway"
        style={{
          top: '-10%',
          right: '-15%',
          background: 'radial-gradient(circle, var(--blob-color-primary) 0%, transparent 70%)',
          animationDelay: '-60s'
        }}
      />
      
      {/* Deep background blob - center */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[200px] opacity-[0.04] animate-ultra-massive-pulse"
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
        className="absolute w-[550px] h-[550px] rounded-full blur-[110px] opacity-[0.08] animate-ultra-massive-center"
        style={{
          bottom: '-5%',
          left: '-8%',
          background: 'radial-gradient(circle, var(--blob-color-accent) 0%, transparent 70%)',
          animationDelay: '-100s'
        }}
      />
      
    </div>
  );
};