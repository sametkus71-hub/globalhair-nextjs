import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GRID_IMAGES, getAllImagePaths, shuffleArray } from '@/data/gridImages';
import { StaticGridImage } from './StaticGridImage';
import { useImageCache } from '@/hooks/useImageCache';

export const StaticImageGrid = () => {
  // Preload all images
  const { allImagesLoaded } = useImageCache(getAllImagePaths());
  
  const [shuffledImages, setShuffledImages] = useState(() => shuffleArray(GRID_IMAGES));

  // Reshuffle on mount to ensure different order each time
  useEffect(() => {
    setShuffledImages(shuffleArray(GRID_IMAGES));
  }, []);

  return (
    <div className="w-full relative">
      {/* Animated background container */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/10 to-secondary/5" />
      
      {/* Grid container - 5x3 for 13 images (2 empty slots) */}
      <div 
        className="grid grid-cols-5 w-full gap-0 relative z-10"
        style={{ 
          gridTemplateRows: 'repeat(3, 20vw)'
        }}
      >
        {/* First 10 items (2 rows of 5) */}
        {shuffledImages.slice(0, 10).map((image, index) => (
          <div
            key={image.id}
            className="relative"
            style={{ 
              width: '20vw',
              height: '20vw'
            }}
          >
            <StaticGridImage
              src={image.src}
              alt={image.alt}
              animationDelay={index * 100}
              className="w-full h-full"
            />
          </div>
        ))}
        
        {/* Third row - 3 images centered with 1 empty slot on each side */}
        <div className="relative opacity-0" /> {/* Empty slot */}
        {shuffledImages.slice(10, 13).map((image, index) => (
          <div
            key={image.id}
            className="relative"
            style={{ 
              width: '20vw',
              height: '20vw'
            }}
          >
            <StaticGridImage
              src={image.src}
              alt={image.alt}
              animationDelay={(10 + index) * 100}
              className="w-full h-full"
            />
          </div>
        ))}
        <div className="relative opacity-0" /> {/* Empty slot */}
      </div>
    </div>
  );
};