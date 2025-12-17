'use client';

import { useSession } from '@/hooks/useSession';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';

interface VideoBackgroundProps {
  className?: string;
}

export const VideoBackground = ({ className = '' }: VideoBackgroundProps) => {
  const { profile } = useSession(); // Usage kept if needed for future logic, but currently simplified
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`} style={{ zIndex: 1 }}>
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ width: '100vw', height: 'var(--app-height, 100vh)' }}
      >
        <source src="https://globalhair.b-cdn.net/Bg%20Videos/D%20-%20Basic%20BG%20V0.mp4" type="video/mp4" />
      </video>


    </div>
  );
};