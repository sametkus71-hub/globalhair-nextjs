import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

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
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-4xl">
        {items.map((item) => (
          <div
            key={item.id}
            className="aspect-[4/3] relative overflow-hidden rounded-lg bg-gray-800/20 backdrop-blur-sm border border-white/10"
          >
            {/* Before State */}
            <div className={cn(
              "absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-1000",
              item.isAfter ? "opacity-0" : "opacity-100"
            )}>
              <Skeleton className="w-full h-2/3 mb-3 bg-gray-600/30" />
              <div className="text-center">
                <p className="text-xs font-medium text-white/80 mb-1">BEFORE</p>
                <p className="text-xs text-white/60">#{item.id}</p>
              </div>
            </div>
            
            {/* After State */}
            <div className={cn(
              "absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-1000",
              item.isAfter ? "opacity-100" : "opacity-0"
            )}>
              <Skeleton className="w-full h-2/3 mb-3 bg-primary/30" />
              <div className="text-center">
                <p className="text-xs font-medium text-primary mb-1">AFTER</p>
                <p className="text-xs text-white/60">#{item.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};