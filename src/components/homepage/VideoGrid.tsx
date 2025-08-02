import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface VideoGridProps {
  className?: string;
}

export const VideoGrid = ({ className }: VideoGridProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleHaartransplantatieClick = () => {
    const path = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
    navigate(path);
  };

  const handleV6HairboostClick = () => {
    const path = language === 'nl' ? '/nl/v6-hairboost' : '/en/v6-hairboost';
    navigate(path);
  };

  return (
    <div className={cn("grid grid-cols-2 gap-4 relative", className)}>
      {/* Haartransplantatie - Top Left */}
      <div
        onClick={handleHaartransplantatieClick}
        className={cn(
          "aspect-video bg-gray-900/90 backdrop-blur-sm rounded-xl overflow-hidden",
          "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-strong",
          "border border-white/10 relative group"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <div className="text-lg font-header font-semibold mb-2">HAAR</div>
            <div className="text-lg font-header font-semibold">TRANSPLANTATIE</div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* V6 Hairboost - Top Right */}
      <div
        onClick={handleV6HairboostClick}
        className={cn(
          "aspect-video bg-gray-900/90 backdrop-blur-sm rounded-xl overflow-hidden",
          "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-strong",
          "border border-white/10 relative group"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <div className="text-lg font-header font-semibold mb-2">V6</div>
            <div className="text-lg font-header font-semibold">HAIRBOOST</div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Coming Soon - Bottom Left */}
      <div className={cn(
        "aspect-video bg-gray-800/40 backdrop-blur-md rounded-xl",
        "border border-white/5 relative opacity-40",
        "cursor-not-allowed select-none pointer-events-none"
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/60 p-4">
            <div className="text-sm font-header font-medium">COMING SOON</div>
          </div>
        </div>
      </div>

      {/* Coming Soon - Bottom Right */}
      <div className={cn(
        "aspect-video bg-gray-800/40 backdrop-blur-md rounded-xl",
        "border border-white/5 relative opacity-40",
        "cursor-not-allowed select-none pointer-events-none"
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/60 p-4">
            <div className="text-sm font-header font-medium">COMING SOON</div>
          </div>
        </div>
      </div>
    </div>
  );
};