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
        "h-screen w-full relative flex flex-col bg-background",
        className
      )}
      style={{
        height: '100vh',
        flexShrink: 0
      }}
    >
      {children}
    </section>
  );
};