import { ReviewsGrid } from '@/components/reviews/ReviewsGrid';

export const ReviewsTabContent = () => {
  return (
    <div className="h-full w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
      <ReviewsGrid />
    </div>
  );
};
