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

// Instagram explore-style grid layout with mixed content
const GRID_ITEMS: GridItem[] = [
  { id: 1, type: 'photo', span: 1 },
  { id: 2, type: 'quote', span: 2, content: { quote: "Geweldig resultaat!", name: "M. van der Berg" } },
  { id: 3, type: 'video', span: 1 },
  { id: 4, type: 'photo', span: 1 },
  { id: 5, type: 'title', span: 1, content: { title: "Bekijk onze reviews" } },
  { id: 6, type: 'quote', span: 1, content: { quote: "Perfect service", name: "J. Smit" } },
  { id: 7, type: 'video', span: 2 },
  { id: 8, type: 'photo', span: 1 },
  { id: 9, type: 'quote', span: 1, content: { quote: "Zeer tevreden!", name: "A. Johnson" } }
];

const QuoteCard = ({ quote, name }: { quote: string; name: string }) => (
  <div className="w-full h-full bg-white/90 p-4 flex flex-col justify-between min-h-[120px]">
    <Quote className="w-6 h-6 text-gray-400 mb-2" />
    <p className="text-sm font-medium text-gray-800 flex-1 flex items-center">"{quote}"</p>
    <p className="text-xs text-gray-600 mt-2">— {name}</p>
  </div>
);

const VideoCard = () => (
  <div className="w-full h-full bg-gray-900 flex items-center justify-center relative min-h-[120px]">
    <Skeleton className="absolute inset-0 bg-gray-800" />
    <div className="relative z-10 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
      <Play className="w-6 h-6 text-white ml-1" fill="white" />
    </div>
  </div>
);

const PhotoCard = () => (
  <div className="w-full h-full bg-gray-200 relative min-h-[120px]">
    <Skeleton className="w-full h-full" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
  </div>
);

const TitleCard = ({ title }: { title: string }) => (
  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center p-4 min-h-[120px]">
    <h1 className="text-white font-bold text-center leading-tight">
      <span className="text-lg sm:text-xl md:text-2xl">{title}</span>
    </h1>
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
    <div className="w-full h-full p-1">
      <div className="grid grid-cols-3 gap-1 h-full auto-rows-fr">
        {GRID_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "cursor-pointer hover:opacity-90 transition-opacity duration-200 rounded-lg overflow-hidden",
              item.span === 2 ? "col-span-2" : "col-span-1"
            )}
          >
            {item.type === 'quote' && item.content?.quote && (
              <QuoteCard quote={item.content.quote} name={item.content.name || 'Anonymous'} />
            )}
            {item.type === 'video' && <VideoCard />}
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