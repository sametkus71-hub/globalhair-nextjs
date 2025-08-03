import { useEffect, useState } from 'react';
import Threads from './Threads';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* OGL Threads Layer - positioned behind blobs but above texture */}
      <div className="absolute inset-0 opacity-20 mix-blend-screen">
        <Threads
          color={[0.8, 0.9, 1.0]}
          amplitude={0.8}
          distance={0.2}
          enableMouseInteraction={true}
        />
      </div>

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
      
      {/* Massive reflective blobs - positioned way off screen but casting visible reflections */}
      
      {/* Top Left Massive Reflector */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[200px] opacity-8 animate-ultra-massive-drift"
        style={{
          top: '-85%',
          left: '-85%',
          background: 'var(--blob-color-primary)',
          animationDelay: '0s'
        }}
      />

      {/* Bottom Left Massive Reflector */}
      <div 
        className="absolute w-[900px] h-[900px] rounded-full blur-[250px] opacity-6 animate-ultra-massive-breathe"
        style={{
          bottom: '-90%',
          left: '-90%',
          background: 'var(--blob-color-secondary)',
          animationDelay: '-60s'
        }}
      />

      {/* Top Right Massive Reflector */}
      <div 
        className="absolute w-[750px] h-[750px] rounded-full blur-[180px] opacity-9 animate-ultra-massive-float"
        style={{
          top: '-80%',
          right: '-80%',
          background: 'var(--blob-color-accent)',
          animationDelay: '-30s'
        }}
      />

      {/* Bottom Right Massive Reflector */}
      <div 
        className="absolute w-[850px] h-[850px] rounded-full blur-[220px] opacity-7 animate-ultra-massive-sway"
        style={{
          bottom: '-85%',
          right: '-85%',
          background: 'var(--blob-color-primary)',
          animationDelay: '-90s'
        }}
      />

      {/* Center Left Deep Reflector */}
      <div 
        className="absolute w-[700px] h-[700px] rounded-full blur-[160px] opacity-10 animate-ultra-massive-center"
        style={{
          top: '30%',
          left: '-95%',
          background: 'var(--blob-color-secondary)',
          animationDelay: '-45s'
        }}
      />

      {/* Center Right Deep Reflector */}
      <div 
        className="absolute w-[650px] h-[650px] rounded-full blur-[170px] opacity-11 animate-ultra-massive-pulse"
        style={{
          top: '50%',
          right: '-95%',
          background: 'var(--blob-color-accent)',
          animationDelay: '-75s'
        }}
      />
      
    </div>
  );
};