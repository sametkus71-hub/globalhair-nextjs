import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Darker gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1f2f3f 0%, #0a121b 60%, #050a0d 100%)'
        }}
      />
      
      {/* Blob 1 - Top Left (bigger) */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '400px',
          height: '400px',
          top: '5%',
          left: '5%',
          backgroundColor: 'var(--blob-color-primary)',
          filter: 'blur(35px)',
          animation: 'blob-float-subtle 15s ease-in-out infinite',
          opacity: 0.8
        }}
      />
      
      {/* Blob 2 - Bottom Left */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '280px',
          height: '280px',
          bottom: '10%',
          left: '8%',
          backgroundColor: 'var(--blob-color-secondary)',
          filter: 'blur(30px)',
          animation: 'blob-float-subtle 18s ease-in-out infinite reverse',
          opacity: 0.7
        }}
      />
      
      {/* Blob 3 - Center */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '320px',
          height: '320px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--blob-color-accent)',
          filter: 'blur(32px)',
          animation: 'blob-float-subtle 20s ease-in-out infinite',
          opacity: 0.6
        }}
      />
      
      {/* Blob 4 - High blur atmospheric blob */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '500px',
          height: '500px',
          top: '30%',
          right: '10%',
          backgroundColor: 'var(--blob-color-primary)',
          filter: 'blur(80px)',
          animation: 'blob-float-subtle 25s ease-in-out infinite',
          opacity: 0.3
        }}
      />
    </div>
  );
};