'use client';

import { useEffect } from 'react';

interface VideoBackgroundProps {
  className?: string;
}

export const VideoBackground = ({ className = '' }: VideoBackgroundProps) => {
  // Hydration fix for video autoplay
  useEffect(() => {
    const video = document.querySelector('video');
    if (video) {
      video.play().catch(() => { });
    }
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`} style={{ zIndex: 1 }}>
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        // @ts-ignore - Fetch Priority is a newer standard
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ width: '100vw', height: 'var(--app-height, 100vh)' }}
      >
        {/* Mobile Sources (< 768px) */}
        <source src="https://GlobalHair.b-cdn.net/Bg%20Videos/P%20-%20Basic%20BG%20V0%20compressed.webm" type="video/webm" media="(max-width: 768px)" />
        <source src="https://GlobalHair.b-cdn.net/Bg%20Videos/P%20-%20Basic%20BG%20V0.mp4" type="video/mp4" media="(max-width: 768px)" />

        {/* Desktop Sources (>= 769px) */}
        <source src="https://GlobalHair.b-cdn.net/Bg%20Videos/D%20-%20Basic%20BG%20V0%20(1).webm" type="video/webm" media="(min-width: 769px)" />
        <source src="https://GlobalHair.b-cdn.net/Bg%20Videos/D%20-%20Basic%20BG%20V0.mp4" type="video/mp4" media="(min-width: 769px)" />

        {/* Fallback for browsers that don't support media on source (rare, but defaults to desktop) */}
        <source src="https://GlobalHair.b-cdn.net/Bg%20Videos/D%20-%20Basic%20BG%20V0.mp4" type="video/mp4" />
      </video>


    </div>
  );
};