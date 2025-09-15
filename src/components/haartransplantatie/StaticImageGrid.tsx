import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GRID_IMAGES, getAllImagePaths, shuffleArray } from '@/data/gridImages';
import { StaticGridImage } from './StaticGridImage';
import { useImageCache } from '@/hooks/useImageCache';

interface StaticImageGridProps {
  selectedPackage?: string;
}

export const StaticImageGrid = ({ selectedPackage = 'Premium' }: StaticImageGridProps) => {
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

  // Get gradient colors based on selected package
  const getGradientColors = (packageType: string) => {
    switch (packageType) {
      case 'Standard':
        return 'linear-gradient(45deg, rgba(0, 56, 65, 0.5), rgba(19, 142, 142, 0.5), rgba(0, 56, 65, 0.5), rgba(19, 142, 142, 0.5))';
      case 'Premium':
        return 'linear-gradient(45deg, rgba(2, 41, 74, 0.5), rgba(63, 122, 167, 0.5), rgba(2, 41, 74, 0.5), rgba(63, 122, 167, 0.5))';
      case 'Advanced':
        return 'linear-gradient(45deg, rgba(53, 4, 13, 0.5), rgba(4, 0, 0, 0.5), rgba(53, 4, 13, 0.5), rgba(4, 0, 0, 0.5))';
      default:
        return 'linear-gradient(45deg, rgba(2, 41, 74, 0.5), rgba(63, 122, 167, 0.5), rgba(2, 41, 74, 0.5), rgba(63, 122, 167, 0.5))';
    }
  };

  return (
    <div className="w-full relative">
      {/* Grid container with breathing animated gradient background - 5x2 for 10 images */}
      <div 
        className="grid grid-cols-5 w-full gap-0 relative"
        style={{ 
          gridTemplateRows: 'repeat(2, 20vw)',
          background: getGradientColors(selectedPackage),
          backgroundSize: '400% 400%',
          animation: 'gradient-flow 6s ease-in-out infinite'
        }}
      >
        {/* Opacity gradient overlay - stronger at top, lighter at bottom */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%)'
          }}
        />
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