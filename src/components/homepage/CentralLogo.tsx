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
      "animate-glance",
      className
    )}
    style={{ 
      borderRadius: '12px',
      background: 'linear-gradient(145deg, #1E3340, #16232B)',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      boxShadow: `
        0 8px 32px rgba(0,0,0,0.4),
        0 0 0 1px rgba(255,255,255,0.05) inset
      `
    }}
    >
      {/* Subtle moving glare effect */}
      <div 
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700"
        style={{
          borderRadius: '12px',
          background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.4) 55%, transparent 100%)',
          transform: 'translateX(-100%)',
          animation: 'glance-sweep 8s ease-in-out infinite'
        }}
      />
      
      <img 
        src="/lovable-uploads/d8eb3cb6-12d3-4e19-8d1a-70fc0bbbecb2.png" 
        alt="GlobalHair Logo" 
        className="w-16 h-16 object-contain drop-shadow-lg relative z-10 group-hover:drop-shadow-xl transition-all duration-500"
      />
    </div>
  );
};