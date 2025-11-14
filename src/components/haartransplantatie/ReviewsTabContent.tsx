import { ReviewsGrid } from '@/components/reviews/ReviewsGrid';

export const ReviewsTabContent = () => {
  return (
    <>
      <div className="reviews-scrollbar h-full w-full overflow-x-auto overflow-y-hidden flex items-center">
        <ReviewsGrid />
      </div>
      
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
