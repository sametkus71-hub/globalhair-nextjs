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
      
      {/* Blob 1 - Top Left (partially off-screen) */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '350px',
          height: '350px',
          top: '-10%',
          left: '-8%',
          backgroundColor: 'var(--blob-color-primary)',
          filter: 'blur(40px)',
          animation: 'blob-float-with-blur 45s ease-in-out infinite',
          opacity: 0.3,
          transition: 'background-color 2s ease-in-out'
        }}
      />
      
      {/* Blob 2 - Bottom Right (partially off-screen) */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '280px',
          height: '280px',
          bottom: '-5%',
          right: '-10%',
          backgroundColor: 'var(--blob-color-secondary)',
          filter: 'blur(35px)',
          animation: 'blob-float-with-blur 55s ease-in-out infinite reverse',
          opacity: 0.25,
          transition: 'background-color 2s ease-in-out'
        }}
      />
      
      {/* Blob 3 - Center (subtle) */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '250px',
          height: '250px',
          top: '60%',
          left: '70%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--blob-color-accent)',
          filter: 'blur(45px)',
          animation: 'blob-float-with-blur 65s ease-in-out infinite 10s',
          opacity: 0.2,
          transition: 'background-color 2s ease-in-out'
        }}
      />
      
      {/* Blob 4 - Large atmospheric blob (very subtle, off-screen) */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '600px',
          height: '600px',
          top: '20%',
          right: '-20%',
          backgroundColor: 'var(--blob-color-primary)',
          filter: 'blur(100px)',
          animation: 'blob-float-with-blur 80s ease-in-out infinite 20s',
          opacity: 0.15,
          transition: 'background-color 2s ease-in-out'
        }}
      />
    </div>
  );
};