import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LogoWithGlass } from './LogoWithGlass';
import { useImageCache } from '@/hooks/useImageCache';

interface AnimatedLogoGifProps {
  className?: string;
}

export const AnimatedLogoGif = ({ className }: AnimatedLogoGifProps) => {
  const [gifError, setGifError] = useState(false);
  const gifUrl = "https://GlobalHair.b-cdn.net/Logo/Ontwerp%20zonder%20titel%20(3).gif";
  const { isImageLoaded } = useImageCache([gifUrl]);

  if (gifError || !isImageLoaded(gifUrl)) {
    // Show SVG fallback while loading or if GIF fails
    return <LogoWithGlass className={className} />;
  }

  return (
    <img
      src={gifUrl}
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