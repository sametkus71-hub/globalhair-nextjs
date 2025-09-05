import { cn } from '@/lib/utils';

interface GlassmorphismShieldProps {
  className?: string;
}

export const GlassmorphismShield = ({ className }: GlassmorphismShieldProps) => {
  return (
    <div className={cn("absolute inset-0 w-full h-full", className)}>
      {/* Hidden SVG definition for clipPath */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="shield-glass-clip" clipPathUnits="userSpaceOnUse">
            <path d="M256,296.81l-1.39-.64c-27.82-12.8-50.21-25.2-64.21-57.93-13.23-30.94-12.19-101.68-12.14-104.68l.06-3.27h3.27c16.61,0,72.69-20.79,73.26-21l1.16-.43,1.16.43c.56.21,56.65,21,73.26,21h3.27l.06,3.27c.05,3,1.09,73.73-12.14,104.68-14,32.73-36.39,45.13-64.21,57.93l-1.39.64h-.02ZM184.88,136.75c-.05,14.1.46,72.76,11.63,98.87,12.87,30.1,32.8,41.51,59.49,53.87,26.69-12.35,46.62-23.77,59.49-53.87,11.16-26.11,11.67-84.77,11.63-98.87-19.04-1.89-63.17-17.88-71.12-20.8-7.94,2.92-52.08,18.91-71.12,20.8Z"/>
          </clipPath>
        </defs>
      </svg>
      
      {/* Glassmorphism div with exact shield clipping */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          clipPath: 'url(#shield-glass-clip)',
          background: 'rgba(59, 130, 246, 0.4)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(59, 130, 246, 0.6)',
          boxShadow: 'inset 0 2px 10px rgba(255, 255, 255, 0.2), 0 4px 20px rgba(59, 130, 246, 0.3)',
        }}
      />
    </div>
  );
};