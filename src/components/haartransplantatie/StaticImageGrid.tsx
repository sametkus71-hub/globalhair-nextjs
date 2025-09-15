import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GRID_IMAGES, getAllImagePaths, shuffleArray } from '@/data/gridImages';
import { StaticGridImage } from './StaticGridImage';
import { useImageCache } from '@/hooks/useImageCache';

export const StaticImageGrid = () => {
  // Preload all images
  const { allImagesLoaded } = useImageCache(getAllImagePaths());
  
  const [shuffledImages, setShuffledImages] = useState(() => {
    // Randomly select 10 images from the 13 available
    const shuffled = shuffleArray(GRID_IMAGES);
    return shuffleArray(shuffled.slice(0, 10));
  });

  // Reshuffle and reselect on mount to ensure different images and order each time
  useEffect(() => {
    const shuffled = shuffleArray(GRID_IMAGES);
    setShuffledImages(shuffleArray(shuffled.slice(0, 10)));
  }, []);

  return (
    <div className="w-full relative">
      {/* Multi-layered animated background system */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base layer - Rich gradient foundation */}
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.25) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, hsl(var(--secondary) / 0.20) 0%, transparent 50%),
              radial-gradient(circle at 40% 90%, hsl(var(--accent) / 0.15) 0%, transparent 50%),
              linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--secondary) / 0.08))
            `
          }}
        />
        
        {/* Flowing gradient overlay */}
        <div 
          className="absolute inset-0 opacity-60 animate-gradient-flow"
          style={{
            background: `
              linear-gradient(45deg, hsl(var(--primary) / 0.15), transparent, hsl(var(--secondary) / 0.12)),
              linear-gradient(135deg, transparent, hsl(var(--accent) / 0.10), transparent),
              linear-gradient(225deg, hsl(var(--primary-glow) / 0.08), transparent, hsl(var(--primary) / 0.12))
            `,
            backgroundSize: '150% 150%, 200% 200%, 180% 180%'
          }}
        />
        
        {/* Subtle texture overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 60% 20%, hsl(var(--foreground) / 0.03) 0%, transparent 40%),
              radial-gradient(circle at 30% 80%, hsl(var(--foreground) / 0.02) 0%, transparent 40%)
            `,
            animation: 'gradient-shift 25s ease-in-out infinite'
          }}
        />
        
        {/* Dynamic moving accent */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(var(--primary-glow) / 0.08), transparent)`,
            animation: 'slide-in-right 12s ease-in-out infinite alternate'
          }}
        />
      </div>
      
      {/* Grid container - 5x2 for 10 images */}
      <div 
        className="grid grid-cols-5 w-full gap-0 relative z-10"
        style={{ 
          gridTemplateRows: 'repeat(2, 20vw)'
        }}
      >
        {shuffledImages.map((image, index) => (
          <div
            key={image.id}
            className="relative group"
            style={{ 
              width: '20vw',
              height: '20vw'
            }}
          >
            {/* Image container with subtle styling */}
            <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] rounded-sm border border-white/10">
              <StaticGridImage
                src={image.src}
                alt={image.alt}
                animationDelay={index * 100}
                className="w-full h-full rounded-sm"
              />
            </div>
            
            {/* Subtle hover enhancement */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
};