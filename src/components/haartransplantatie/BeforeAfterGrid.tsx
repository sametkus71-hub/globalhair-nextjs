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

// Random pairs with different timing
const ANIMATION_GROUPS = [
  { ids: [1, 5], initialDelay: 3000, stayDuration: 18000 }, // top left + bottom middle
  { ids: [3, 2], initialDelay: 8000, stayDuration: 22000 }, // top right + top middle  
  { ids: [4, 6], initialDelay: 15000, stayDuration: 16000 }, // bottom left + bottom right
];

export const BeforeAfterGrid = () => {
  const [items, setItems] = useState<GridItem[]>(
    GRID_ITEMS.map(item => ({ ...item, isAfter: false }))
  );

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    // Set up animation groups
    ANIMATION_GROUPS.forEach((group) => {
      // Initial delay before first change
      const initialTimer = setTimeout(() => {
        // Toggle the pair to after state
        setItems(prevItems => 
          prevItems.map(prevItem => 
            group.ids.includes(prevItem.id)
              ? { ...prevItem, isAfter: true }
              : prevItem
          )
        );

        // Set up continuous cycling for this pair
        const cycleInterval = setInterval(() => {
          setItems(prevItems => 
            prevItems.map(prevItem => 
              group.ids.includes(prevItem.id)
                ? { ...prevItem, isAfter: !prevItem.isAfter }
                : prevItem
            )
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
              "w-full h-full transition-colors duration-[5000ms] ease-in-out",
              item.isAfter ? item.afterColor : item.beforeColor
            )}
          />
        ))}
      </div>
    </div>
  );
};