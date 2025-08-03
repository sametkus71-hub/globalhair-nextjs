import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Depth of field hair texture - very subtle movement */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-multiply animate-depth-shift"
        style={{
          backgroundImage: `url(/lovable-uploads/c116d5dd-12bd-4f88-ba77-a5affdd4cdfa.png)`,
          backgroundSize: '120% 120%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'var(--texture-filter) blur(1px)',
        }}
      />

      {/* Main hair texture overlay */}
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

      {/* Flowing hair strands - more realistic */}
      <div 
        className="absolute w-[500px] h-[120px] blur-[50px] opacity-25 animate-hair-flow"
        style={{
          top: '15%',
          left: '-8%',
          background: 'linear-gradient(45deg, var(--blob-color-primary), transparent 70%)',
          clipPath: 'ellipse(90% 30% at 50% 50%)',
          transform: 'rotate(-10deg)',
        }}
      />

      <div 
        className="absolute w-[400px] h-[100px] blur-[60px] opacity-20 animate-hair-undulate"
        style={{
          bottom: '25%',
          right: '-10%',
          background: 'linear-gradient(-45deg, var(--blob-color-secondary), transparent 60%)',
          clipPath: 'ellipse(85% 25% at 50% 50%)',
          transform: 'rotate(20deg)',
          animationDelay: '-15s'
        }}
      />

      <div 
        className="absolute w-[350px] h-[80px] blur-[70px] opacity-30 animate-hair-drift"
        style={{
          top: '60%',
          left: '10%',
          background: 'linear-gradient(60deg, var(--blob-color-accent), transparent 80%)',
          clipPath: 'ellipse(80% 20% at 50% 50%)',
          transform: 'rotate(35deg)',
          animationDelay: '-8s'
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