import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
}

export const CentralLogo = ({ className }: CentralLogoProps) => {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
      "w-20 h-20",
      "flex items-center justify-center",
      "transition-all duration-300 hover:scale-105",
      className
    )}
    style={{ 
      borderRadius: '10px',
      background: 'linear-gradient(145deg, #1E3340, #16232B)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
    }}
    >
      <img 
        src="/lovable-uploads/d8eb3cb6-12d3-4e19-8d1a-70fc0bbbecb2.png" 
        alt="GlobalHair Logo" 
        className="w-12 h-12 object-contain"
      />
    </div>
  );
};