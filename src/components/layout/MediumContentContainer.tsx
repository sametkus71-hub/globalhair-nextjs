import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MediumContentContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * MediumContentContainer - Medium width container for desktop content
 * - Mobile/tablet: Full width (no changes)
 * - Desktop (lg+): 1000px max width, centered
 * - Use for contact and similar pages that need medium-width layout
 */
export const MediumContentContainer = ({ children, className }: MediumContentContainerProps) => {
  return (
    <div className={cn(
      // Mobile: full width
      "w-full",
      // Desktop: fixed 1000px width, centered
      "lg:max-w-[1000px] lg:mx-auto",
      className
    )}>
      {children}
    </div>
  );
};
