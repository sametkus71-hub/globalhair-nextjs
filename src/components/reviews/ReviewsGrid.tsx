import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ReviewItem {
  id: number;
  isAfter: boolean;
  beforeColor: string;
  afterColor: string;
}

const REVIEW_ITEMS: Omit<ReviewItem, 'isAfter'>[] = [
  { id: 1, beforeColor: 'bg-gray-500', afterColor: 'bg-gray-300' },
  { id: 2, beforeColor: 'bg-gray-600', afterColor: 'bg-gray-400' },
  { id: 3, beforeColor: 'bg-gray-700', afterColor: 'bg-gray-200' },
  { id: 4, beforeColor: 'bg-gray-400', afterColor: 'bg-gray-300' },
  { id: 5, beforeColor: 'bg-gray-800', afterColor: 'bg-gray-100' },
  { id: 6, beforeColor: 'bg-gray-500', afterColor: 'bg-gray-300' }
];

// Initial balanced state: 3 BEFORE, 3 AFTER
const INITIAL_STATE = [false, true, false, true, false, true]; // alternating pattern

// Animation groups that swap 1 BEFORE with 1 AFTER to maintain balance
const ANIMATION_GROUPS = [
  { beforeId: 1, afterId: 2, initialDelay: 3000, stayDuration: 18000 }, // swap top left (before) with top middle (after)
  { beforeId: 3, afterId: 4, initialDelay: 8000, stayDuration: 22000 }, // swap top right (before) with bottom left (after)  
  { beforeId: 5, afterId: 6, initialDelay: 15000, stayDuration: 16000 }, // swap bottom middle (before) with bottom right (after)
];

export const ReviewsGrid = () => {
  const [items, setItems] = useState<ReviewItem[]>(
    REVIEW_ITEMS.map((item, index) => ({ ...item, isAfter: INITIAL_STATE[index] }))
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

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    // Set up balanced swap animation groups
    ANIMATION_GROUPS.forEach((group) => {
      // Initial delay before first swap
      const initialTimer = setTimeout(() => {
        // Swap the before item to after and after item to before
        setItems(prevItems => 
          prevItems.map(prevItem => {
            if (prevItem.id === group.beforeId || prevItem.id === group.afterId) {
              return { ...prevItem, isAfter: !prevItem.isAfter };
            }
            return prevItem;
          })
        );

        // Set up continuous balanced swapping for this pair
        const cycleInterval = setInterval(() => {
          setItems(prevItems => 
            prevItems.map(prevItem => {
              if (prevItem.id === group.beforeId || prevItem.id === group.afterId) {
                return { ...prevItem, isAfter: !prevItem.isAfter };
              }
              return prevItem;
            })
          );
        }, group.stayDuration);

        intervals.push(cycleInterval);
      }, group.initialDelay);

      intervals.push(initialTimer);
    });

    return () => {
      intervals.forEach(interval => clearTimeout(interval));
    };
  }, []);

  return (
    <div className="w-full h-full p-4">
      <div 
        className="grid grid-cols-3 w-full h-full gap-0"
        style={{ 
          gridTemplateRows: '1fr 1fr', // Explicitly equal rows - 3x2 grid
          height: '100%'
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "w-full h-full transition-colors duration-[5000ms] ease-in-out relative cursor-pointer hover:opacity-90",
              "min-h-0 flex-shrink-0", // Ensure consistent height
              item.isAfter ? item.afterColor : item.beforeColor
            )}
          >
            {/* Content at bottom */}
            <div className="absolute bottom-2 left-2 text-black">
              <div className="text-sm font-medium leading-tight mb-1">
                Naam achternaam
              </div>
              <div className="text-xs opacity-70 leading-tight">
                Behandeling
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};