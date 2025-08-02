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

  // Generate dynamic content and styling based on selections
  const getItemVariation = (gridIndex: number) => {
    const selections = [profile.geslacht, profile.haarkleur, profile.haartype];
    const hash = selections.join('').length + gridIndex;
    
    // Base darkness starts light and gets darker with more selections
    const selectionCount = selections.filter(Boolean).length;
    const baseDarkness = 15 + (selectionCount * 8) + (hash % 10); // 15-50 range
    
    // Generate different wireframe patterns
    const patternType = hash % 3;
    const contentVariation = (hash % 4) + 1;
    
    return { baseDarkness, patternType, contentVariation };
  };

  const renderPlaceholderItem = (title: string, gridIndex: number, isActive: boolean) => {
    const { baseDarkness, patternType, contentVariation } = getItemVariation(gridIndex);
    const bgColor = `rgb(${100 - baseDarkness}%, ${100 - baseDarkness}%, ${100 - baseDarkness}%)`;
    const borderColor = `rgb(${95 - baseDarkness}%, ${95 - baseDarkness}%, ${95 - baseDarkness}%)`;
    const textColor = `rgb(${60 - baseDarkness}%, ${60 - baseDarkness}%, ${60 - baseDarkness}%)`;
    const wireColor = `rgb(${85 - baseDarkness}%, ${85 - baseDarkness}%, ${85 - baseDarkness}%)`;
    
    const selectionInfo = `${profile.geslacht} • ${profile.haarkleur} • ${profile.haartype}`;
    
    // Dynamic content based on selection
    const dynamicContent = {
      1: "Preview A",
      2: "Preview B", 
      3: "Preview C",
      4: "Preview D"
    };
    
    return (
      <div 
        className={cn(
          "aspect-[3/4] relative overflow-hidden rounded-lg border transition-all duration-500",
          isActive ? "cursor-pointer hover:scale-[1.01] group" : "cursor-not-allowed opacity-60"
        )}
        style={{ 
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        {/* Dynamic wireframe pattern overlay */}
        <div className="absolute inset-0 opacity-40">
          <svg className="w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
            <defs>
              <pattern id={`wireframe-${gridIndex}-${contentVariation}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                {patternType === 0 && (
                  <path d="M 8,0 L 0,0 0,8" fill="none" stroke={wireColor} strokeWidth="0.3"/>
                )}
                {patternType === 1 && (
                  <>
                    <circle cx="4" cy="4" r="1" fill={wireColor} opacity="0.3"/>
                    <path d="M 8,0 L 0,0 0,8" fill="none" stroke={wireColor} strokeWidth="0.2"/>
                  </>
                )}
                {patternType === 2 && (
                  <path d="M 0,0 L 8,8 M 0,8 L 8,0" fill="none" stroke={wireColor} strokeWidth="0.2"/>
                )}
              </pattern>
            </defs>
            <rect width="100" height="80" fill={`url(#wireframe-${gridIndex}-${contentVariation})`}/>
            
            {/* Dynamic central elements */}
            <rect x="30" y="25" width="40" height="30" fill="none" stroke={wireColor} strokeWidth="0.8" opacity="0.6"/>
            <circle cx="50" cy="40" r="6" fill="none" stroke={wireColor} strokeWidth="0.8"/>
            <polygon points="47,37 47,43 53,40" fill={wireColor} opacity="0.7"/>
            
            {/* Variation elements */}
            {contentVariation === 1 && (
              <rect x="20" y="15" width="60" height="50" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.4"/>
            )}
            {contentVariation === 2 && (
              <>
                <circle cx="25" cy="20" r="3" fill="none" stroke={wireColor} strokeWidth="0.5"/>
                <circle cx="75" cy="60" r="3" fill="none" stroke={wireColor} strokeWidth="0.5"/>
              </>
            )}
            {contentVariation === 3 && (
              <path d="M 20,20 Q 50,10 80,20 Q 70,50 50,60 Q 30,50 20,20" fill="none" stroke={wireColor} strokeWidth="0.5" opacity="0.5"/>
            )}
          </svg>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
          <div className="text-center mb-2">
            <div className="text-sm font-header font-bold tracking-wide leading-tight" style={{ color: textColor }}>
              {title}
            </div>
            <div className="text-xs opacity-60 mt-1" style={{ color: textColor }}>
              {dynamicContent[contentVariation as keyof typeof dynamicContent]}
            </div>
          </div>
        </div>
        
        {/* Selection info label */}
        <div 
          className="absolute bottom-1.5 left-1.5 right-1.5 text-center text-[9px] font-mono px-1.5 py-0.5 rounded border"
          style={{ 
            color: textColor,
            backgroundColor: `rgb(${102 - baseDarkness}%, ${102 - baseDarkness}%, ${102 - baseDarkness}%)`,
            borderColor: borderColor,
            opacity: 0.8
          }}
        >
          {selectionInfo}
        </div>
        
        {isActive && (
          <div className="absolute inset-0 bg-black/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </div>
    );
  };

  return (
    <div className={cn("grid grid-cols-2 gap-4 relative w-full max-w-3xl", className)}>
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