'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewsGrid } from '@/components/reviews/ReviewsGrid';

export const ReviewsTabContent = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setAtStart(scrollLeft === 0);
    setAtEnd(Math.abs(scrollWidth - clientWidth - scrollLeft) < 1);
  };

  useEffect(() => {
    checkScrollPosition();
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -400,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: 400,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div 
        ref={scrollContainerRef}
        onScroll={checkScrollPosition}
        className="reviews-scrollbar h-full w-full overflow-x-auto overflow-y-hidden flex items-center lg:pl-[20vw]"
      >
        <ReviewsGrid />
      </div>

      {/* Desktop-only scroll buttons */}
      {!atStart && (
        <button 
          onClick={scrollLeft}
          className="hidden md:flex fixed bottom-24 right-20 z-[10001] items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-white/20 transition-all duration-200 pointer-events-auto"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}
      {!atEnd && (
        <button 
          onClick={scrollRight}
          className="hidden md:flex fixed bottom-24 right-6 z-[10001] items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-white/20 transition-all duration-200 pointer-events-auto"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}
      
      {/* Desktop-only custom scrollbar */}
      <style>{`
        @media (min-width: 768px) {
          .reviews-scrollbar::-webkit-scrollbar {
            height: 6px;
          }

          .reviews-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
          }

          .reviews-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }

          .reviews-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.35);
          }

          /* Firefox */
          .reviews-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
          }
        }
      `}</style>
    </>
  );
};
