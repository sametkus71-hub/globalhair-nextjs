'use client';

import { useEffect, useState, useRef, memo, useCallback } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useVideoIntersection } from '@/hooks/useVideoIntersection';
import { ReviewsSkeleton } from './ReviewsSkeleton';
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

// Global video queue manager - limits concurrent video loading
class VideoLoadQueue {
  private loadedVideos = new Set<string>();
  private readonly maxConcurrent = 2; // Maximum 2 videos loading/playing at once

  canLoad(videoId: string): boolean {
    return this.loadedVideos.has(videoId) || this.loadedVideos.size < this.maxConcurrent;
  }

  addVideo(videoId: string): boolean {
    if (this.loadedVideos.size >= this.maxConcurrent && !this.loadedVideos.has(videoId)) {
      return false; // Queue is full
    }
    this.loadedVideos.add(videoId);
    return true;
  }

  removeVideo(videoId: string): void {
    this.loadedVideos.delete(videoId);
  }

  getLoadedCount(): number {
    return this.loadedVideos.size;
  }
}

// Global singleton instance
const videoQueue = new VideoLoadQueue();

const VideoCard = memo(({
  review,
  isMuted,
  onToggleMute,
  onMuteButtonClick,
}: {
  review: Review;
  isMuted: boolean;
  onToggleMute: () => void;
  onMuteButtonClick: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Simple viewport detection
  const { isInViewport, elementRef } = useVideoIntersection({
    threshold: 0,
    rootMargin: '200px'
  });

  // Load video when in viewport
  useEffect(() => {
    if (isInViewport && !hasLoaded) {
      setHasLoaded(true);
    } else if (!isInViewport && hasLoaded) {
      setHasLoaded(false);
    }
  }, [isInViewport, hasLoaded]);

  // Auto-play when loaded
  useEffect(() => {
    if (!videoRef.current || !hasLoaded) return;

    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Auto-play prevented:', err);
      });
    }
  }, [hasLoaded]);

  // Handle mute
  useEffect(() => {
    if (videoRef.current && hasLoaded) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, hasLoaded]);

  return (
    <div
      ref={elementRef}
      className="w-full h-full relative overflow-hidden bg-black cursor-pointer group"
      onClick={onToggleMute}
    >
      {!hasLoaded ? (
        // Placeholder when not in viewport
        <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
          {review.static_image_url ? (
            <img
              src={review.static_image_url}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
              alt="Video thumbnail"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
          <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center z-10 scale-90 opacity-80">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={review.video_url || ''}
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        />
      )}

      {/* Mute toggle button */}
      <button
        className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm p-2 rounded-full cursor-pointer hover:bg-black/80 transition-colors z-20"
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
  const actualScrollContainerRef = useRef<HTMLElement | null>(null);

  // Fetch reviews from database
  const { data: reviewsData, isLoading, error } = useReviewsData();

  // Generate randomized grid
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [beforeAfterIndices, setBeforeAfterIndices] = useState<number[]>([]);

  // Progressive rendering state
  const initialCount = isMobile ? 12 : 24;
  const batchSize = isMobile ? 8 : 16;
  const [renderedCount, setRenderedCount] = useState(initialCount);

  // Animation and interaction states
  const [cyclePhase, setCyclePhase] = useState(0);
  const [unmutedVideoId, setUnmutedVideoId] = useState<string | null>(null);
  // Removed global loadedVideoIds - deferring to IntersectionObserver in VideoCard

  // Generate grid when reviews change
  useEffect(() => {
    if (reviewsData) {
      const items = generateRandomGrid(reviewsData);
      setGridItems(items);
      setBeforeAfterIndices(getBeforeAfterIndices(items));
    }
  }, [reviewsData]);

  // Check if there are more items to load
  const hasMoreItems = renderedCount < gridItems.length;
  const isLoadingMore = useRef(false);

  // Horizontal scroll detection for infinite loading
  const handleScroll = useCallback(() => {
    const container = actualScrollContainerRef.current;
    if (!container || !hasMoreItems || isLoadingMore.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const scrollThreshold = 300; // pixels from end to trigger load

    // console.log('Scroll detected:', { scrollLeft, scrollWidth, clientWidth, threshold: scrollWidth - scrollThreshold });

    if (scrollLeft + clientWidth >= scrollWidth - scrollThreshold) {
      // console.log('Loading more items...');
      isLoadingMore.current = true;
      setTimeout(() => {
        setRenderedCount(prev => Math.min(prev + batchSize, gridItems.length));
        isLoadingMore.current = false;
      }, 100);
    }
  }, [hasMoreItems, batchSize, gridItems.length]);

  // Attach scroll listener to parent scroll container
  useEffect(() => {
    const gridElement = gridContainerRef.current;
    if (!gridElement) return;

    // Find the actual scrolling container (parent with overflow scroll)
    const scrollContainer = gridElement.parentElement;
    if (!scrollContainer) return;

    // Store reference for use in handleScroll
    actualScrollContainerRef.current = scrollContainer;

    // console.log('Attaching scroll listener to:', scrollContainer);

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleVideoToggleMute = (videoId: string) => {
    setUnmutedVideoId(prevId => prevId === videoId ? null : videoId);
  };

  const handleMuteButtonClick = (videoId: string) => {
    setUnmutedVideoId(prevId => prevId === videoId ? null : videoId);
  };

  // Reset rendered count when grid items change
  useEffect(() => {
    if (gridItems.length > 0) {
      setRenderedCount(Math.min(initialCount, gridItems.length));
    }
  }, [gridItems.length, initialCount]);

  // Before/After cycling effect
  useEffect(() => {
    if (beforeAfterIndices.length === 0) return;

    const interval = setInterval(() => {
      setCyclePhase(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [beforeAfterIndices.length]);

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
    };
  }, []);

  // Loading state
  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[370px] md:h-[540px]">
        <div className="text-red-400">Failed to load reviews</div>
      </div>
    );
  }

  const itemsToRender = gridItems.slice(0, renderedCount);

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
          "grid grid-rows-3"
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

          return (
            <div
              key={item.id}
              className={cn(
                "cursor-default border border-white/30 bg-black/40",
                item.width === 2 && "col-span-2",
                item.height === 2 && "row-span-2"
              )}
              style={{
                contain: 'paint layout',
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

        {/* Loading indicator - only show when more items available */}
        {hasMoreItems && (
          <div className="row-span-3 w-8 flex items-center justify-center">
            <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* CSS Removed: .silver-grey-gradient-border is gone for performance */}
      <style>{`
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
