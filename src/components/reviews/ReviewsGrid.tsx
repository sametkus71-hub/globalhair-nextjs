import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSlideTransition } from '@/hooks/useSlideTransition';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIntersection } from '@/hooks/useIntersection';
import { cn } from '@/lib/utils';
import { generateRandomGrid, GridItem } from '@/lib/reviewsRandomizer';
import { QuoteImage } from '@/data/reviewsQuotes';
import { BeforeAfterItem } from '@/data/reviewsBeforeAfter';
import { VideoItem } from '@/data/reviewsVideos';
import { VolumeX, Volume2 } from 'lucide-react';


// Remove interfaces - no longer needed for static implementation

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
  onToggleMute,
  shouldLoad = false
}: { 
  video: VideoItem; 
  isMuted: boolean; 
  onToggleMute: () => void;
  shouldLoad?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && shouldLoad) {
      videoRef.current.muted = isMuted;
      // Ensure video plays when loaded
      videoRef.current.play().catch(() => {
        // Ignore autoplay failures - common on mobile
      });
    }
  }, [isMuted, shouldLoad]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    };
  }, []);

  if (!shouldLoad) {
    // Lightweight placeholder while not loaded
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <VolumeX className="w-8 h-8 text-white/50" />
      </div>
    );
  }

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
        preload="metadata"
        className="w-full h-full object-cover"
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

const BeforeAfterCard = ({ item }: { item: BeforeAfterItem }) => (
  <div className="w-full h-full relative overflow-hidden">
    <img 
      src={item.beforeImage}
      alt={`${item.patientName} - Before ${item.treatmentType}`}
      className="w-full h-full object-cover"
      loading="lazy"
      decoding="async"
    />
    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
      Before
    </div>
  </div>
);

export const ReviewsGrid = () => {
  const { language } = useLanguage();
  const { slideToItem } = useSlideTransition();
  const isMobile = useIsMobile();
  
  // Generate random grid on component mount
  const [gridItems] = useState<GridItem[]>(() => generateRandomGrid());
  
  // Progressive loading state
  const [visibleItemCount, setVisibleItemCount] = useState(() => 
    isMobile ? 12 : gridItems.length
  );
  
  // State for video muting - track which video is currently unmuted (if any)
  const [unmutedVideoId, setUnmutedVideoId] = useState<string | null>(null);
  
  // Grid animation state - single boolean for triggering CSS animation
  const [isGridAnimated, setIsGridAnimated] = useState(false);
  
  // Intersection observer for progressive loading
  const { isIntersecting: shouldLoadMore, elementRef: loadMoreRef } = useIntersection<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Find video items to determine which should autoplay
  const videoItems = gridItems.filter(item => item.type === 'video').slice(0, 3);
  const videoItemIds = new Set(videoItems.map(item => item.id));

  // Handle click to navigate to item page with slide animation
  const handleItemClick = (item: GridItem) => {
    if (item.type === 'quote') return; // Quotes are not clickable
    
    if (item.type === 'before-after') {
      const slug = item.data.slug;
      const itemRoute = language === 'nl' ? `/nl/reviews/${slug}` : `/en/reviews/${slug}`;
      slideToItem(itemRoute);
    }
  };

  // Handle video mute/unmute toggle - only one video can be unmuted at a time
  const handleVideoToggleMute = (videoId: string) => {
    setUnmutedVideoId(prevId => prevId === videoId ? null : videoId);
  };

  // Progressive loading effect
  useEffect(() => {
    if (isMobile && shouldLoadMore && visibleItemCount < gridItems.length) {
      const loadNextBatch = () => {
        setVisibleItemCount(prev => Math.min(prev + 6, gridItems.length));
      };
      
      // Small delay to prevent rapid loading
      const timeoutId = setTimeout(loadNextBatch, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldLoadMore, visibleItemCount, gridItems.length, isMobile]);

  // Trigger grid animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGridAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup videos on unmount
  useEffect(() => {
    return () => {
      // Pause all videos and clear unmuted state
      setUnmutedVideoId(null);
    };
  }, []);

  // Get the items to render based on progressive loading
  const itemsToRender = gridItems.slice(0, visibleItemCount);

  return (
    <div className="w-full h-full overflow-auto -mt-[37px] pb-32">
      <div
        className={cn(
          "grid grid-cols-3",
          isGridAnimated && "grid-animate"
        )}
        style={{
          width: '100vw',
          minHeight: '100vh',
          gridAutoRows: '32vw',
          gap: '2px',
          backgroundColor: '#ffffff'
        }}
      >
        {itemsToRender.map((item, index) => {
          // Guard against undefined data
          if (!item?.data) return null;
          
          const delay = index * 50; // Staggered delay for CSS animation
          const isVideoSlot = videoItemIds.has(item.id);
          
          return (
            <div
              key={item.id}
              onClick={item.type === 'video' ? undefined : () => handleItemClick(item)}
              className={cn(
                "grid-item-entrance",
                item.type === 'quote' ? "cursor-default" : 
                item.type === 'video' ? "" : "cursor-pointer hover:opacity-90",
                item.rowSpan === 2 ? "row-span-2" : "row-span-1"
              )}
              style={{
                width: '33vw',
                height: item.rowSpan === 2 ? '64vw' : '32vw',
                '--delay': `${delay}ms`,
                contain: 'content'
              } as React.CSSProperties}
            >
              {item.type === 'quote' && (
                <QuoteCard quote={item.data} />
              )}
              {item.type === 'video' && (
                <VideoCard 
                  video={item.data} 
                  isMuted={unmutedVideoId !== item.id}
                  onToggleMute={() => handleVideoToggleMute(item.id)}
                  shouldLoad={isVideoSlot}
                />
              )}
              {item.type === 'before-after' && (
                <BeforeAfterCard item={item.data} />
              )}
            </div>
          );
        })}
        
        {/* Load more trigger for mobile */}
        {isMobile && visibleItemCount < gridItems.length && (
          <div
            ref={loadMoreRef}
            className="col-span-3 h-4 flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};