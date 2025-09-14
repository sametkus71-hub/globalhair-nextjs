import { cn } from '@/lib/utils';

interface BookIconProps {
  className?: string;
}

export const BookIcon = ({ className }: BookIconProps) => {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
    >
      <path 
        d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8C20 6.89543 19.1046 6 18 6H8V4C8 2.89543 7.10457 2 6 2ZM6 4V20H4V4H6ZM8 8H18V20H8V8ZM10 10V12H16V10H10ZM10 14V16H16V14H10Z" 
        fill="white"
      />
    </svg>
  );
};