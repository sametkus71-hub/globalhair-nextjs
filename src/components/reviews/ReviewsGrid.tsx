import { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { testimonialReviews, TestimonialReview } from '@/data/reviewsTestimonials';


const ReviewCard = ({ review, shouldLoad }: { review: TestimonialReview; shouldLoad: boolean }) => {
  return (
    <div className={cn(
      "group w-full h-full relative overflow-hidden transition-all duration-300",
      "hover:scale-[1.02] hover:shadow-2xl",
      review.isLarge ? "row-span-2 col-span-2" : "row-span-1 col-span-1"
    )}
    style={{
      borderRadius: '16px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    }}
    >
      {shouldLoad ? (
        <>
          <img 
            src={review.photo} 
            alt={`${review.name} testimonial`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            style={{
              backdropFilter: 'blur(2px)',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
            <p className={cn(
              "font-light mb-2 leading-relaxed",
              review.isLarge ? "text-base md:text-lg" : "text-sm md:text-base"
            )}>
              "{review.testimonial}"
            </p>
            <p className={cn(
              "font-semibold",
              review.isLarge ? "text-base md:text-lg" : "text-sm"
            )}>
              — {review.name}
            </p>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-slate-800/50 animate-pulse" />
      )}
    </div>
  );
};

export const ReviewsGrid = () => {
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [loadedItems, setLoadedItems] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Create infinite loop by tripling the reviews
  const infiniteReviews = [...testimonialReviews, ...testimonialReviews, ...testimonialReviews];

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
  }, [infiniteReviews]);

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Infinite scroll loop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;
      const sectionWidth = scrollWidth / 3;

      // Loop back to middle section when reaching end
      if (scrollLeft >= sectionWidth * 2 - clientWidth) {
        container.scrollLeft = sectionWidth;
      }
      // Loop to middle section when scrolling backwards past start
      else if (scrollLeft <= 0) {
        container.scrollLeft = sectionWidth;
      }
    };

    container.addEventListener('scroll', handleScroll);
    // Start at middle section
    container.scrollLeft = container.scrollWidth / 3;

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="relative w-full h-full"
      style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d1b4e 50%, #1a2332 100%)',
      }}
    >
      <div
        ref={scrollContainerRef}
        className={cn(
          "h-full overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab",
          isDragging && "cursor-grabbing select-none",
          isMobile ? "grid grid-cols-2 gap-2 p-2" : "grid"
        )}
        style={isMobile ? {} : {
          gridTemplateRows: 'repeat(3, 1fr)',
          gridAutoFlow: 'column',
          gridAutoColumns: '1fr',
          gap: '12px',
          padding: '12px',
        }}
        onMouseDown={!isMobile ? handleMouseDown : undefined}
        onMouseMove={!isMobile ? handleMouseMove : undefined}
        onMouseUp={!isMobile ? handleMouseUp : undefined}
        onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      >
        {infiniteReviews.map((review, index) => {
          const itemId = `${review.id}-${index}`;
          const isLoaded = loadedItems.has(itemId);
          
          return (
            <div
              key={itemId}
              ref={(el) => {
                if (el) itemRefs.current.set(itemId, el);
              }}
              data-item-id={itemId}
              className={cn(
                isMobile && review.isLarge && "col-span-2"
              )}
            >
              <ReviewCard review={review} shouldLoad={isLoaded} />
            </div>
          );
        })}
      </div>
    </div>
  );
};