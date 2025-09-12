import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSlideTransition } from '@/hooks/useSlideTransition';
import { cn } from '@/lib/utils';
import { generateRandomGrid, getBeforeAfterCyclingGroups, GridItem } from '@/lib/reviewsRandomizer';
import { QuoteImage } from '@/data/reviewsQuotes';
import { BeforeAfterItem } from '@/data/reviewsBeforeAfter';
import { VideoItem } from '@/data/reviewsVideos';
import { Play } from 'lucide-react';


interface BeforeAfterState {
  isAfter: boolean;
}

const QuoteCard = ({ quote }: { quote: QuoteImage }) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <img 
        src={quote.src} 
        alt={quote.alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const VideoCard = ({ video }: { video: VideoItem }) => (
  <div className="w-full h-full relative overflow-hidden bg-black">
    <video
      src={video.videoUrl}
      muted
      autoPlay
      loop
      playsInline
      className="w-full h-full object-cover"
      poster={video.thumbnail}
    />
    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
      <Play className="w-8 h-8 text-white" />
    </div>
  </div>
);

const BeforeAfterCard = ({ item, isAfter }: { item: BeforeAfterItem; isAfter: boolean }) => (
  <div className="w-full h-full relative overflow-hidden">
    <img 
      src={isAfter ? item.afterImage : item.beforeImage}
      alt={`${item.patientName} - ${isAfter ? 'After' : 'Before'} ${item.treatmentType}`}
      className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
    />
    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
      {isAfter ? 'After' : 'Before'}
    </div>
  </div>
);

export const ReviewsGrid = () => {
  const { language } = useLanguage();
  const { slideToItem } = useSlideTransition();
  
  // Generate random grid on component mount
  const [gridItems] = useState<GridItem[]>(() => generateRandomGrid());
  
  // State for before/after transitions  
  const [beforeAfterStates, setBeforeAfterStates] = useState<Map<string, BeforeAfterState>>(new Map());

  // Handle click to navigate to item page with slide animation
  const handleItemClick = (item: GridItem) => {
    if (item.type === 'quote') return; // Quotes are not clickable
    
    if (item.type === 'before-after') {
      const slug = item.data.slug;
      const itemRoute = language === 'nl' ? `/nl/reviews/${slug}` : `/en/reviews/${slug}`;
      slideToItem(itemRoute);
    } else if (item.type === 'video') {
      // Navigate to video full screen
      const itemRoute = language === 'nl' ? `/nl/reviews/video-${item.data.id}` : `/en/reviews/video-${item.data.id}`;
      slideToItem(itemRoute);
    }
  };

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    
    // Get before/after cycling groups
    const beforeAfterCyclingGroups = getBeforeAfterCyclingGroups(gridItems);

    // Initialize before/after states only
    const initialBeforeAfterStates = new Map<string, BeforeAfterState>();

    gridItems.forEach(item => {
      if (item.type === 'before-after') {
        initialBeforeAfterStates.set(item.id, { isAfter: false });
      }
    });

    setBeforeAfterStates(initialBeforeAfterStates);

    // Set up before/after cycling (every 4 seconds, groups of 2)
    beforeAfterCyclingGroups.forEach((group, groupIndex) => {
      const interval = setInterval(() => {
        setBeforeAfterStates(prevStates => {
          const newStates = new Map(prevStates);
          group.forEach(itemIndex => {
            const item = gridItems[itemIndex];
            if (item.type === 'before-after') {
              const currentState = newStates.get(item.id);
              if (currentState) {
                newStates.set(item.id, { isAfter: !currentState.isAfter });
              }
            }
          });
          return newStates;
        });
      }, 4000);
      intervals.push(interval);
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [gridItems]);

  return (
    <div className="w-full h-full overflow-auto -mt-8">
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
        {gridItems.map((item) => {
          const beforeAfterState = beforeAfterStates.get(item.id);
          
          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={cn(
                "transition-opacity duration-200",
                item.type === 'quote' ? "cursor-default" : "cursor-pointer hover:opacity-90",
                item.rowSpan === 2 ? "row-span-2" : "row-span-1"
              )}
              style={{
                width: '33vw', // Fixed width based on viewport
                height: item.rowSpan === 2 ? '64vw' : '32vw' // Fixed height maintaining aspect ratio
              }}
            >
              {item.type === 'quote' && (
                <QuoteCard quote={item.data} />
              )}
              {item.type === 'video' && (
                <VideoCard video={item.data} />
              )}
              {item.type === 'before-after' && beforeAfterState && (
                <BeforeAfterCard item={item.data} isAfter={beforeAfterState.isAfter} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};