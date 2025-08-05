import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GridItem {
  id: number;
  isAfter: boolean;
  delay: number;
  beforeColor: string;
  afterColor: string;
}

const GRID_ITEMS: Omit<GridItem, 'isAfter'>[] = [
  { id: 1, delay: 2500, beforeColor: 'bg-gray-500', afterColor: 'bg-gray-300' },
  { id: 2, delay: 1800, beforeColor: 'bg-gray-600', afterColor: 'bg-gray-400' },
  { id: 3, delay: 4200, beforeColor: 'bg-gray-700', afterColor: 'bg-gray-200' },
  { id: 4, delay: 3100, beforeColor: 'bg-gray-400', afterColor: 'bg-gray-300' },
  { id: 5, delay: 1400, beforeColor: 'bg-gray-800', afterColor: 'bg-gray-100' },
  { id: 6, delay: 3800, beforeColor: 'bg-gray-500', afterColor: 'bg-gray-300' }
];

export const BeforeAfterGrid = () => {
  const [items, setItems] = useState<GridItem[]>(
    GRID_ITEMS.map(item => ({ ...item, isAfter: false }))
  );

  useEffect(() => {
    // Set up staggered timers for masonry-like effect
    const timers = items.map((item) => {
      return setTimeout(() => {
        setItems(prevItems => 
          prevItems.map(prevItem => 
            prevItem.id === item.id 
              ? { ...prevItem, isAfter: true }
              : prevItem
          )
        );
      }, item.delay);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-3 grid-rows-2 w-full h-full">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "w-full h-full transition-colors duration-1000",
              item.isAfter ? item.afterColor : item.beforeColor
            )}
          />
        ))}
      </div>
    </div>
  );
};