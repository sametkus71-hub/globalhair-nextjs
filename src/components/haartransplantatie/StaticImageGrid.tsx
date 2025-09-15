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
      {/* Grid container with breathing animated gradient background - 5x2 for 10 images */}
      <div 
        className="grid grid-cols-5 w-full gap-0 relative"
        style={{ 
          gridTemplateRows: 'repeat(2, 20vw)',
          background: `linear-gradient(45deg, rgba(0, 60, 83, 0.85), rgba(78, 123, 144, 0.85), rgba(0, 60, 83, 0.85), rgba(78, 123, 144, 0.85))`,
          backgroundSize: '400% 400%',
          animation: 'gradient-flow 6s ease-in-out infinite'
        }}
      >
        {shuffledImages.map((image, index) => (
          <div
            key={image.id}
            className="relative border-r border-b border-white/5 last:border-r-0 [&:nth-child(5)]:border-r-0"
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