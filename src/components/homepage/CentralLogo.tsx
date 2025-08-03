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
      background: 'linear-gradient(145deg, #1E3340, #16232B, #0F1A21)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset'
    }}
    >
      <img 
        src="/lovable-uploads/3adf7589-3704-4c29-800c-e2566de7ae5f.png" 
        alt="GlobalHair Shield Logo" 
        className="w-20 h-20 object-contain"
      />
    </div>
  );
};