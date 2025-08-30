import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { BEFORE_AFTER_IMAGES, BeforeAfterImage } from '@/data/beforeAfterImages';
import { BeforeAfterImage as ImageComponent } from './BeforeAfterImage';

interface GridItemState {
  id: number;
  isAfter: boolean;
  isVisible: boolean;
  data: BeforeAfterImage;
}

// 4x2 grid: positions 1-4 (top row - BEFORE), 5-8 (bottom row - AFTER)
const INITIAL_STATE = [false, false, false, false, true, true, true, true];

// Custom animation order: start with 6+7, then fast 2+3+5+8, then 1+4
const APPEARANCE_ORDER = [
  { ids: [6, 7], delay: 300 },        // Bottom center items appear first
  { ids: [2, 3, 5, 8], delay: 500 },  // Top center + bottom outer items appear fast after
  { ids: [1, 4], delay: 900 }         // Top outer items appear last
];

const FLIP_ORDER = [
  { ids: [6, 7], delay: 2000 },       // Bottom center flip first (same order as appearance)
  { ids: [2, 3, 5, 8], delay: 2200 }, // Top center + bottom outer flip fast after
  { ids: [1, 4], delay: 2600 }        // Top outer flip last
];

export const BeforeAfterGrid = () => {
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
    const timers: NodeJS.Timeout[] = [];
    
    console.log('🎬 BeforeAfterGrid: Starting animations');

    // Appearance animation - custom order: 6+7, then 2+3+5+8, then 1+4
    APPEARANCE_ORDER.forEach((group, groupIndex) => {
      const timer = setTimeout(() => {
        console.log(`✨ Appearance group ${groupIndex + 1}: showing items [${group.ids.join(', ')}]`);
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
    FLIP_ORDER.forEach((group, groupIndex) => {
      const timer = setTimeout(() => {
        console.log(`🔄 Flip group ${groupIndex + 1}: flipping items [${group.ids.join(', ')}]`);
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

    // Continuous flip cycle every 6 seconds
    const cycleTimer = setInterval(() => {
      console.log('🔄 Starting flip cycle');
      FLIP_ORDER.forEach((group, index) => {
        const timer = setTimeout(() => {
          setItems(prevItems => 
            prevItems.map(item => 
              group.ids.includes(item.id)
                ? { ...item, isAfter: !item.isAfter }
                : item
            )
          );
        }, index * 200); // Faster cycling between groups
        timers.push(timer);
      });
    }, 6000);

    timers.push(cycleTimer);

    return () => {
      console.log('🧹 BeforeAfterGrid: Cleaning up timers');
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []); // Empty dependency array to run only once

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
              "w-full h-full relative cursor-pointer hover:opacity-90 transition-opacity duration-300",
              "min-h-0 flex-shrink-0 bg-muted"
            )}
          >
            <ImageComponent
              src={item.isAfter ? item.data.afterImage : item.data.beforeImage}
              alt={item.isAfter ? item.data.afterAlt : item.data.beforeAlt}
              isVisible={item.isVisible}
              className="absolute inset-0"
            />
            
            {/* Label overlay */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded font-mono pointer-events-none backdrop-blur-sm">
              {item.isAfter ? "AFTER" : "BEFORE"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};