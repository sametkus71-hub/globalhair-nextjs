import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ReviewItem {
  id: number;
  isAfter: boolean;
  beforeColor: string;
  afterColor: string;
}

const REVIEW_ITEMS: Omit<ReviewItem, 'isAfter'>[] = [
  { id: 1, beforeColor: 'bg-gray-300', afterColor: 'bg-gray-400' },
  { id: 2, beforeColor: 'bg-gray-400', afterColor: 'bg-gray-300' },
  { id: 3, beforeColor: 'bg-gray-500', afterColor: 'bg-gray-200' },
  { id: 4, beforeColor: 'bg-gray-200', afterColor: 'bg-gray-500' },
  { id: 5, beforeColor: 'bg-gray-600', afterColor: 'bg-gray-100' },
  { id: 6, beforeColor: 'bg-gray-350', afterColor: 'bg-gray-450' },
  { id: 7, beforeColor: 'bg-gray-450', afterColor: 'bg-gray-250' },
  { id: 8, beforeColor: 'bg-gray-250', afterColor: 'bg-gray-550' },
  { id: 9, beforeColor: 'bg-gray-550', afterColor: 'bg-gray-300' },
  { id: 10, beforeColor: 'bg-gray-300', afterColor: 'bg-gray-400' },
  { id: 11, beforeColor: 'bg-gray-400', afterColor: 'bg-gray-300' },
  { id: 12, beforeColor: 'bg-gray-500', afterColor: 'bg-gray-200' },
  { id: 13, beforeColor: 'bg-gray-200', afterColor: 'bg-gray-500' },
  { id: 14, beforeColor: 'bg-gray-600', afterColor: 'bg-gray-100' },
  { id: 15, beforeColor: 'bg-gray-350', afterColor: 'bg-gray-450' },
  { id: 16, beforeColor: 'bg-gray-450', afterColor: 'bg-gray-250' },
  { id: 17, beforeColor: 'bg-gray-250', afterColor: 'bg-gray-550' },
  { id: 18, beforeColor: 'bg-gray-550', afterColor: 'bg-gray-300' }
];

// Initial balanced state: 9 BEFORE, 9 AFTER
const INITIAL_STATE = [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true];

// Animation groups that swap pairs to maintain balance
const ANIMATION_GROUPS = [
  { beforeId: 1, afterId: 2, initialDelay: 3000, stayDuration: 18000 },
  { beforeId: 3, afterId: 4, initialDelay: 8000, stayDuration: 22000 },
  { beforeId: 5, afterId: 6, initialDelay: 15000, stayDuration: 16000 },
  { beforeId: 7, afterId: 8, initialDelay: 5000, stayDuration: 20000 },
  { beforeId: 9, afterId: 10, initialDelay: 12000, stayDuration: 24000 },
  { beforeId: 11, afterId: 12, initialDelay: 7000, stayDuration: 19000 },
  { beforeId: 13, afterId: 14, initialDelay: 10000, stayDuration: 17000 },
  { beforeId: 15, afterId: 16, initialDelay: 4000, stayDuration: 21000 },
  { beforeId: 17, afterId: 18, initialDelay: 14000, stayDuration: 23000 }
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
        className="grid grid-cols-3 w-full h-full gap-2"
        style={{ 
          gridTemplateRows: 'repeat(6, 1fr)', // 6 rows instead of 2
          height: '100%'
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "w-full h-full transition-colors duration-[5000ms] ease-in-out relative cursor-pointer hover:opacity-90 rounded-lg flex flex-col justify-end p-3 overflow-hidden",
              "min-h-0 flex-shrink-0", // Ensure consistent height
              item.isAfter ? item.afterColor : item.beforeColor
            )}
          >
            {/* Content at bottom */}
            <div className="text-black">
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