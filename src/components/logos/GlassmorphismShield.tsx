import { cn } from '@/lib/utils';

interface GlassmorphismShieldProps {
  className?: string;
}

export const GlassmorphismShield = ({ className }: GlassmorphismShieldProps) => {
  return (
    <div 
      className={cn("absolute inset-0 w-full h-full", className)}
      style={{
        clipPath: 'polygon(50% 20%, 65% 25%, 68% 40%, 63% 55%, 50% 60%, 37% 55%, 32% 40%, 35% 25%)',
        background: 'rgba(59, 130, 246, 0.6)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '2px solid rgba(59, 130, 246, 0.8)',
        boxShadow: 'inset 0 2px 10px rgba(255, 255, 255, 0.3), 0 4px 20px rgba(59, 130, 246, 0.4)',
      }}
    />
  );
};