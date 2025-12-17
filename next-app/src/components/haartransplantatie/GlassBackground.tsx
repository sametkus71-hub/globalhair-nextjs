'use client';

import { useEffect, useState } from 'react';

export const GlassBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden z-0">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 1.0 }}
      >
        <source src="/assets/background-animation.mp4" type="video/mp4" />
      </video>
      
      {/* Blue-ish transparent overlay */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgb(12 35 71 / 50%)' }}
      />
      
      {/* Gradient overlay - upper half only */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(10, 37, 64, 0.6) 0%, rgba(17, 53, 86, 0.4) 25%, rgba(24, 24, 27, 0.2) 40%, transparent 50%)',
        }}
      />
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
};
