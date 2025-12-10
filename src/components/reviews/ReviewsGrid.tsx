import { useEffect, useState, useRef, memo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIntersection } from '@/hooks/useIntersection';
import { useVideoIntersection } from '@/hooks/useVideoIntersection';
import { cn } from '@/lib/utils';
import { generateRandomGrid, getBeforeAfterIndices, GridItem } from '@/lib/reviewsRandomizer';
import { useReviewsData } from '@/hooks/useReviewsData';
import { VolumeX, Volume2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Review = Tables<'reviews'>;

// Static image card (for static_image and before_after showing single image)
const StaticCard = memo(({ 
  imageUrl, 
  alt,
  priority = false 
}: { 
  imageUrl: string;
  alt: string;
  priority?: boolean;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div className="w-full h-full relative overflow-hidden">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
      )}
      <img 
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
});

// Before/After card with cycling between two images
const BeforeAfterCard = memo(({ 
  review,
  showAfter,
  priority = false 
}: { 
  review: Review;
  showAfter: boolean;
  priority?: boolean;
}) => {
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);
  
  const beforeUrl = review.before_image_url || '';
  const afterUrl = review.after_image_url || '';
  
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Loading placeholder */}
      {(!beforeLoaded || !afterLoaded) && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse z-0" />
      )}
      
      {/* Before image */}
      <img 
        src={beforeUrl}
        alt={`${review.name} - Before`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: showAfter ? 0 : 1 }}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setBeforeLoaded(true)}
      />
      
      {/* After image */}
      <img 
        src={afterUrl}
        alt={`${review.name} - After`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: showAfter ? 1 : 0 }}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setAfterLoaded(true)}
      />
      
      {/* Before/After label */}
      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium pointer-events-none">
        {showAfter ? 'Na' : 'Voor'}
      </div>
    </div>
  );
});

