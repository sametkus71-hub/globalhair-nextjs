import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GridItem {
  id: number;
  beforeImage: string;
  afterImage: string;
  isAfter: boolean;
}

const GRID_ITEMS: Omit<GridItem, 'isAfter'>[] = [
  { id: 1, beforeImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop', afterImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop' },
  { id: 2, beforeImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop', afterImage: 'https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=400&h=300&fit=crop' },
  { id: 3, beforeImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop', afterImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop' },
  { id: 4, beforeImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop', afterImage: 'https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=400&h=300&fit=crop' },
  { id: 5, beforeImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop', afterImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop' },
  { id: 6, beforeImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop', afterImage: 'https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=400&h=300&fit=crop' }
];

export const BeforeAfterGrid = () => {
  const [items, setItems] = useState<GridItem[]>(
    GRID_ITEMS.map(item => ({ ...item, isAfter: false }))
  );

  useEffect(() => {
    // Set up random timers for each item
    const timers = items.map((item, index) => {
      const randomDelay = Math.random() * 3000 + 2000; // 2-5 seconds
      
      return setTimeout(() => {
        setItems(prevItems => 
          prevItems.map(prevItem => 
            prevItem.id === item.id 
              ? { ...prevItem, isAfter: true }
              : prevItem
          )
        );
      }, randomDelay);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden relative"
          >
            {/* Before Image */}
            <img
              src={item.beforeImage}
              alt={`Before ${item.id}`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
                item.isAfter ? "opacity-0" : "opacity-100"
              )}
            />
            
            {/* After Image */}
            <img
              src={item.afterImage}
              alt={`After ${item.id}`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
                item.isAfter ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};