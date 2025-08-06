import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InstagramPostProps {
  children: ReactNode;
  className?: string;
  postIndex: number;
  isActive?: boolean;
}

export const InstagramPost = ({ 
  children, 
  className = '', 
  postIndex, 
  isActive = false 
}: InstagramPostProps) => {
  return (
    <section 
      data-post-index={postIndex}
      className={cn(
        "min-h-screen w-full relative flex flex-col bg-background transition-all duration-500 ease-out snap-start",
        isActive && "scale-100 opacity-100",
        !isActive && "scale-95 opacity-80",
        className
      )}
    >
      {children}
    </section>
  );
};