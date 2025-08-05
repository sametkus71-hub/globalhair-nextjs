import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GridItem {
  id: number;
  isAfter: boolean;
  delay: number;
}

const GRID_ITEMS: Omit<GridItem, 'isAfter'>[] = [
  { id: 1, delay: 2500 },
  { id: 2, delay: 1800 },
  { id: 3, delay: 4200 },
  { id: 4, delay: 3100 },
  { id: 5, delay: 1400 },
  { id: 6, delay: 3800 }
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
    <div className="w-full h-full flex items-center justify-center px-8">
      <div className="grid grid-cols-3 gap-4 w-full max-w-5xl">
        {items.map((item) => (
          <div
            key={item.id}
            className="aspect-[3/4] relative"
          >
            {/* Before State - Darker Gray */}
            <div className={cn(
              "absolute inset-0 bg-gray-600 transition-opacity duration-1000",
              item.isAfter ? "opacity-0" : "opacity-100"
            )} />
            
            {/* After State - Lighter Gray */}
            <div className={cn(
              "absolute inset-0 bg-gray-400 transition-opacity duration-1000",
              item.isAfter ? "opacity-100" : "opacity-0"
            )} />
          </div>
        ))}
      </div>
    </div>
  );
};