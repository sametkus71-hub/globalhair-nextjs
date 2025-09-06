import { useLanguage } from '@/hooks/useLanguage';
import { useSlideTransition } from '@/hooks/useSlideTransition';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Quote } from 'lucide-react';

type ContentType = 'quote' | 'video' | 'photo' | 'title';

interface GridItem {
  id: number;
  type: ContentType;
  span: 1 | 2; // Grid column span
  content?: {
    quote?: string;
    name?: string;
    title?: string;
  };
}

// Instagram explore-style grid layout with proper sizing
const GRID_ITEMS: GridItem[] = [
  { id: 1, type: 'photo', span: 1 },
  { id: 2, type: 'photo', span: 1 },
  { id: 3, type: 'quote', span: 1, content: { quote: "Quote content", name: "Customer" } },
  { id: 4, type: 'video', span: 2 },
  { id: 5, type: 'photo', span: 1 },
  { id: 6, type: 'quote', span: 1, content: { quote: "Quote content", name: "Customer" } },
  { id: 7, type: 'photo', span: 1 },
  { id: 8, type: 'video', span: 1 },
  { id: 9, type: 'photo', span: 2 },
  { id: 10, type: 'quote', span: 1, content: { quote: "Quote content", name: "Customer" } },
  { id: 11, type: 'photo', span: 1 },
  { id: 12, type: 'video', span: 1 },
  { id: 13, type: 'photo', span: 1 },
  { id: 14, type: 'quote', span: 1, content: { quote: "Quote content", name: "Customer" } },
  { id: 15, type: 'video', span: 2 }
];

const QuoteCard = ({ quote, name }: { quote: string; name: string }) => (
  <div className="w-full h-full bg-blue-50 flex items-center justify-center">
    <div className="text-center text-gray-400 font-light text-sm">
      "QUOTE"
    </div>
  </div>
);

const VideoCard = () => (
  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
    <div className="text-center text-white font-light text-sm">
      VIDEO
    </div>
  </div>
);

const PhotoCard = () => (
  <div className="w-full h-full bg-gray-100">
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
        className="grid grid-cols-3 h-full"
        style={{
          gridTemplateRows: 'repeat(6, 1fr)', // More rows for smaller items
          gap: '1px',
          backgroundColor: '#d1d5db' // Grid line color
        }}
      >
        {GRID_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "cursor-pointer hover:opacity-95 transition-opacity duration-200 bg-white",
              item.span === 2 ? "col-span-2" : "col-span-1"
            )}
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