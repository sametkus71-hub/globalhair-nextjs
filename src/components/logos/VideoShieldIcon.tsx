import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ShieldIcon } from './ShieldIcon';

interface VideoShieldIconProps {
  className?: string;
}

export const VideoShieldIcon = ({ className }: VideoShieldIconProps) => {
  const [videoError, setVideoError] = useState(false);

  if (videoError) {
    // Fallback to SVG if video fails to load
    return <ShieldIcon className={className} />;
  }

  return (
    <video
      className={cn("w-full h-full object-contain", className)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setVideoError(true)}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <source src="https://GlobalHair.b-cdn.net/Logo/GlobalHair_0010_v003.mp4" type="video/mp4" />
      {/* Fallback content for browsers that don't support video */}
      <ShieldIcon className={className} />
    </video>
  );
};