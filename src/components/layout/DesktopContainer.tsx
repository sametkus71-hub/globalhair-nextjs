import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DesktopContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * DesktopContainer - Fixed width container for desktop-only boxed layout
 * - Mobile/tablet: Full width (no changes)
 * - Desktop (lg+): 500px fixed width, centered, matching homepage grid items
 * - Only use on non-homepage pages
 */
export const DesktopContainer = ({ children, className }: DesktopContainerProps) => {
  return (
    <div className={cn(
      // Mobile: full width
      "w-full",
      // Desktop: fixed 500px width, centered
      "lg:max-w-[500px] lg:mx-auto",
      className
    )}>
      {children}
    </div>
  );
};