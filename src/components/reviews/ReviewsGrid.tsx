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
import { BerkantVideoItem } from '@/data/berkantVideos';
import { VolumeX, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// Remove interfaces - no longer needed for static implementation

const QuoteCard = ({ quote, shouldLoad }: { quote: QuoteImage; shouldLoad: boolean }) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gray-800">
      {shouldLoad ? (
        <img 
          src={quote.src} 
          alt={quote.alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-800" />
      )}
    </div>
  );
};

const VideoCard = ({ 
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
};

const BeforeAfterCard = ({ item, shouldLoad }: { item: BeforeAfterItem; shouldLoad: boolean }) => (
  <div className="w-full h-full relative overflow-hidden bg-gray-800">
    {shouldLoad ? (
      <img 
        src={item.image}
        alt="Hair transplant before/after result"
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
    ) : (
      <div className="w-full h-full bg-gray-800" />
    )}
  </div>
);

export const ReviewsGrid = () => {
  const { language } = useLanguage();
  const { slideToItem } = useSlideTransition();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Generate random grid on component mount
  const [gridItems] = useState<GridItem[]>(() => generateRandomGrid());
  
  // Track which items are in viewport for lazy loading
  const [loadedItems, setLoadedItems] = useState<Set<string>>(new Set());
  
  // Refs for intersection observers
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // State for video muting - track which video is currently unmuted (if any)
  const [unmutedVideoId, setUnmutedVideoId] = useState<string | null>(null);
  
  // Grid animation state - single boolean for triggering CSS animation
  const [isGridAnimated, setIsGridAnimated] = useState(false);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute('data-item-id');
            if (itemId) {
              setLoadedItems(prev => new Set(prev).add(itemId));
            }
          }
        });
      },
      {
        rootMargin: '200px',
        threshold: 0.01
      }
    );

    itemRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [gridItems]);

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

  return (
    <div className="relative w-full h-full">
      <div
        className={cn(
          "grid h-full",
          isGridAnimated && "grid-animate"
        )}
        style={{
          gridTemplateRows: 'repeat(3, 1fr)',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(calc((100vh - 240px) / 3), 1fr)',
          gap: '4px',
          width: 'max-content',
          minWidth: '100%'
        }}
      >
        {gridItems.map((item, index) => {
          // Guard against undefined data
          if (!item?.data) return null;
          
          const delay = index * 50;
          const isLoaded = loadedItems.has(item.id);
          
          return (
            <div
              key={item.id}
              ref={(el) => {
                if (el) itemRefs.current.set(item.id, el);
              }}
              data-item-id={item.id}
              className={cn(
                "grid-item-entrance cursor-default silver-grey-gradient-border",
                item.rowSpan === 2 && "row-span-2",
                item.colSpan === 2 && "col-span-2"
              )}
              style={{
                '--delay': `${delay}ms`,
                contain: 'content',
                borderRadius: '12px',
                overflow: 'hidden'
              } as React.CSSProperties}
            >
              {item.type === 'quote' && (
                <QuoteCard quote={item.data} shouldLoad={isLoaded} />
              )}
              {(item.type === 'video' || item.type === 'berkant-video') && (
                <VideoCard 
                  video={item.data} 
                  isMuted={unmutedVideoId !== item.id}
                  onToggleMute={() => handleVideoToggleMute(item.id, item)}
                  onMuteButtonClick={() => handleMuteButtonClick(item.id)}
                  shouldLoad={isLoaded}
                  isBerkantVideo={item.type === 'berkant-video'}
                />
              )}
              {item.type === 'before-after' && (
                <BeforeAfterCard item={item.data} shouldLoad={isLoaded} />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .silver-grey-gradient-border {
          position: relative;
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
        }

        .silver-grey-gradient-border > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};