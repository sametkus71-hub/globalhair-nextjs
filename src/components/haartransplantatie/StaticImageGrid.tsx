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
      {/* Fixed solid gradient animated background */}
      <div 
        className="absolute inset-0 animate-gradient-flow"
        style={{
          background: `linear-gradient(135deg, 
            hsl(var(--primary) / 0.15), 
            hsl(var(--secondary) / 0.12), 
            hsl(var(--accent) / 0.10), 
            hsl(var(--primary-glow) / 0.08)
          )`
        }}
      />
      
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
            className="relative p-0.5"
            style={{ 
              width: '20vw',
              height: '20vw'
            }}
          >
            {/* Image with subtle border */}
            <div className="w-full h-full border border-white/20 rounded-sm overflow-hidden bg-background/5">
              <StaticGridImage
                src={image.src}
                alt={image.alt}
                animationDelay={index * 100}
                className="w-full h-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};