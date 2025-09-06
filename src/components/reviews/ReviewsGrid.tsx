import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSlideTransition } from '@/hooks/useSlideTransition';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Quote } from 'lucide-react';

type ContentType = 'quote' | 'video' | 'photo';

interface GridItem {
  id: number;
  type: ContentType;
  rowSpan: 1 | 2; // Grid row span for vertical items
  content?: {
    quote?: string;
    name?: string;
  };
}

interface PhotoState {
  id: number;
  isAfter: boolean;
}

// Animation groups for before/after transitions
const PHOTO_ANIMATION_GROUPS = [
  { photoIds: [1, 2], initialDelay: 2000, stayDuration: 8000 },
  { photoIds: [4, 7], initialDelay: 5000, stayDuration: 12000 },
  { photoIds: [9, 11, 13], initialDelay: 8000, stayDuration: 10000 },
];

// Instagram explore-style grid layout with vertical spans
const GRID_ITEMS: GridItem[] = [
  { id: 1, type: 'photo', rowSpan: 1 },
  { id: 2, type: 'photo', rowSpan: 1 },
  { id: 3, type: 'quote', rowSpan: 1, content: { quote: "Quote content", name: "Customer" } },
  { id: 4, type: 'video', rowSpan: 2 }, // Vertical span
  { id: 5, type: 'photo', rowSpan: 1 },
  { id: 6, type: 'quote', rowSpan: 1, content: { quote: "Quote content", name: "Customer" } },
  { id: 7, type: 'photo', rowSpan: 1 },
  { id: 8, type: 'video', rowSpan: 1 },
  { id: 9, type: 'photo', rowSpan: 2 }, // Vertical span
  { id: 10, type: 'quote', rowSpan: 1, content: { quote: "Quote content", name: "Customer" } },
  { id: 11, type: 'photo', rowSpan: 1 },
  { id: 12, type: 'video', rowSpan: 1 },
  { id: 13, type: 'photo', rowSpan: 1 },
  { id: 14, type: 'quote', rowSpan: 1, content: { quote: "Quote content", name: "Customer" } },
  { id: 15, type: 'video', rowSpan: 2 } // Vertical span
];

const QuoteCard = ({ quote, name }: { quote: string; name: string }) => (
  <div className="w-full h-full bg-gray-50 flex items-center justify-center">
    <div className="text-center text-gray-400 font-light text-sm">
      "QUOTE"
    </div>
  </div>
);

const VideoCard = () => (
  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
    <div className="text-center text-gray-500 font-light text-sm">
      VIDEO
    </div>
  </div>
);

const PhotoCard = ({ isAfter = false }: { isAfter?: boolean }) => (
  <div 
    className={cn(
      "w-full h-full transition-colors duration-[3000ms] ease-in-out",
      isAfter ? "bg-gray-200" : "bg-white"
    )}
  >
    {/* Empty placeholder for photos with before/after states */}
  </div>
);

export const ReviewsGrid = () => {
  const { language } = useLanguage();
  const { slideToItem } = useSlideTransition();
  const [photoStates, setPhotoStates] = useState<PhotoState[]>(
    GRID_ITEMS.filter(item => item.type === 'photo').map(item => ({ 
      id: item.id, 
      isAfter: false 
    }))
  );

  // Handle click to navigate to item page with slide animation
  const handleItemClick = (clickedId: number) => {
    const itemRoute = language === 'nl' ? `/nl/reviews/item1` : `/en/reviews/item1`;
    slideToItem(itemRoute);
  };

  // Get current state for a photo item
  const getPhotoState = (itemId: number) => {
    return photoStates.find(state => state.id === itemId)?.isAfter || false;
  };

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    // Set up before/after animation groups for photos
    PHOTO_ANIMATION_GROUPS.forEach((group) => {
      // Initial delay before first transition
      const initialTimer = setTimeout(() => {
        // Toggle the before/after state for all photos in this group
        setPhotoStates(prevStates => 
          prevStates.map(state => {
            if (group.photoIds.includes(state.id)) {
              return { ...state, isAfter: !state.isAfter };
            }
            return state;
          })
        );

        // Set up continuous transitions for this group
        const cycleInterval = setInterval(() => {
          setPhotoStates(prevStates => 
            prevStates.map(state => {
              if (group.photoIds.includes(state.id)) {
                return { ...state, isAfter: !state.isAfter };
              }
              return state;
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
    <div className="w-full h-full overflow-auto">
      <div 
        className="grid grid-cols-3"
        style={{
          width: '100vw',
          minHeight: '100vh',
          gridAutoRows: '32vw', // Fixed row height based on viewport width
          gap: '2px',
          backgroundColor: '#ffffff'
        }}
      >
        {GRID_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "cursor-pointer hover:opacity-90 transition-opacity duration-200",
              item.rowSpan === 2 ? "row-span-2" : "row-span-1"
            )}
            style={{
              width: '33vw', // Fixed width based on viewport
              height: item.rowSpan === 2 ? '64vw' : '32vw' // Fixed height maintaining aspect ratio
            }}
          >
            {item.type === 'quote' && item.content?.quote && (
              <QuoteCard quote={item.content.quote} name={item.content.name || 'Anonymous'} />
            )}
            {item.type === 'video' && <VideoCard />}
            {item.type === 'photo' && <PhotoCard isAfter={getPhotoState(item.id)} />}
          </div>
        ))}
      </div>
    </div>
  );
};