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

// Instagram explore-style grid layout matching the design exactly
const GRID_ITEMS: GridItem[] = [
  { id: 1, type: 'photo', span: 1 },
  { id: 2, type: 'photo', span: 1 },
  { id: 3, type: 'quote', span: 1, content: { quote: "Quote content", name: "Customer" } },
  { id: 4, type: 'photo', span: 2 },
  { id: 5, type: 'quote', span: 1, content: { quote: "Quote content", name: "Customer" } },
  { id: 6, type: 'title', span: 1, content: { title: "quotes van klanten\ntestimonial video's\nafter foto's" } },
  { id: 7, type: 'photo', span: 2 },
  { id: 8, type: 'photo', span: 1 },
  { id: 9, type: 'photo', span: 1 },
  { id: 10, type: 'quote', span: 1, content: { quote: "Quote content", name: "Customer" } }
];

const QuoteCard = ({ quote, name }: { quote: string; name: string }) => (
  <div className="w-full h-full bg-white flex items-center justify-center">
    <div className="text-center text-gray-400 font-light text-lg">
      "QUOTE"
    </div>
  </div>
);

const PhotoCard = () => (
  <div className="w-full h-full bg-gray-100">
    {/* Empty placeholder matching the design */}
  </div>
);

const TitleCard = ({ title }: { title: string }) => (
  <div className="w-full h-full bg-white flex items-start justify-start p-6">
    <div className="text-left">
      {title.split('\n').map((line, index) => (
        <div key={index} className="flex items-center mb-2">
          <span className="text-orange-400 mr-2">-</span>
          <span className="text-orange-400 font-medium">{line}</span>
        </div>
      ))}
    </div>
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
          gridTemplateRows: 'repeat(4, 1fr)',
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
            style={{
              minHeight: '120px'
            }}
          >
            {item.type === 'quote' && item.content?.quote && (
              <QuoteCard quote={item.content.quote} name={item.content.name || 'Anonymous'} />
            )}
            {item.type === 'photo' && <PhotoCard />}
            {item.type === 'title' && item.content?.title && (
              <TitleCard title={item.content.title} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};