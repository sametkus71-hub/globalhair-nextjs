import { useState } from 'react';
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

// Create 10 items for 5x2 grid - reuse first 2 items for positions 9 and 10
const EXTENDED_IMAGES = [
  ...BEFORE_AFTER_IMAGES,
  { ...BEFORE_AFTER_IMAGES[0], id: 9, patientId: "patient-001-alt" },
  { ...BEFORE_AFTER_IMAGES[1], id: 10, patientId: "patient-002-alt" }
];

export const BeforeAfterGrid = () => {
  // Aggressive preloading of all images
  const { allImagesLoaded, isImageLoaded } = useImageCache(getAllImagePaths());
  
  const [items, setItems] = useState<GridItemState[]>(
    EXTENDED_IMAGES.map((data) => ({ 
      id: data.id,
      isAfter: true, // Always show after images by default
      isVisible: true, // Always visible, no animations
      data
    }))
  );

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

  return (
    <div className="w-full h-3/4">
      <div 
        className="grid grid-cols-5 w-full h-full gap-0"
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
              "w-full aspect-square relative cursor-pointer",
              "flex-shrink-0 bg-muted"
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