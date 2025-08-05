import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GridItem {
  id: number;
  isAfter: boolean;
  beforeColor: string;
  afterColor: string;
}

const GRID_ITEMS: Omit<GridItem, 'isAfter'>[] = [
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

export const BeforeAfterGrid = () => {
  const [items, setItems] = useState<GridItem[]>(
    GRID_ITEMS.map((item, index) => ({ ...item, isAfter: INITIAL_STATE[index] }))
  );

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
    <div className="w-full h-full">
      <div className="grid grid-cols-3 grid-rows-2 w-full h-full">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "w-full h-full transition-colors duration-[5000ms] ease-in-out relative",
              item.isAfter ? item.afterColor : item.beforeColor
            )}
          >
            {/* Subtle label */}
            <div className="absolute top-2 left-2 text-xs text-black/30 font-mono">
              {item.isAfter ? "AFTER" : "BEFORE"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};