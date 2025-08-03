import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Far background hair texture with wavy effect - more visible */}
      <div 
        className="absolute inset-0 opacity-[0.08] mix-blend-multiply animate-bg-wave"
        style={{
          backgroundImage: `url(/lovable-uploads/36b7add7-c0c6-4b53-a0bd-41854d1270e7.png)`,
          backgroundSize: '150% 150%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'var(--texture-filter) blur(3px)',
        }}
      />

      {/* Depth of field hair texture - very subtle movement */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light animate-depth-shift"
        style={{
          backgroundImage: `url(/lovable-uploads/c116d5dd-12bd-4f88-ba77-a5affdd4cdfa.png)`,
          backgroundSize: '120% 120%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'var(--texture-filter) blur(1px)',
        }}
      />

      {/* Individual hair strands - more realistic */}
      <div 
        className="absolute w-[600px] h-[60px] blur-[40px] opacity-30 animate-hair-strand-1"
        style={{
          top: '12%',
          left: '-10%',
          background: 'linear-gradient(90deg, var(--blob-color-primary) 0%, var(--blob-color-primary) 40%, transparent 100%)',
          clipPath: 'polygon(0% 40%, 5% 20%, 15% 45%, 25% 15%, 35% 50%, 45% 25%, 55% 45%, 65% 20%, 75% 55%, 85% 30%, 95% 50%, 100% 35%, 100% 65%, 0% 60%)',
          transform: 'rotate(-8deg)',
        }}
      />

      <div 
        className="absolute w-[550px] h-[45px] blur-[45px] opacity-25 animate-hair-strand-2"
        style={{
          top: '35%',
          right: '-12%',
          background: 'linear-gradient(-90deg, var(--blob-color-secondary) 0%, var(--blob-color-secondary) 35%, transparent 100%)',
          clipPath: 'polygon(0% 30%, 10% 55%, 20% 25%, 30% 60%, 40% 20%, 50% 50%, 60% 15%, 70% 55%, 80% 25%, 90% 45%, 100% 35%, 100% 65%, 0% 70%)',
          transform: 'rotate(15deg)',
          animationDelay: '-12s'
        }}
      />

      <div 
        className="absolute w-[480px] h-[35px] blur-[50px] opacity-35 animate-hair-strand-3"
        style={{
          bottom: '20%',
          left: '5%',
          background: 'linear-gradient(45deg, var(--blob-color-accent) 0%, var(--blob-color-accent) 50%, transparent 100%)',
          clipPath: 'polygon(0% 45%, 8% 20%, 18% 55%, 28% 15%, 38% 60%, 48% 25%, 58% 50%, 68% 20%, 78% 55%, 88% 30%, 98% 45%, 100% 40%, 100% 60%, 0% 55%)',
          transform: 'rotate(-25deg)',
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