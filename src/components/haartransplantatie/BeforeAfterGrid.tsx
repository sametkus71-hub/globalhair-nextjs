import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { BEFORE_AFTER_IMAGES, BeforeAfterImage, getAllImagePaths } from '@/data/beforeAfterImages';
import { BeforeAfterImage as ImageComponent } from './BeforeAfterImage';
import { useImageCache } from '@/hooks/useImageCache';

interface GridItemState {
  id: number;
  isAfter: boolean;
  isVisible: boolean;
  data: BeforeAfterImage;
}

// 4x2 grid: positions 1-4 (top row - BEFORE), 5-8 (bottom row - AFTER)
const INITIAL_STATE = [false, false, false, false, true, true, true, true];

// Custom animation order: start with 6+7, then delay 600ms, then 2+3+5+8, then delay 350ms, then 1+4
const APPEARANCE_ORDER = [
  { ids: [6, 7], delay: 300 },        // Bottom center items appear first
  { ids: [2, 3, 5, 8], delay: 900 },  // Top center + bottom outer (300 + 600ms delay)
  { ids: [1, 4], delay: 1250 }        // Top outer items (900 + 350ms delay)
];

const FLIP_ORDER = [
  { ids: [6, 7], delay: 2000 },         // Wave 1: Bottom center (6-7)
  { ids: [5, 8, 2, 3], delay: 2800 },   // Wave 2: Bottom left + right, Top center (5-8-2-3) 
  { ids: [1, 4], delay: 3600 }          // Wave 3: Top corners (1-4)
];

export const BeforeAfterGrid = () => {
  // Aggressive preloading of all images
  const { allImagesLoaded, isImageLoaded } = useImageCache(getAllImagePaths());
  
  const [items, setItems] = useState<GridItemState[]>(
    BEFORE_AFTER_IMAGES.map((data, index) => ({ 
      id: data.id,
      isAfter: INITIAL_STATE[index],
      isVisible: false,
      data
    }))
  );
  
  // Add a key to force re-mount when needed
  const [gridKey, setGridKey] = useState(0);

  // Handle manual click toggles
  const handleItemClick = (clickedId: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === clickedId 
          ? { ...item, isAfter: !item.isAfter }
          : item
      )
    );
  };

  useEffect(() => {
    // Only start animations once all images are preloaded
    if (!allImagesLoaded) return;
    
    const timers: NodeJS.Timeout[] = [];

    // Appearance animation - custom order: 6+7, then 2+3+5+8, then 1+4
    APPEARANCE_ORDER.forEach((group) => {
      const timer = setTimeout(() => {
        setItems(prevItems => 
          prevItems.map(item => 
            group.ids.includes(item.id)
              ? { ...item, isVisible: true }
              : item
          )
        );
      }, group.delay);
      timers.push(timer);
    });

    // Flip animation - same order as appearance
    FLIP_ORDER.forEach((group) => {
      const timer = setTimeout(() => {
        setItems(prevItems => 
          prevItems.map(item => 
            group.ids.includes(item.id)
              ? { ...item, isAfter: !item.isAfter }
              : item
          )
        );
      }, group.delay);
      timers.push(timer);
    });

    // Continuous flip cycle every 10 seconds
    const cycleTimer = setInterval(() => {
      FLIP_ORDER.forEach((group, index) => {
        const timer = setTimeout(() => {
          setItems(prevItems => 
            prevItems.map(item => 
              group.ids.includes(item.id)
                ? { ...item, isAfter: !item.isAfter }
                : item
            )
          );
        }, index * 600); // Slightly faster wave timing for more premium feel
        timers.push(timer);
      });
    }, 10000); // 10 second cycle for more relaxed viewing

    timers.push(cycleTimer);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [allImagesLoaded]);

  return (
    <div className="w-full h-full" key={gridKey}>
      <div 
        className="grid grid-cols-4 w-full h-full gap-0"
        style={{ 
          gridTemplateRows: '1fr 1fr',
          height: '100%'
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "w-full h-full relative cursor-pointer transition-all duration-200 ease-out",
              "min-h-0 flex-shrink-0 bg-muted hover:scale-[1.02] hover:shadow-lg",
              "transform-gpu" // Use GPU acceleration for smoother animations
            )}
          >
            <ImageComponent
              src={item.isAfter ? item.data.afterImage : item.data.beforeImage}
              alt={item.isAfter ? item.data.afterAlt : item.data.beforeAlt}
              isVisible={item.isVisible}
              className="absolute inset-0"
              isPreloaded={isImageLoaded(item.isAfter ? item.data.afterImage : item.data.beforeImage)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};