const VideoCard = memo(({ 
  review, 
  isMuted, 
  onToggleMute,
  onMuteButtonClick,
  shouldLoad = false
}: { 
  review: Review;
  isMuted: boolean; 
  onToggleMute: () => void;
  onMuteButtonClick: () => void;
  shouldLoad?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { isInViewport, elementRef } = useVideoIntersection({
    threshold: 0.3,
    rootMargin: '50px'
  });

  useEffect(() => {
    if (!videoRef.current || !isLoaded) return;
    
    if (isInViewport && shouldLoad) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInViewport, shouldLoad, isLoaded]);

  useEffect(() => {
    if (videoRef.current && isLoaded) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, isLoaded]);

  useEffect(() => {
    if (shouldLoad && !isLoaded) {
      setIsLoaded(true);
    }
  }, [shouldLoad, isLoaded]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        const video = videoRef.current;
        video.pause();
        video.removeAttribute('src');
        video.load();
        video.src = '';
      }
      setIsLoaded(false);
    };
  }, []);

  if (!shouldLoad || !isLoaded) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <VolumeX className="w-8 h-8 text-white/50" />
      </div>
    );
  }

  return (
    <div 
      ref={elementRef}
      className="w-full h-full relative overflow-hidden bg-black cursor-pointer"
      onClick={onToggleMute}
    >
      <video
        ref={videoRef}
        src={review.video_url || ''}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
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

export const ReviewsGrid = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const gridContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch reviews from database
  const { data: reviewsData, isLoading, error } = useReviewsData();
  
  // Generate grid from fetched data
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  
  useEffect(() => {
    if (reviewsData) {
      const items = generateRandomGrid(reviewsData);
      setGridItems(items);
    }
  }, [reviewsData]);
  
  // Before/after cycling state
  const [cyclePhase, setCyclePhase] = useState(0);
  const beforeAfterIndices = getBeforeAfterIndices(gridItems);
  
  // Cycle before/after images every 3.5 seconds
  useEffect(() => {
    if (beforeAfterIndices.length === 0) return;
    
    const interval = setInterval(() => {
      setCyclePhase(prev => prev + 1);
    }, 3500);
    
    return () => clearInterval(interval);
  }, [beforeAfterIndices.length]);
  
  // Progressive loading
  const [visibleItemCount, setVisibleItemCount] = useState(() => 
    isMobile ? 6 : 30
  );
  
  const [loadedVideoIds, setLoadedVideoIds] = useState<Set<string>>(new Set());
  const [unmutedVideoId, setUnmutedVideoId] = useState<string | null>(null);
  const [isGridAnimated, setIsGridAnimated] = useState(false);
  
  const { isIntersecting: shouldLoadMore, elementRef: loadMoreRef } = useIntersection<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '400px'
  });

  // Load videos progressively
  useEffect(() => {
    const itemsToRender = gridItems.slice(0, visibleItemCount);
    const videoItems = itemsToRender.filter(item => item.type === 'video');
    
    if (isMobile) {
      const initialVideos = videoItems.slice(0, 4).map(item => item.id);
      setLoadedVideoIds(new Set(initialVideos));
    } else {
      const initialVideos = videoItems.slice(0, 10).map(item => item.id);
      setLoadedVideoIds(new Set(initialVideos));
    }
  }, [isMobile, visibleItemCount, gridItems]);

  const handleVideoToggleMute = (videoId: string) => {
    setUnmutedVideoId(prevId => prevId === videoId ? null : videoId);
  };

  const handleMuteButtonClick = (videoId: string) => {
    setUnmutedVideoId(prevId => prevId === videoId ? null : videoId);
  };

  // Progressive loading effect
  useEffect(() => {
    if (shouldLoadMore && visibleItemCount < gridItems.length) {
      const loadNextBatch = () => {
        const batchSize = isMobile ? 4 : 10;
        setVisibleItemCount(prev => Math.min(prev + batchSize, gridItems.length));
      };
      
      const timeoutId = setTimeout(loadNextBatch, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldLoadMore, visibleItemCount, gridItems.length, isMobile]);

  // Trigger grid animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGridAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gridContainerRef.current) {
        const videos = gridContainerRef.current.querySelectorAll('video');
        videos.forEach(video => {
          video.pause();
          video.removeAttribute('src');
          video.load();
          video.src = '';
        });
      }
      setUnmutedVideoId(null);
      setLoadedVideoIds(new Set());
      setVisibleItemCount(isMobile ? 6 : 30);
      setIsGridAnimated(false);
    };
  }, [isMobile]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[370px] md:h-[540px]">
        <div className="animate-pulse text-white/60">Loading reviews...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[370px] md:h-[540px]">
        <div className="text-red-400">Failed to load reviews</div>
      </div>
    );
  }

  const itemsToRender = gridItems.slice(0, visibleItemCount);

  // Calculate which before/after items show "after" based on wave effect
  const getShowAfter = (itemIndex: number): boolean => {
    const baPosition = beforeAfterIndices.indexOf(itemIndex);
    if (baPosition === -1) return false;
    
    // Group into pairs, wave effect
    const groupIndex = Math.floor(baPosition / 2);
    const totalGroups = Math.ceil(beforeAfterIndices.length / 2);
    
    // Wave cycles through groups
    return (cyclePhase % totalGroups) === groupIndex;
  };

  return (
    <div ref={gridContainerRef} className="relative w-full">
      <div
        className={cn(
          "grid grid-rows-3",
          isGridAnimated && "grid-animate"
        )}
        style={{
          height: isMobile ? '370px' : '540px',
          gridAutoColumns: isMobile ? '120px' : '175px',
          gridAutoFlow: 'column dense',
          gap: isMobile ? '5px' : '7.5px',
          backgroundColor: 'transparent'
        }}
      >
        {itemsToRender.map((item, index) => {
          if (!item?.data) return null;
          
          const delay = Math.min(index * 50, 2000);
          const shouldLoadVideo = loadedVideoIds.has(item.id);
          
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
              {item.type === 'video' && (
                <VideoCard 
                  review={item.data}
                  isMuted={unmutedVideoId !== item.id}
                  onToggleMute={() => handleVideoToggleMute(item.id)}
                  onMuteButtonClick={() => handleMuteButtonClick(item.id)}
                  shouldLoad={shouldLoadVideo}
                />
              )}
              {item.type === 'before-after' && (
                <BeforeAfterCard 
                  review={item.data}
                  showAfter={getShowAfter(index)}
                  priority={index < 6}
                />
              )}
              {item.type === 'static' && (
                <StaticCard 
                  imageUrl={item.data.static_image_url || ''}
                  alt={item.data.name}
                  priority={index < 6}
                />
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
