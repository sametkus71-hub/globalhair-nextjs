import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Far background hair texture - more visible but subtle */}
      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-soft-light animate-bg-wave"
        style={{
          backgroundImage: `url(/lovable-uploads/36b7add7-c0c6-4b53-a0bd-41854d1270e7.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'var(--texture-filter) blur(2px)',
        }}
      />

      {/* Subtle hair wave elements */}
      <div 
        className="absolute w-[400px] h-[150px] blur-[60px] opacity-12 animate-hair-wave-subtle"
        style={{
          top: '20%',
          left: '-5%',
          background: 'linear-gradient(45deg, var(--blob-color-primary), transparent)',
          clipPath: 'ellipse(90% 40% at 50% 50%)',
          transform: 'rotate(-12deg)',
        }}
      />

      <div 
        className="absolute w-[350px] h-[120px] blur-[70px] opacity-10 animate-hair-sway-gentle"
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
        className="absolute w-[300px] h-[100px] blur-[80px] opacity-15 animate-hair-flow-soft"
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
        className="absolute w-60 h-60 rounded-full blur-[100px] opacity-8 animate-float-slow"
        style={{
          top: '10%',
          right: '20%',
          background: 'var(--blob-color-primary)',
          animationDelay: '-15s'
        }}
      />

      <div 
        className="absolute w-48 h-48 rounded-full blur-[120px] opacity-6 animate-float-gentle"
        style={{
          bottom: '15%',
          left: '25%',
          background: 'var(--blob-color-accent)',
          animationDelay: '-30s'
        }}
      />
      
      {/* Far background blobs with heavy blur - ultra subtle */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[200px] opacity-5 animate-ultra-slow"
        style={{
          top: '-20%',
          left: '-20%',
          background: 'var(--blob-color-primary)',
          animationDelay: '0s'
        }}
      />

      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[200px] opacity-4 animate-ultra-drift"
        style={{
          bottom: '-15%',
          right: '-15%',
          background: 'var(--blob-color-secondary)',
          animationDelay: '-40s'
        }}
      />

      <div 
        className="absolute w-[700px] h-[700px] rounded-full blur-[200px] opacity-6 animate-ultra-gentle"
        style={{
          top: '30%',
          right: '-25%',
          background: 'var(--blob-color-accent)',
          animationDelay: '-20s'
        }}
      />

      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[200px] opacity-3 animate-ultra-float"
        style={{
          bottom: '40%',
          left: '-10%',
          background: 'var(--blob-color-primary)',
          animationDelay: '-60s'
        }}
      />

      <div 
        className="absolute w-[550px] h-[550px] rounded-full blur-[200px] opacity-4 animate-ultra-sway"
        style={{
          top: '60%',
          left: '70%',
          background: 'var(--blob-color-secondary)',
          animationDelay: '-80s'
        }}
      />
      
    </div>
  );
};