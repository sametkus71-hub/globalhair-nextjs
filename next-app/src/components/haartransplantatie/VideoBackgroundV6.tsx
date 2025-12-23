'use client';

import { useEffect } from 'react';

interface VideoBackgroundV6Props {
  className?: string;
}

export const VideoBackgroundV6 = ({ className = '' }: VideoBackgroundV6Props) => {
  // Hydration fix for video autoplay
  useEffect(() => {
    const video = document.querySelector('video.v6-bg-video');
    if (video) {
      video.play().catch(() => { });
    }
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`} style={{ zIndex: 1 }}>
      {/* V6 Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        // @ts-ignore - Fetch Priority is a newer standard
        fetchPriority="high"
        className="v6-bg-video absolute inset-0 w-full h-full object-cover"
        style={{ width: '100vw', height: 'var(--app-height, 100vh)' }}
      >
        {/* V6 Background Video - same for mobile and desktop */}
        <source src="https://GlobalHair.b-cdn.net/Bg%20Videos/V6%20BG%20LOOP%20-%20V2.mp4" type="video/mp4" />
      </video>

      {/* Backdrop filter overlay */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backdropFilter: 'blur(0px) brightness(0.7)',
          WebkitBackdropFilter: 'blur(0px) brightness(0.7)',
        }} 
      />
    </div>
  );
};
