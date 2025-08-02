import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

interface VideoGridProps {
  className?: string;
}

export const VideoGrid = ({ className }: VideoGridProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { profile } = useSession();

  const handleHaartransplantatieClick = () => {
    const path = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
    navigate(path);
  };

  const handleV6HairboostClick = () => {
    const path = language === 'nl' ? '/nl/v6-hairboost' : '/en/v6-hairboost';
    navigate(path);
  };

  // Generate dynamic background color based on selections
  const getBackgroundShade = (gridIndex: number) => {
    const baseShade = 95; // Start with very light gray
    const selections = [profile.geslacht, profile.haarkleur, profile.haartype];
    const selectionCount = selections.filter(Boolean).length;
    const adjustment = (selectionCount * 5) + (gridIndex * 3); // Slight variation per grid item
    return Math.max(85, baseShade - adjustment); // Keep it light but add subtle variation
  };

  const renderPlaceholderItem = (title: string, gridIndex: number, isActive: boolean) => {
    const bgShade = getBackgroundShade(gridIndex);
    const selectionInfo = `${profile.geslacht} • ${profile.haarkleur} • ${profile.haartype}`;
    
    return (
      <div 
        className={cn(
          "aspect-[4/3] relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
          isActive ? "cursor-pointer hover:scale-[1.02] group" : "cursor-not-allowed opacity-60"
        )}
        style={{ 
          backgroundColor: `rgb(${bgShade}%, ${bgShade}%, ${bgShade}%)`,
          borderColor: `rgb(${bgShade - 10}%, ${bgShade - 10}%, ${bgShade - 10}%)`
        }}
      >
        {/* Wireframe pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
            <defs>
              <pattern id={`wireframe-${gridIndex}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10,0 L 0,0 0,10" fill="none" stroke={`rgb(${bgShade - 20}%, ${bgShade - 20}%, ${bgShade - 20}%)`} strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="60" fill={`url(#wireframe-${gridIndex})`}/>
            
            {/* Central play icon wireframe */}
            <circle cx="50" cy="30" r="8" fill="none" stroke={`rgb(${bgShade - 25}%, ${bgShade - 25}%, ${bgShade - 25}%)`} strokeWidth="1"/>
            <polygon points="46,26 46,34 54,30" fill={`rgb(${bgShade - 25}%, ${bgShade - 25}%, ${bgShade - 25}%)`}/>
          </svg>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-3">
            <div className={`text-lg font-header font-bold tracking-wide`} style={{ color: `rgb(${bgShade - 40}%, ${bgShade - 40}%, ${bgShade - 40}%)` }}>
              {title}
            </div>
          </div>
          
          {/* Selection info label */}
          <div 
            className="absolute bottom-2 left-2 right-2 text-center text-xs font-mono px-2 py-1 rounded border border-dashed"
            style={{ 
              color: `rgb(${bgShade - 35}%, ${bgShade - 35}%, ${bgShade - 35}%)`,
              backgroundColor: `rgb(${bgShade + 2}%, ${bgShade + 2}%, ${bgShade + 2}%)`,
              borderColor: `rgb(${bgShade - 15}%, ${bgShade - 15}%, ${bgShade - 15}%)`
            }}
          >
            {selectionInfo}
          </div>
        </div>
        
        {isActive && (
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </div>
    );
  };

  return (
    <div className={cn("grid grid-cols-2 gap-3 relative w-full max-w-2xl", className)}>
      {/* Haartransplantatie - Top Left */}
      <div onClick={handleHaartransplantatieClick}>
        {renderPlaceholderItem("HAAR\nTRANSPLANTATIE", 0, true)}
      </div>

      {/* V6 Hairboost - Top Right */}
      <div onClick={handleV6HairboostClick}>
        {renderPlaceholderItem("V6\nHAIRBOOST", 1, true)}
      </div>

      {/* Coming Soon - Bottom Left */}
      {renderPlaceholderItem("COMING SOON", 2, false)}

      {/* Coming Soon - Bottom Right */}
      {renderPlaceholderItem("COMING SOON", 3, false)}
    </div>
  );
};