import { cn } from '@/lib/utils';
import reviewsIcon from '@/assets/reviews-icon.png';

interface ReviewIconProps {
  className?: string;
}

export const ReviewIcon = ({ className }: ReviewIconProps) => {
  return (
    <img 
      src={reviewsIcon}
      alt="Reviews"
      className={cn("w-full h-full", className)}
    />
  );
};