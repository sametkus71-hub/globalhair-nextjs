import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GridItem {
  id: number;
  isAfter: boolean;
  initialDelay: number;
  cycleDelay: number;
  stayDuration: number;
  beforeColor: string;
  afterColor: string;
}

const GRID_ITEMS: Omit<GridItem, 'isAfter'>[] = [
  { id: 1, initialDelay: 2500, cycleDelay: 15000, stayDuration: 8000, beforeColor: 'bg-gray-500', afterColor: 'bg-gray-300' },
  { id: 2, initialDelay: 1800, cycleDelay: 18000, stayDuration: 12000, beforeColor: 'bg-gray-600', afterColor: 'bg-gray-400' },
  { id: 3, initialDelay: 4200, cycleDelay: 22000, stayDuration: 9000, beforeColor: 'bg-gray-700', afterColor: 'bg-gray-200' },
  { id: 4, initialDelay: 3100, cycleDelay: 16000, stayDuration: 11000, beforeColor: 'bg-gray-400', afterColor: 'bg-gray-300' },
  { id: 5, initialDelay: 1400, cycleDelay: 20000, stayDuration: 7000, beforeColor: 'bg-gray-800', afterColor: 'bg-gray-100' },
  { id: 6, initialDelay: 3800, cycleDelay: 19000, stayDuration: 10000, beforeColor: 'bg-gray-500', afterColor: 'bg-gray-300' }
];

export const BeforeAfterGrid = () => {
  const [items, setItems] = useState<GridItem[]>(
    GRID_ITEMS.map(item => ({ ...item, isAfter: false }))
  );

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    // Set up cycling behavior for each item
    items.forEach((item) => {
      // Initial delay before first change
      const initialTimer = setTimeout(() => {
        // Toggle to after state
        setItems(prevItems => 
          prevItems.map(prevItem => 
            prevItem.id === item.id 
              ? { ...prevItem, isAfter: true }
              : prevItem
          )
        );

        // Set up continuous cycling
        const cycleInterval = setInterval(() => {
          setItems(prevItems => 
            prevItems.map(prevItem => 
              prevItem.id === item.id 
                ? { ...prevItem, isAfter: !prevItem.isAfter }
                : prevItem
            )
          );
        }, item.stayDuration);

        intervals.push(cycleInterval);
      }, item.initialDelay);

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
              "w-full h-full transition-colors duration-[4000ms] ease-in-out",
              item.isAfter ? item.afterColor : item.beforeColor
            )}
          />
        ))}
      </div>
    </div>
  );
};