import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Hair texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-soft-light"
        style={{
          backgroundImage: `url(/lovable-uploads/ff5f693a-90e4-420c-bb79-6c65c660b92c.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'var(--texture-filter)',
        }}
      />

      {/* Wavy hair-like elements */}
      <div 
        className="absolute w-[400px] h-[200px] blur-[60px] opacity-25 animate-hair-wave"
        style={{
          top: '10%',
          left: '-5%',
          background: 'var(--blob-color-primary)',
          clipPath: 'ellipse(80% 40% at 50% 50%)',
          transform: 'rotate(-15deg)',
        }}
      />

      <div 
        className="absolute w-[350px] h-[180px] blur-[70px] opacity-20 animate-hair-sway"
        style={{
          bottom: '20%',
          right: '-8%',
          background: 'var(--blob-color-secondary)',
          clipPath: 'ellipse(85% 35% at 50% 50%)',
          transform: 'rotate(25deg)',
          animationDelay: '-20s'
        }}
      />

      <div 
        className="absolute w-[300px] h-[150px] blur-[80px] opacity-30 animate-follicle-pulse"
        style={{
          top: '50%',
          left: '20%',
          background: 'var(--blob-color-accent)',
          clipPath: 'ellipse(75% 45% at 50% 50%)',
          transform: 'rotate(45deg)',
          animationDelay: '-10s'
        }}
      />

      {/* Traditional circular blobs for depth */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-[80px] opacity-20 animate-float-slow"
        style={{
          top: '-10%',
          left: '-10%',
          background: 'var(--blob-color-primary)',
        }}
      />
      
      <div 
        className="absolute w-72 h-72 rounded-full blur-[90px] opacity-15 animate-float-medium"
        style={{
          bottom: '-15%',
          left: '-8%',
          background: 'var(--blob-color-secondary)',
        }}
      />
      
      <div 
        className="absolute w-96 h-96 rounded-full blur-[70px] opacity-25 animate-float-gentle"
        style={{
          top: '40%',
          right: '-12%',
          background: 'var(--blob-color-primary)',
        }}
      />

      {/* Additional smaller elements */}
      <div 
        className="absolute w-60 h-60 rounded-full blur-[100px] opacity-12 animate-float-slow"
        style={{
          top: '20%',
          left: '15%',
          background: 'var(--blob-color-accent)',
          animationDelay: '-15s'
        }}
      />

      <div 
        className="absolute w-48 h-48 rounded-full blur-[110px] opacity-10 animate-float-medium"
        style={{
          top: '70%',
          right: '25%',
          background: 'var(--blob-color-secondary)',
          animationDelay: '-30s'
        }}
      />
      
    </div>
  );
};