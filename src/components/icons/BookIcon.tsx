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
        d="M4 3C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V19C2 19.5304 2.21071 20.0391 2.58579 20.4142C2.96086 20.7893 3.46957 21 4 21H20C20.5304 21 21.0391 20.7893 21.4142 20.4142C21.7893 20.0391 22 19.5304 22 19V7C22 6.46957 21.7893 5.96086 21.4142 5.58579C21.0391 5.21071 20.5304 5 20 5H6V3H4ZM6 7H20V19H4V5H6V7ZM8 9V11H10V9H8ZM12 9V11H18V9H12ZM8 13V15H10V13H8ZM12 13V15H18V13H12Z" 
        fill="white"
      />
    </svg>
  );
};