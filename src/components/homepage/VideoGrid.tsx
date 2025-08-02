import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface VideoGridProps {
  className?: string;
}

export const VideoGrid = ({ className }: VideoGridProps) => {
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
    "Man-Rood-Fijn": { preview: "MA-RO-FI", pattern: 0, content: 13, darkness: 20 },
    "Man-Rood-Stijl": { preview: "MA-RO-ST", pattern: 1, content: 14, darkness: 23 },
    "Man-Rood-Krul": { preview: "MA-RO-KR", pattern: 2, content: 15, darkness: 26 },
    "Man-Rood-Kroes": { preview: "MA-RO-KS", pattern: 0, content: 16, darkness: 29 },
    
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
    "Vrouw-Rood-Fijn": { preview: "VR-RO-FI", pattern: 1, content: 29, darkness: 43 },
    "Vrouw-Rood-Stijl": { preview: "VR-RO-ST", pattern: 2, content: 30, darkness: 46 },
    "Vrouw-Rood-Krul": { preview: "VR-RO-KR", pattern: 0, content: 31, darkness: 22 },
    "Vrouw-Rood-Kroes": { preview: "VR-RO-KS", pattern: 1, content: 32, darkness: 19 },
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

  const renderPlaceholderItem = (title: string, gridIndex: number, isActive: boolean) => {
    const { baseDarkness, previewCode } = getItemVariation(gridIndex);
    const bgColor = `rgb(${100 - baseDarkness}%, ${100 - baseDarkness}%, ${100 - baseDarkness}%)`;
    const borderColor = `rgb(${90 - baseDarkness}%, ${90 - baseDarkness}%, ${90 - baseDarkness}%)`;
    const textColor = `rgb(${50 - baseDarkness}%, ${50 - baseDarkness}%, ${50 - baseDarkness}%)`;
    const wireColor = `rgb(${80 - baseDarkness}%, ${80 - baseDarkness}%, ${80 - baseDarkness}%)`;
    
    const selectionInfo = `${profile.geslacht} • ${profile.haarkleur} • ${profile.haartype}`;
    return (
      <div 
        key={`${gridIndex}-${animationKey}`}
        className={cn(
          "aspect-[3/4] relative overflow-hidden border transition-all duration-500 ease-out",
          isActive ? "cursor-pointer hover:scale-[1.01] group" : "cursor-not-allowed opacity-60",
          "animate-fade-in"
        )}
        style={{ 
          backgroundColor: bgColor,
          borderColor: borderColor,
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
                <path d="M 10,0 L 0,0 0,10" fill="none" stroke={wireColor} strokeWidth="0.3" opacity="0.6"/>
              </pattern>
            </defs>
            <rect width="100" height="80" fill={`url(#simple-grid-${gridIndex}-${previewCode})`}/>
            
            {/* Simple centered elements */}
            <rect x="35" y="30" width="30" height="20" fill="none" stroke={wireColor} strokeWidth="0.6" opacity="0.8"/>
            <circle cx="50" cy="40" r="4" fill="none" stroke={wireColor} strokeWidth="0.8" opacity="0.9"/>
            <polygon points="48,38 48,42 52,40" fill={wireColor} opacity="0.8"/>
          </svg>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
          <div className="text-center mb-2">
            <div className="text-sm font-header font-bold tracking-wide leading-tight" style={{ color: textColor }}>
              {title}
            </div>
          </div>
        </div>
        
        {/* Selection info label */}
        <div 
          className="absolute bottom-1.5 left-1.5 right-1.5 text-center text-[9px] font-mono px-1.5 py-0.5 border"
          style={{ 
            color: textColor,
            backgroundColor: `rgb(${102 - baseDarkness}%, ${102 - baseDarkness}%, ${102 - baseDarkness}%)`,
            borderColor: borderColor,
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
      key={`grid-${animationKey}`} // Force re-render entire grid
      className={cn("grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 relative w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl px-2 sm:px-0", className)}
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
      {renderPlaceholderItem("COMING SOON", 2, false)}

      {/* Coming Soon - Bottom Right */}
      {renderPlaceholderItem("COMING SOON", 3, false)}
    </div>
  );
};