import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Far background hair texture - very dark and subtle */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light animate-bg-wave"
        style={{
          backgroundImage: `url(/lovable-uploads/36b7add7-c0c6-4b53-a0bd-41854d1270e7.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'var(--texture-filter) blur(2px)',
        }}
      />

      {/* Subtle hair wave elements - much darker */}
      <div 
        className="absolute w-[400px] h-[150px] blur-[60px] opacity-6 animate-hair-wave-subtle"
        style={{
          top: '20%',
          left: '-5%',
          background: 'linear-gradient(45deg, var(--blob-color-primary), transparent)',
          clipPath: 'ellipse(90% 40% at 50% 50%)',
          transform: 'rotate(-12deg)',
        }}
      />

      <div 
        className="absolute w-[350px] h-[120px] blur-[70px] opacity-5 animate-hair-sway-gentle"
        style={{
          bottom: '25%',
          right: '-8%',
          background: 'linear-gradient(-60deg, var(--blob-color-secondary), transparent)',
          clipPath: 'ellipse(85% 35% at 50% 50%)',
          transform: 'rotate(18deg)',
          animationDelay: '-20s'
        }}
      />

      <div 
        className="absolute w-[300px] h-[100px] blur-[80px] opacity-7 animate-hair-flow-soft"
        style={{
          top: '60%',
          left: '15%',
          background: 'linear-gradient(30deg, var(--blob-color-accent), transparent)',
          clipPath: 'ellipse(80% 30% at 50% 50%)',
          transform: 'rotate(-25deg)',
          animationDelay: '-10s'
        }}
      />

      {/* Very subtle circular elements for depth */}
      <div 
        className="absolute w-60 h-60 rounded-full blur-[100px] opacity-4 animate-float-slow"
        style={{
          top: '10%',
          right: '20%',
          background: 'var(--blob-color-primary)',
          animationDelay: '-15s'
        }}
      />

      <div 
        className="absolute w-48 h-48 rounded-full blur-[120px] opacity-3 animate-float-gentle"
        style={{
          bottom: '15%',
          left: '25%',
          background: 'var(--blob-color-accent)',
          animationDelay: '-30s'
        }}
      />
      
      {/* Strategic blob positioning for optimal visual impact */}
      
      {/* Top Left Area - moves far out and back */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-2 animate-ultra-breathe-out"
        style={{
          top: '-60%',
          left: '-60%',
          background: 'var(--blob-color-primary)',
          animationDelay: '0s'
        }}
      />

      <div 
        className="absolute w-[350px] h-[350px] rounded-full blur-[70px] opacity-2.5 animate-ultra-breathe-in"
        style={{
          top: '-45%',
          left: '-45%',
          background: 'var(--blob-color-accent)',
          animationDelay: '-40s'
        }}
      />

      {/* Bottom Left Area - deeper movement */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full blur-[90px] opacity-1.8 animate-ultra-deep-out"
        style={{
          bottom: '-70%',
          left: '-65%',
          background: 'var(--blob-color-secondary)',
          animationDelay: '-20s'
        }}
      />

      <div 
        className="absolute w-[320px] h-[320px] rounded-full blur-[75px] opacity-2.2 animate-ultra-deep-in"
        style={{
          bottom: '-50%',
          left: '-50%',
          background: 'var(--blob-color-primary)',
          animationDelay: '-60s'
        }}
      />

      {/* Middle Right Area - flowing movement */}
      <div 
        className="absolute w-[380px] h-[380px] rounded-full blur-[85px] opacity-2 animate-ultra-flow-side"
        style={{
          top: '40%',
          right: '-55%',
          background: 'var(--blob-color-accent)',
          animationDelay: '-30s'
        }}
      />

      {/* Top Right Area - gentle breathing */}
      <div 
        className="absolute w-[360px] h-[360px] rounded-full blur-[80px] opacity-1.5 animate-ultra-gentle-drift"
        style={{
          top: '-50%',
          right: '-50%',
          background: 'var(--blob-color-secondary)',
          animationDelay: '-80s'
        }}
      />

      {/* Bottom Right Area - slow emergence */}
      <div 
        className="absolute w-[420px] h-[420px] rounded-full blur-[95px] opacity-1.8 animate-ultra-emerge"
        style={{
          bottom: '-65%',
          right: '-60%',
          background: 'var(--blob-color-primary)',
          animationDelay: '-100s'
        }}
      />
      
    </div>
  );
};