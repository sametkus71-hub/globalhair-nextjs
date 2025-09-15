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
      {/* Animated background container */}
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 animate-pulse" />
        {/* Subtle moving overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/5 to-transparent animate-[slide-in-right_8s_ease-in-out_infinite_alternate]" />
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
      </div>
    </div>
  );
};