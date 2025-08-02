import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
}

export const CentralLogo = ({ className }: CentralLogoProps) => {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
      "w-24 h-24",
      "flex items-center justify-center",
      "transition-all duration-300 hover:scale-105",
      className
    )}
    style={{ 
      borderRadius: '16px',
      background: 'linear-gradient(145deg, #1E3340, #16232B)',
      border: '1.5px solid',
      borderImage: 'linear-gradient(145deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3), rgba(255,255,255,0.6)) 1',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset'
    }}
    >
      <img 
        src="/lovable-uploads/d8eb3cb6-12d3-4e19-8d1a-70fc0bbbecb2.png" 
        alt="GlobalHair Logo" 
        className="w-18 h-18 object-contain"
      />
    </div>
  );
};