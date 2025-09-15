import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LogoWithGlass } from './LogoWithGlass';

interface AnimatedLogoGifProps {
  className?: string;
}

export const AnimatedLogoGif = ({ className }: AnimatedLogoGifProps) => {
  const [gifError, setGifError] = useState(false);

  if (gifError) {
    // Fallback to SVG if GIF fails to load
    return <LogoWithGlass className={className} />;
  }

  return (
    <img
      src="https://GlobalHair.b-cdn.net/Logo/Ontwerp%20zonder%20titel%20(2).gif"
      alt="Global Hair Logo"
      className={cn("w-full h-full object-contain", className)}
      onError={() => setGifError(true)}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};