import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DesktopContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * DesktopContainer - Adds responsive side margins for desktop-only boxed layout
 * - Mobile/tablet: Full width (no changes)
 * - Desktop (lg+): 15% side margins for less stretched feeling
 * - Only use on non-homepage pages
 */
export const DesktopContainer = ({ children, className }: DesktopContainerProps) => {
  return (
    <div className={cn(
      // Mobile: full width
      "w-full",
      // Desktop: 15% side margins (70% content width)
      "lg:px-[15vw]",
      className
    )}>
      {children}
    </div>
  );
};