import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface VideoGridProps {
  className?: string;
  heightBreakpoint?: 'small' | 'medium' | 'large';
}

export const VideoGrid = ({ className, heightBreakpoint = 'large' }: VideoGridProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { profile } = useSession();
  const [animationKey, setAnimationKey] = useState(0);

  // Force re-render with animation when profile changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [profile.geslacht, profile.haarkleur, profile.haartype]);

  const handleHaartransplantatieClick = () => {
    const path = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
    navigate(path);
  };

  const handleV6HairboostClick = () => {
    const path = language === 'nl' ? '/nl/v6-hairboost' : '/en/v6-hairboost';
    navigate(path);
  };

  // All 32 possible combinations (2 genders × 4 colors × 4 types)
  const previewVariations = {
    // Man combinations
    "Man-Blond-Fijn": { preview: "MA-BL-FI", pattern: 0, content: 1, darkness: 15 },
    "Man-Blond-Stijl": { preview: "MA-BL-ST", pattern: 1, content: 2, darkness: 18 },
    "Man-Blond-Krul": { preview: "MA-BL-KR", pattern: 2, content: 3, darkness: 21 },
    "Man-Blond-Kroes": { preview: "MA-BL-KS", pattern: 0, content: 4, darkness: 24 },
    "Man-Bruin-Fijn": { preview: "MA-BR-FI", pattern: 1, content: 5, darkness: 27 },
    "Man-Bruin-Stijl": { preview: "MA-BR-ST", pattern: 2, content: 6, darkness: 30 },
    "Man-Bruin-Krul": { preview: "MA-BR-KR", pattern: 0, content: 7, darkness: 33 },
    "Man-Bruin-Kroes": { preview: "MA-BR-KS", pattern: 1, content: 8, darkness: 36 },
    "Man-Zwart-Fijn": { preview: "MA-ZW-FI", pattern: 2, content: 9, darkness: 39 },
    "Man-Zwart-Stijl": { preview: "MA-ZW-ST", pattern: 0, content: 10, darkness: 42 },
    "Man-Zwart-Krul": { preview: "MA-ZW-KR", pattern: 1, content: 11, darkness: 45 },
    "Man-Zwart-Kroes": { preview: "MA-ZW-KS", pattern: 2, content: 12, darkness: 48 },
    "Man-Wit-Fijn": { preview: "MA-WI-FI", pattern: 0, content: 13, darkness: 20 },
    "Man-Wit-Stijl": { preview: "MA-WI-ST", pattern: 1, content: 14, darkness: 23 },
    "Man-Wit-Krul": { preview: "MA-WI-KR", pattern: 2, content: 15, darkness: 26 },
    "Man-Wit-Kroes": { preview: "MA-WI-KS", pattern: 0, content: 16, darkness: 29 },
    
    // Vrouw combinations
    "Vrouw-Blond-Fijn": { preview: "VR-BL-FI", pattern: 1, content: 17, darkness: 32 },
    "Vrouw-Blond-Stijl": { preview: "VR-BL-ST", pattern: 2, content: 18, darkness: 35 },
    "Vrouw-Blond-Krul": { preview: "VR-BL-KR", pattern: 0, content: 19, darkness: 38 },
    "Vrouw-Blond-Kroes": { preview: "VR-BL-KS", pattern: 1, content: 20, darkness: 41 },
    "Vrouw-Bruin-Fijn": { preview: "VR-BR-FI", pattern: 2, content: 21, darkness: 44 },
    "Vrouw-Bruin-Stijl": { preview: "VR-BR-ST", pattern: 0, content: 22, darkness: 47 },
    "Vrouw-Bruin-Krul": { preview: "VR-BR-KR", pattern: 1, content: 23, darkness: 25 },
    "Vrouw-Bruin-Kroes": { preview: "VR-BR-KS", pattern: 2, content: 24, darkness: 28 },
    "Vrouw-Zwart-Fijn": { preview: "VR-ZW-FI", pattern: 0, content: 25, darkness: 31 },
    "Vrouw-Zwart-Stijl": { preview: "VR-ZW-ST", pattern: 1, content: 26, darkness: 34 },
    "Vrouw-Zwart-Krul": { preview: "VR-ZW-KR", pattern: 2, content: 27, darkness: 37 },
    "Vrouw-Zwart-Kroes": { preview: "VR-ZW-KS", pattern: 0, content: 28, darkness: 40 },
    "Vrouw-Wit-Fijn": { preview: "VR-WI-FI", pattern: 1, content: 29, darkness: 43 },
    "Vrouw-Wit-Stijl": { preview: "VR-WI-ST", pattern: 2, content: 30, darkness: 46 },
    "Vrouw-Wit-Krul": { preview: "VR-WI-KR", pattern: 0, content: 31, darkness: 22 },
    "Vrouw-Wit-Kroes": { preview: "VR-WI-KS", pattern: 1, content: 32, darkness: 19 },
  };

  // Get specific variation based on current profile
  const getItemVariation = (gridIndex: number) => {
    const profileKey = `${profile.geslacht}-${profile.haarkleur}-${profile.haartype}`;
    const baseVariation = previewVariations[profileKey as keyof typeof previewVariations];
    
    if (baseVariation) {
      // Adjust variation based on grid position
      const adjustedContent = ((baseVariation.content + gridIndex) % 32) + 1;
      const adjustedDarkness = Math.max(15, Math.min(50, baseVariation.darkness + (gridIndex * 3)));
      
      return {
        baseDarkness: adjustedDarkness,
        patternType: (baseVariation.pattern + gridIndex) % 3,
        contentVariation: adjustedContent,
        previewCode: `${baseVariation.preview}-${gridIndex + 1}`
      };
    }
    
    // Fallback for incomplete profiles
    return {
      baseDarkness: 20 + (gridIndex * 5),
      patternType: gridIndex % 3,
      contentVariation: gridIndex + 1,
      previewCode: `DEFAULT-${gridIndex + 1}`
    };
  };

  const renderPlaceholderItem = (title: string, gridIndex: number, isActive: boolean, isStatic = false) => {
    // For static items, use fixed colors that don't change with profile
    const staticColors = {
      baseDarkness: 25,
      bgColor: 'rgb(75%, 75%, 75%)',
      borderColor: 'rgb(65%, 65%, 65%)',
      textColor: 'rgb(25%, 25%, 25%)',
      wireColor: 'rgb(55%, 55%, 55%)'
    };
    
    const dynamicVariation = getItemVariation(gridIndex);
    const colors = isStatic ? staticColors : {
      baseDarkness: dynamicVariation.baseDarkness,
      bgColor: `rgb(${100 - dynamicVariation.baseDarkness}%, ${100 - dynamicVariation.baseDarkness}%, ${100 - dynamicVariation.baseDarkness}%)`,
      borderColor: `rgb(${90 - dynamicVariation.baseDarkness}%, ${90 - dynamicVariation.baseDarkness}%, ${90 - dynamicVariation.baseDarkness}%)`,
      textColor: `rgb(${50 - dynamicVariation.baseDarkness}%, ${50 - dynamicVariation.baseDarkness}%, ${50 - dynamicVariation.baseDarkness}%)`,
      wireColor: `rgb(${80 - dynamicVariation.baseDarkness}%, ${80 - dynamicVariation.baseDarkness}%, ${80 - dynamicVariation.baseDarkness}%)`
    };
    
    const previewCode = isStatic ? `STATIC-${gridIndex}` : dynamicVariation.previewCode;
    const selectionInfo = isStatic ? "COMING SOON" : `${profile.geslacht} • ${profile.haarkleur} • ${profile.haartype}`;
    
    return (
      <div 
        key={isStatic ? `static-${gridIndex}` : `${gridIndex}-${animationKey}`}
        className={cn(
          "relative overflow-hidden border transition-all duration-500 ease-out",
          heightBreakpoint === 'small' ? "aspect-[4/5]" :
          heightBreakpoint === 'medium' ? "aspect-[3/4]" :
          "aspect-[3/4]",
          isActive ? "cursor-pointer hover:scale-[1.01] group" : "cursor-not-allowed opacity-60",
          !isStatic
        )}
        style={{ 
          backgroundColor: colors.bgColor,
          borderColor: colors.borderColor,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '2px'
        }}
      >
        {/* Simple, consistent wireframe pattern */}
        <div className="absolute inset-0 opacity-25">
          <svg className="w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
            <defs>
              <pattern id={`simple-grid-${gridIndex}-${previewCode}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10,0 L 0,0 0,10" fill="none" stroke={colors.wireColor} strokeWidth="0.3" opacity="0.6"/>
              </pattern>
            </defs>
            <rect width="100" height="80" fill={`url(#simple-grid-${gridIndex}-${previewCode})`}/>
            
            {/* Simple centered elements */}
            <rect x="35" y="30" width="30" height="20" fill="none" stroke={colors.wireColor} strokeWidth="0.6" opacity="0.8"/>
            <circle cx="50" cy="40" r="4" fill="none" stroke={colors.wireColor} strokeWidth="0.8" opacity="0.9"/>
            <polygon points="48,38 48,42 52,40" fill={colors.wireColor} opacity="0.8"/>
          </svg>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
          <div className="text-center mb-2">
            <div className={cn(
              "font-header font-bold tracking-wide leading-tight",
              heightBreakpoint === 'small' ? "text-xs" :
              heightBreakpoint === 'medium' ? "text-sm" :
              "text-sm"
            )} style={{ color: colors.textColor }}>
              {title}
            </div>
          </div>
        </div>
        
        {/* Selection info label */}
        <div 
          className="absolute bottom-1.5 left-1.5 right-1.5 text-center text-[9px] font-mono px-1.5 py-0.5 border"
          style={{ 
            color: colors.textColor,
            backgroundColor: `rgb(${102 - colors.baseDarkness}%, ${102 - colors.baseDarkness}%, ${102 - colors.baseDarkness}%)`,
            borderColor: colors.borderColor,
            opacity: 0.8,
            borderRadius: '1px'
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
    <div 
      className={cn(
        "grid grid-cols-2 relative w-full px-2 sm:px-0",
        heightBreakpoint === 'small' ? "gap-1.5 max-w-xs" :
        heightBreakpoint === 'medium' ? "gap-2 max-w-sm sm:max-w-lg" :
        "gap-2 sm:gap-3 md:gap-4 max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl",
        className
      )}
    >
      {/* Haartransplantatie - Top Left */}
      <div onClick={handleHaartransplantatieClick}>
        {renderPlaceholderItem("HAAR\nTRANSPLANTATIE", 0, true)}
      </div>

      {/* V6 Hairboost - Top Right */}
      <div onClick={handleV6HairboostClick}>
        {renderPlaceholderItem("V6\nHAIRBOOST", 1, true)}
      </div>

      {/* Coming Soon - Bottom Left */}
      {renderPlaceholderItem("COMING SOON", 2, false, true)}

      {/* Coming Soon - Bottom Right */}
      {renderPlaceholderItem("COMING SOON", 3, false, true)}
    </div>
  );
};