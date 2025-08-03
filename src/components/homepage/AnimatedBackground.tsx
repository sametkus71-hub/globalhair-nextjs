import { useEffect, useState } from 'react';

export const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Visible animated blobs - simple and clear */}
      
      {/* Blob 1 - Top Left */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl animate-ultra-massive-drift"
        style={{
          top: '10%',
          left: '15%',
          background: 'var(--blob-color-primary)',
          opacity: 0.4,
          animationDelay: '0s'
        }}
      />
      
      {/* Blob 2 - Bottom Right */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-3xl animate-ultra-massive-breathe"
        style={{
          bottom: '15%',
          right: '20%',
          background: 'var(--blob-color-secondary)',
          opacity: 0.35,
          animationDelay: '-20s'
        }}
      />
      
      {/* Blob 3 - Center Left */}
      <div 
        className="absolute w-72 h-72 rounded-full blur-3xl animate-ultra-massive-float"
        style={{
          top: '50%',
          left: '5%',
          transform: 'translateY(-50%)',
          background: 'var(--blob-color-accent)',
          opacity: 0.3,
          animationDelay: '-40s'
        }}
      />
      
      {/* Blob 4 - Top Right */}
      <div 
        className="absolute w-64 h-64 rounded-full blur-3xl animate-ultra-massive-sway"
        style={{
          top: '20%',
          right: '10%',
          background: 'var(--blob-color-primary)',
          opacity: 0.25,
          animationDelay: '-60s'
        }}
      />
      
    </div>
  );
};