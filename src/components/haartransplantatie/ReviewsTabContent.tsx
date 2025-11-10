import { ReviewsGrid } from '@/components/reviews/ReviewsGrid';

export const ReviewsTabContent = () => {
  return (
    <div className="h-full w-full overflow-y-auto flex items-center justify-center">
      <ReviewsGrid />
    </div>
  );
};
