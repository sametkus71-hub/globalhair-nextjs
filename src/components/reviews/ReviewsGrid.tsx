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

const PhotoCard = () => (
  <div className="w-full h-full bg-white">
    {/* Empty placeholder for photos */}
  </div>
);

export const ReviewsGrid = () => {
  const { language } = useLanguage();
  const { slideToItem } = useSlideTransition();

  // Handle click to navigate to item page with slide animation
  const handleItemClick = (clickedId: number) => {
    const itemRoute = language === 'nl' ? `/nl/reviews/item1` : `/en/reviews/item1`;
    slideToItem(itemRoute);
  };

  return (
    <div className="w-full h-full bg-gray-50">
      <div 
        className="grid grid-cols-3 h-full w-full"
        style={{
          gridTemplateRows: 'repeat(6, minmax(0, 1fr))',
          gap: '1px',
          backgroundColor: '#d1d5db', // Grid line color
          aspectRatio: '3/6' // Ensures proper square proportions
        }}
      >
        {GRID_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "cursor-pointer hover:opacity-95 transition-opacity duration-200 w-full",
              item.rowSpan === 2 ? "row-span-2" : "row-span-1"
            )}
            style={{
              aspectRatio: item.rowSpan === 2 ? '1/2' : '1/1' // Force proper aspect ratios
            }}
          >
            {item.type === 'quote' && item.content?.quote && (
              <QuoteCard quote={item.content.quote} name={item.content.name || 'Anonymous'} />
            )}
            {item.type === 'video' && <VideoCard />}
            {item.type === 'photo' && <PhotoCard />}
          </div>
        ))}
      </div>
    </div>
  );
};