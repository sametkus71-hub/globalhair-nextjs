import { useEffect, useState, useRef, memo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSlideTransition } from '@/hooks/useSlideTransition';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIntersection } from '@/hooks/useIntersection';
import { cn } from '@/lib/utils';
import { generateRandomGrid, GridItem } from '@/lib/reviewsRandomizer';
import { QuoteImage } from '@/data/reviewsQuotes';
import { BeforeAfterItem } from '@/data/reviewsBeforeAfter';
import { VideoItem } from '@/data/reviewsVideos';
import { BerkantVideoItem } from '@/data/berkantVideos';
import { VolumeX, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// Remove interfaces - no longer needed for static implementation

const QuoteCard = memo(({ quote, priority = false }: { quote: QuoteImage; priority?: boolean }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="w-full h-full relative overflow-hidden">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
      )}
      <img 
        src={quote.src} 
        alt={quote.alt}
        className="w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
});

const VideoCard = memo(({ 
  video, 
  isMuted, 
  onToggleMute,
  onMuteButtonClick,
  shouldLoad = false,
  isBerkantVideo = false
}: { 
  video: VideoItem | BerkantVideoItem; 
  isMuted: boolean; 
  onToggleMute: () => void;
  onMuteButtonClick: () => void;
  shouldLoad?: boolean;
  isBerkantVideo?: boolean;
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
        src={'videoUrl' in video ? video.videoUrl : video.subbedUrl}
        muted={isMuted}
        autoPlay
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
      {/* Berkant badge */}
      {isBerkantVideo && (
        <div className="absolute top-2 left-2 bg-black/70 px-2.5 py-1.5 rounded-full text-xs text-white font-normal pointer-events-none">
          Berkant
        </div>
      )}
      <button 
        className="absolute top-2 right-2 bg-black/70 p-2 rounded-full cursor-pointer hover:bg-black/80 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onMuteButtonClick();
        }}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-white" />
        )}
      </button>
    </div>
  );
});

const BeforeAfterCard = memo(({ item, priority = false }: { item: BeforeAfterItem; priority?: boolean }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="w-full h-full relative overflow-hidden">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
      )}
      <img 
        src={item.image}
        alt="Hair transplant before/after result"
        className="w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
});

export const ReviewsGrid = () => {
  const { language } = useLanguage();
  const { slideToItem } = useSlideTransition();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Generate random grid on component mount
  const [gridItems] = useState<GridItem[]>(() => generateRandomGrid());
  
  // Progressive loading state - start with only 6 items for faster initial load
  const [visibleItemCount, setVisibleItemCount] = useState(() => 
    isMobile ? 6 : 12
  );
  
  // State for video muting - track which video is currently unmuted (if any)
  const [unmutedVideoId, setUnmutedVideoId] = useState<string | null>(null);
  
  // Grid animation state - single boolean for triggering CSS animation
  const [isGridAnimated, setIsGridAnimated] = useState(false);
  
  // Intersection observer for progressive loading - increased rootMargin for better preloading
  const { isIntersecting: shouldLoadMore, elementRef: loadMoreRef } = useIntersection<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '500px'
  });

  // Find video items to determine which should autoplay
  const videoItems = gridItems.filter(item => item.type === 'video' || item.type === 'berkant-video').slice(0, 6);
  const videoItemIds = new Set(videoItems.map(item => item.id));

  // Handle click to navigate to item page with slide animation - only for videos now
  const handleItemClick = (item: GridItem) => {
    // Only quotes and before-after items are not clickable
    // Videos are handled by their own click handler
    return;
  };

  // Handle video area click (background) - navigate for Berkant videos, toggle mute for regular videos
  const handleVideoToggleMute = (videoId: string, item?: GridItem) => {
    // Check if this is a Berkant video
    if (item && item.type === 'berkant-video') {
      // Navigate to mission page with video parameter
      const missionPath = language === 'nl' ? `/nl/missie?video=${item.data.id}` : `/en/mission?video=${item.data.id}`;
      navigate(missionPath);
    } else {
      // Regular video - toggle mute
      setUnmutedVideoId(prevId => prevId === videoId ? null : videoId);
    }
  };

  // Handle mute button click - always toggle mute for all video types
  const handleMuteButtonClick = (videoId: string) => {
    setUnmutedVideoId(prevId => prevId === videoId ? null : videoId);
  };

  // Progressive loading effect - load 6 items at a time for smoother experience
  useEffect(() => {
    if (shouldLoadMore && visibleItemCount < gridItems.length) {
      const loadNextBatch = () => {
        setVisibleItemCount(prev => Math.min(prev + 6, gridItems.length));
      };
      
      // Small delay to prevent rapid loading
      const timeoutId = setTimeout(loadNextBatch, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldLoadMore, visibleItemCount, gridItems.length]);

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
    <div className="relative w-full min-h-full">
      <div
        className={cn(
          "grid grid-rows-3",
          isGridAnimated && "grid-animate"
        )}
        style={{
          height: '370px',  // 3 rows × 120px + 2 gaps × 5px
          gridAutoColumns: '120px',
          gridAutoFlow: 'column dense',  // Flow horizontally and fill gaps intelligently
          gap: '5px',
          backgroundColor: 'transparent'
        }}
      >
        {itemsToRender.map((item, index) => {
          // Guard against undefined data
          if (!item?.data) return null;
          
          const delay = Math.min(index * 50, 2000); // Staggered delay capped at 2s for CSS animation
          const isVideoSlot = videoItemIds.has(item.id);
          
          return (
            <div
              key={item.id}
              className={cn(
                "grid-item-entrance cursor-default silver-grey-gradient-border",
                item.width === 2 && "col-span-2",
                item.height === 2 && "row-span-2"
              )}
              style={{
                '--delay': `${delay}ms`,
                contain: 'content',
                borderRadius: '12px',
                overflow: 'hidden',
                ...(item.width === 2 && { gridColumn: 'span 2' }),
                ...(item.height === 2 && { gridRow: 'span 2' })
              } as React.CSSProperties}
            >
              {item.type === 'quote' && (
                <QuoteCard quote={item.data} priority={index < 6} />
              )}
              {(item.type === 'video' || item.type === 'berkant-video') && (
                <VideoCard 
                  video={item.data} 
                  isMuted={unmutedVideoId !== item.id}
                  onToggleMute={() => handleVideoToggleMute(item.id, item)}
                  onMuteButtonClick={() => handleMuteButtonClick(item.id)}
                  shouldLoad={isVideoSlot}
                  isBerkantVideo={item.type === 'berkant-video'}
                />
              )}
              {item.type === 'before-after' && (
                <BeforeAfterCard item={item.data} priority={index < 6} />
              )}
            </div>
          );
        })}
        
        {/* Load more trigger */}
        {visibleItemCount < gridItems.length && (
          <div
            ref={loadMoreRef}
            className="row-span-3 w-4 flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
          </div>
        )}
      </div>

      <style>{`
        .silver-grey-gradient-border {
          position: relative;
          will-change: transform;
        }

        .silver-grey-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(80deg, #949494 7%, #838e94 16%, #b5b5b5 34%, #ACB9C1 51%, #4e5964 78%, #727272 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 3;
          will-change: opacity;
        }

        .silver-grey-gradient-border > * {
          position: relative;
          z-index: 1;
        }

        .row-span-2 {
          grid-row: span 2;
        }

        .col-span-2 {
          grid-column: span 2;
        }
      `}</style>
    </div>
  );
};