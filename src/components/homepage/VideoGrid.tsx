import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import hairBlonde from '@/assets/hair-blonde.jpg';
import hairDark from '@/assets/hair-dark.jpg';
import hairBrown from '@/assets/hair-brown.jpg';
import hairGray from '@/assets/hair-gray.jpg';

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
    <div className={cn("grid grid-cols-2 gap-3 relative w-full max-w-2xl", className)}>
      {/* Haartransplantatie - Top Left */}
      <div
        onClick={handleHaartransplantatieClick}
        className={cn(
          "aspect-[4/3] relative overflow-hidden rounded-2xl cursor-pointer",
          "transition-all duration-300 hover:scale-[1.02] group"
        )}
        style={{
          backgroundImage: `url(${hairBlonde})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="text-lg font-header font-bold tracking-wide">HAAR</div>
            <div className="text-lg font-header font-bold tracking-wide">TRANSPLANTATIE</div>
          </div>
        </div>
      </div>

      {/* V6 Hairboost - Top Right */}
      <div
        onClick={handleV6HairboostClick}
        className={cn(
          "aspect-[4/3] relative overflow-hidden rounded-2xl cursor-pointer",
          "transition-all duration-300 hover:scale-[1.02] group"
        )}
        style={{
          backgroundImage: `url(${hairDark})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="text-lg font-header font-bold tracking-wide">V6</div>
            <div className="text-lg font-header font-bold tracking-wide">HAIRBOOST</div>
          </div>
        </div>
      </div>

      {/* Coming Soon - Bottom Left */}
      <div 
        className={cn(
          "aspect-[4/3] relative overflow-hidden rounded-2xl opacity-60",
          "cursor-not-allowed select-none"
        )}
        style={{
          backgroundImage: `url(${hairBrown})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/80 px-4">
            <div className="text-lg font-header font-bold tracking-wide">COMING SOON</div>
          </div>
        </div>
      </div>

      {/* Coming Soon - Bottom Right */}
      <div 
        className={cn(
          "aspect-[4/3] relative overflow-hidden rounded-2xl opacity-60",
          "cursor-not-allowed select-none"
        )}
        style={{
          backgroundImage: `url(${hairGray})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/80 px-4">
            <div className="text-lg font-header font-bold tracking-wide">COMING SOON</div>
          </div>
        </div>
      </div>
    </div>
  );
};