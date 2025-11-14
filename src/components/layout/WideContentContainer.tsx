import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WideContentContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * WideContentContainer - Wider container for desktop tab content
 * - Mobile/tablet: Full width (no changes)
 * - Desktop (lg+): 1400px max width, centered
 * - Use for tab content that needs more horizontal space
 */
export const WideContentContainer = ({ children, className }: WideContentContainerProps) => {
  return (
    <div className={cn(
      // Mobile: full width
      "w-full",
      // Desktop: fixed 1400px width, centered
      "lg:max-w-[1400px] lg:mx-auto",
      className
    )}>
      {children}
    </div>
  );
};
