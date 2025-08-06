import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
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
  { id: 6, beforeColor: 'bg-gray-500', afterColor: 'bg-gray-300' },
  { id: 7, beforeColor: 'bg-gray-600', afterColor: 'bg-gray-400' },
  { id: 8, beforeColor: 'bg-gray-700', afterColor: 'bg-gray-200' },
  { id: 9, beforeColor: 'bg-gray-400', afterColor: 'bg-gray-500' }
];

// Initial balanced state: alternating pattern for 9 items
const INITIAL_STATE = [false, true, false, true, false, true, false, true, false];

// Animation groups that swap pairs to maintain balance
const ANIMATION_GROUPS = [
  { beforeId: 1, afterId: 2, initialDelay: 3000, stayDuration: 18000 },
  { beforeId: 3, afterId: 4, initialDelay: 8000, stayDuration: 22000 },
  { beforeId: 5, afterId: 6, initialDelay: 15000, stayDuration: 16000 },
  { beforeId: 7, afterId: 8, initialDelay: 5000, stayDuration: 20000 }
];

export const ReviewsGrid = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [items, setItems] = useState<ReviewItem[]>(
    REVIEW_ITEMS.map((item, index) => ({ ...item, isAfter: INITIAL_STATE[index] }))
  );

  // Handle click to navigate to item page
  const handleItemClick = (clickedId: number) => {
    const itemRoute = language === 'nl' ? `/nl/reviews/item1` : `/en/reviews/item1`;
    navigate(itemRoute);
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
    <div className="w-full h-full">
      <div 
        className="grid grid-cols-3 w-full h-full gap-0"
        style={{ 
          gridTemplateRows: '1fr 1fr 1fr', // 3x3 grid
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
            <div className="absolute bottom-1.5 left-1.5 text-black">
              <div className="text-xs font-medium leading-tight mb-0.5">
                Naam achternaam
              </div>
              <div className="text-[10px] opacity-60 leading-tight">
                Behandeling
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};