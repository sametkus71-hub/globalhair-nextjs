import { cn } from '@/lib/utils';

interface GridIconProps {
  className?: string;
}

export const GridIcon = ({ className }: GridIconProps) => {
  return (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 14 14" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
    >
      <rect x="0.239639" y="0.748779" width="5.7567" height="5.7567" rx="1.35452" fill="white"/>
      <rect x="7.27959" y="0.748779" width="5.7567" height="5.7567" rx="1.35452" fill="white"/>
      <rect x="0.239639" y="7.7887" width="5.7567" height="5.7567" rx="1.35452" fill="white"/>
      <rect x="7.27959" y="7.7887" width="5.7567" height="5.7567" rx="1.35452" fill="white"/>
    </svg>
  );
};