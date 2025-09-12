import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSlideTransition } from '@/hooks/useSlideTransition';
import { cn } from '@/lib/utils';
import { generateRandomGrid, getBeforeAfterCyclingGroups, GridItem } from '@/lib/reviewsRandomizer';
import { QuoteImage } from '@/data/reviewsQuotes';
import { BeforeAfterItem } from '@/data/reviewsBeforeAfter';
import { VideoItem } from '@/data/reviewsVideos';
import { VolumeX, Volume2 } from 'lucide-react';


interface BeforeAfterState {
  isAfter: boolean;
}

interface AnimationState {
  isVisible: boolean;
  delay: number;
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

const VideoCard = ({ 
  video, 
  isMuted, 
  onToggleMute 
}: { 
  video: VideoItem; 
  isMuted: boolean; 
  onToggleMute: () => void; 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div 
      className="w-full h-full relative overflow-hidden bg-black cursor-pointer"
      onClick={onToggleMute}
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        muted={isMuted}
        autoPlay
        loop
        playsInline
        className="w-full h-full object-cover"
        poster={video.thumbnail}
      />
      <div className="absolute top-2 right-2 bg-black/70 p-2 rounded-full pointer-events-none">
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-white" />
        )}
      </div>
    </div>
  );
};

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
  
  // State for video muting - track which video is currently unmuted (if any)
  const [unmutedVideoId, setUnmutedVideoId] = useState<string | null>(null);

  // State for grid animation
  const [animationStates, setAnimationStates] = useState<Map<string, AnimationState>>(new Map());
  const [animationsTriggered, setAnimationsTriggered] = useState(false);

  // Calculate animation delay based on grid position
  const calculateAnimationDelay = (index: number): number => {
    const columnsPerRow = 3;
    const row = Math.floor(index / columnsPerRow);
    const col = index % columnsPerRow;
    const baseDelay = (row * columnsPerRow + col) * 50; // 50ms between items
    
    // Tall items (2x row span) get slightly earlier timing
    const item = gridItems[index];
    const tallItemBonus = item?.rowSpan === 2 ? -25 : 0;
    
    return baseDelay + tallItemBonus;
  };

  // Handle click to navigate to item page with slide animation
  const handleItemClick = (item: GridItem) => {
    if (item.type === 'quote') return; // Quotes are not clickable
    
    if (item.type === 'before-after') {
      const slug = item.data.slug;
      const itemRoute = language === 'nl' ? `/nl/reviews/${slug}` : `/en/reviews/${slug}`;
      slideToItem(itemRoute);
    }
    // Videos no longer navigate - they handle mute/unmute via their own click handler
  };

  // Handle video mute/unmute toggle
  const handleVideoToggleMute = (videoId: string) => {
    setUnmutedVideoId(prevId => prevId === videoId ? null : videoId);
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

  // Initialize animation states and trigger entrance animations
  useEffect(() => {
    const initialAnimationStates = new Map<string, AnimationState>();
    
    gridItems.forEach((item, index) => {
      const delay = calculateAnimationDelay(index);
      initialAnimationStates.set(item.id, { 
        isVisible: false, 
        delay 
      });
    });
    
    setAnimationStates(initialAnimationStates);
    
    // Trigger animations after a short delay to ensure component is mounted
    const triggerTimer = setTimeout(() => {
      setAnimationsTriggered(true);
      
      // Trigger each item's animation based on its calculated delay
      gridItems.forEach((item, index) => {
        const delay = calculateAnimationDelay(index);
        setTimeout(() => {
          setAnimationStates(prevStates => {
            const newStates = new Map(prevStates);
            const currentState = newStates.get(item.id);
            if (currentState) {
              newStates.set(item.id, { 
                ...currentState, 
                isVisible: true 
              });
            }
            return newStates;
          });
        }, delay);
      });
    }, 100); // Small initial delay to ensure DOM is ready

    return () => {
      clearTimeout(triggerTimer);
    };
  }, [gridItems, calculateAnimationDelay]);

  return (
    <div className="w-full h-full overflow-auto -mt-[37px] pb-32">
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
        {gridItems.map((item, index) => {
          const beforeAfterState = beforeAfterStates.get(item.id);
          const animationState = animationStates.get(item.id);
          
          return (
            <div
              key={item.id}
              onClick={item.type === 'video' ? undefined : () => handleItemClick(item)}
              className={cn(
                "transition-opacity duration-200",
                // Animation classes
                "grid-item-entrance",
                animationState?.isVisible ? "grid-item-entrance-visible" : "",
                // Original classes
                item.type === 'quote' ? "cursor-default" : 
                item.type === 'video' ? "" : "cursor-pointer hover:opacity-90",
                item.rowSpan === 2 ? "row-span-2" : "row-span-1"
              )}
              style={{
                width: '33vw', // Fixed width based on viewport
                height: item.rowSpan === 2 ? '64vw' : '32vw', // Fixed height maintaining aspect ratio
                animationDelay: animationState ? `${animationState.delay}ms` : '0ms'
              }}
            >
              {item.type === 'quote' && (
                <QuoteCard quote={item.data} />
              )}
              {item.type === 'video' && (
                <VideoCard 
                  video={item.data} 
                  isMuted={unmutedVideoId !== item.id}
                  onToggleMute={() => handleVideoToggleMute(item.id)}
                />
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