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
    <img
      src="https://GlobalHair.b-cdn.net/Logo/Ontwerp%20zonder%20titel%20(2).gif"
      alt="Global Hair Logo"
      className={cn("w-full h-full object-contain scale-[0.7]", className)}
      onError={() => setVideoError(true)}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};