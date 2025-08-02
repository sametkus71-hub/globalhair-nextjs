import { cn } from '@/lib/utils';

interface CentralLogoProps {
  className?: string;
}

export const CentralLogo = ({ className }: CentralLogoProps) => {
  return (
    <div className={cn(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
      "w-24 h-24 group",
      "flex items-center justify-center",
      "transition-all duration-500 hover:scale-105",
      "animate-pulse-subtle",
      className
    )}
    style={{ 
      borderRadius: '19px',
      background: 'linear-gradient(145deg, #1E3340, #16232B)',
      border: '0.79px solid rgba(255, 255, 255, 0.8)',
      boxShadow: `
        0 8px 32px rgba(0,0,0,0.4),
        0 0 0 1px rgba(255,255,255,0.1) inset,
        0 2px 4px rgba(255,255,255,0.2) inset
      `
    }}
    >
      {/* Subtle glare effect */}
      <div 
        className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
        style={{
          borderRadius: '19px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%)'
        }}
      />
      
      <img 
        src="/lovable-uploads/d8eb3cb6-12d3-4e19-8d1a-70fc0bbbecb2.png" 
        alt="GlobalHair Logo" 
        className="w-14 h-14 object-contain drop-shadow-lg relative z-10 group-hover:drop-shadow-xl transition-all duration-500"
      />
    </div>
  );
};