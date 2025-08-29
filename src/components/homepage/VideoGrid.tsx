import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/hooks/useSession';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface VideoGridProps {
  className?: string;
  heightBreakpoint?: 'small' | 'medium' | 'large';
  startTransition?: (targetPath: string, delay?: number) => void;
}

export const VideoGrid = ({ className, heightBreakpoint = 'large', startTransition }: VideoGridProps) => {
  const { profile } = useSession();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [animationKey, setAnimationKey] = useState(0);
  const [navigatingItem, setNavigatingItem] = useState<number | null>(null);

  // Re-animate when profile details change
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [profile.geslacht, profile.haarkleur, profile.haartype]);

  // Navigation handlers
  const handleHaartransplantatieClick = useCallback(() => {
    setNavigatingItem(0);
    const targetPath = language === 'en' ? '/en/hair-transplant' : '/nl/haartransplantatie';
    if (startTransition) {
      startTransition(targetPath);
    } else {
      navigate(targetPath);
    }
  }, [navigate, startTransition, language]);

  const handleV6HairboostClick = useCallback(() => {
    setNavigatingItem(1);
    const targetPath = `/${language}/v6-hairboost`;
    if (startTransition) {
      startTransition(targetPath);
    } else {
      navigate(targetPath);
    }
  }, [navigate, startTransition, language]);

  // Preview variations
  const previewVariations = {
    'Vrouw-Blond-Fijn': { previewCode: 'VBF001', pattern: 'light', contentIndex: 0, baseDarkness: 0.15 },
    'Vrouw-Blond-Stijl': { previewCode: 'VBS002', pattern: 'medium', contentIndex: 1, baseDarkness: 0.2 },
    'Vrouw-Blond-Krul': { previewCode: 'VBK003', pattern: 'curly', contentIndex: 2, baseDarkness: 0.25 },
    'Vrouw-Blond-Kroes': { previewCode: 'VBR004', pattern: 'textured', contentIndex: 3, baseDarkness: 0.3 },
    'Vrouw-Bruin-Fijn': { previewCode: 'VBrF005', pattern: 'light', contentIndex: 4, baseDarkness: 0.35 },
    'Vrouw-Bruin-Stijl': { previewCode: 'VBrS006', pattern: 'medium', contentIndex: 5, baseDarkness: 0.4 },
    'Vrouw-Bruin-Krul': { previewCode: 'VBrK007', pattern: 'curly', contentIndex: 6, baseDarkness: 0.45 },
    'Vrouw-Bruin-Kroes': { previewCode: 'VBrR008', pattern: 'textured', contentIndex: 7, baseDarkness: 0.5 },
    'Vrouw-Zwart-Fijn': { previewCode: 'VZF009', pattern: 'light', contentIndex: 8, baseDarkness: 0.55 },
    'Vrouw-Zwart-Stijl': { previewCode: 'VZS010', pattern: 'medium', contentIndex: 9, baseDarkness: 0.6 },
    'Vrouw-Zwart-Krul': { previewCode: 'VZK011', pattern: 'curly', contentIndex: 10, baseDarkness: 0.65 },
    'Vrouw-Zwart-Kroes': { previewCode: 'VZR012', pattern: 'textured', contentIndex: 11, baseDarkness: 0.7 },
    'Vrouw-Grijs-Fijn': { previewCode: 'VGF013', pattern: 'light', contentIndex: 12, baseDarkness: 0.75 },
    'Vrouw-Grijs-Stijl': { previewCode: 'VGS014', pattern: 'medium', contentIndex: 13, baseDarkness: 0.8 },
    'Vrouw-Grijs-Krul': { previewCode: 'VGK015', pattern: 'curly', contentIndex: 14, baseDarkness: 0.85 },
    'Vrouw-Grijs-Kroes': { previewCode: 'VGR016', pattern: 'textured', contentIndex: 15, baseDarkness: 0.9 },
    'Man-Blond-Fijn': { previewCode: 'MBF017', pattern: 'light', contentIndex: 16, baseDarkness: 0.15 },
    'Man-Blond-Stijl': { previewCode: 'MBS018', pattern: 'medium', contentIndex: 17, baseDarkness: 0.2 },
    'Man-Blond-Krul': { previewCode: 'MBK019', pattern: 'curly', contentIndex: 18, baseDarkness: 0.25 },
    'Man-Blond-Kroes': { previewCode: 'MBR020', pattern: 'textured', contentIndex: 19, baseDarkness: 0.3 },
    'Man-Bruin-Fijn': { previewCode: 'MBrF021', pattern: 'light', contentIndex: 20, baseDarkness: 0.35 },
    'Man-Bruin-Stijl': { previewCode: 'MBrS022', pattern: 'medium', contentIndex: 21, baseDarkness: 0.4 },
    'Man-Bruin-Krul': { previewCode: 'MBrK023', pattern: 'curly', contentIndex: 22, baseDarkness: 0.45 },
    'Man-Bruin-Kroes': { previewCode: 'MBrR024', pattern: 'textured', contentIndex: 23, baseDarkness: 0.5 },
    'Man-Zwart-Fijn': { previewCode: 'MZF025', pattern: 'light', contentIndex: 24, baseDarkness: 0.55 },
    'Man-Zwart-Stijl': { previewCode: 'MZS026', pattern: 'medium', contentIndex: 25, baseDarkness: 0.6 },
    'Man-Zwart-Krul': { previewCode: 'MZK027', pattern: 'curly', contentIndex: 26, baseDarkness: 0.65 },
    'Man-Zwart-Kroes': { previewCode: 'MZR028', pattern: 'textured', contentIndex: 27, baseDarkness: 0.7 },
    'Man-Grijs-Fijn': { previewCode: 'MGF029', pattern: 'light', contentIndex: 28, baseDarkness: 0.75 },
    'Man-Grijs-Stijl': { previewCode: 'MGS030', pattern: 'medium', contentIndex: 29, baseDarkness: 0.8 },
    'Man-Grijs-Krul': { previewCode: 'MGK031', pattern: 'curly', contentIndex: 30, baseDarkness: 0.85 },
    'Man-Grijs-Kroes': { previewCode: 'MGR032', pattern: 'textured', contentIndex: 31, baseDarkness: 0.9 },
  };

  // Function to get variation based on profile and grid position
  const getItemVariation = (gridIndex: number) => {
    const profileKey = `${profile.geslacht}-${profile.haarkleur}-${profile.haartype}` as keyof typeof previewVariations;
    const baseVariation = previewVariations[profileKey];
    
    if (!baseVariation) {
      // Fallback for incomplete profiles
      return {
        baseDarkness: 0.5,
        patternType: 'medium',
        contentVariation: 1,
        previewCode: 'DEFAULT'
      };
    }

    // Apply grid-specific adjustments
    const adjustedDarkness = Math.max(0.1, Math.min(0.9, baseVariation.baseDarkness + (gridIndex * 0.05)));
    
    return {
      baseDarkness: adjustedDarkness,
      patternType: baseVariation.pattern,
      contentVariation: (baseVariation.contentIndex + gridIndex) % 8,
      previewCode: `${baseVariation.previewCode}-G${gridIndex}`
    };
  };

  // Render individual grid item
  const renderPlaceholderItem = (title: string, gridIndex: number, isActive: boolean, isStatic?: boolean, onClick?: () => void) => {
    const variation = isStatic ? null : getItemVariation(gridIndex);
    
    const previewCode = isStatic ? `STATIC-${gridIndex}` : variation!.previewCode;
    const selectionInfo = isStatic ? "COMING SOON" : `${profile.geslacht} • ${profile.haarkleur} • ${profile.haartype}`;
    
    return (
      <div 
        key={isStatic ? `static-${gridIndex}` : `${gridIndex}-${animationKey}`}
        data-grid-item={gridIndex}
        className={cn(
          "relative w-full h-full overflow-hidden transition-all duration-500 ease-out",
          isActive ? "cursor-pointer hover:scale-[1.01] group" : "cursor-not-allowed opacity-60",
          !isStatic && "animate-fade-in"
        )}
        style={{
          background: isStatic 
            ? 'linear-gradient(135deg, rgba(60,60,60,0.8), rgba(40,40,40,0.9))'
            : `linear-gradient(135deg, 
                hsla(${Math.round(variation!.baseDarkness * 360)}, 30%, ${20 + variation!.baseDarkness * 15}%, 0.9), 
                hsla(${Math.round(variation!.baseDarkness * 360)}, 25%, ${15 + variation!.baseDarkness * 10}%, 0.95)
              )`,
          // Bring to front during navigation
          ...(navigatingItem === gridIndex && { position: 'relative', zIndex: 50 })
        }}
        onClick={isActive ? onClick : undefined}
      >
        {/* Simple, consistent wireframe pattern */}
        <div className="absolute inset-0 opacity-25">
          <svg className="w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
            <defs>
              <pattern id={`grid-${gridIndex}`} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${gridIndex})`} />
          </svg>
        </div>

        {/* Content overlay with improved spacing and sizing */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-white">
          {/* Title */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-3 leading-tight tracking-wide">
            {title}
          </h3>
          
          {/* Selection info */}
          <div className="text-xs sm:text-sm opacity-75 text-center mb-4 font-medium">
            {selectionInfo}
          </div>
          
          {/* Preview code - smaller and more subtle */}
          <div className="text-[10px] sm:text-xs opacity-50 font-mono tracking-wider">
            {previewCode}
          </div>
        </div>

        {/* Hover effect overlay */}
        {isActive && (
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "grid grid-cols-2 fixed inset-0 w-screen isolate",
        className
      )}
      style={{ 
        height: 'var(--app-height)',
        zIndex: 1 
      }}
    >
      {/* Haartransplantatie - Top Left */}
      {renderPlaceholderItem("HAAR TRANSPLANTATIE", 0, true, false, handleHaartransplantatieClick)}
      
      {/* V6 Hairboost - Top Right */}
      {renderPlaceholderItem("V6 HAIRBOOST", 1, true, false, handleV6HairboostClick)}
      
      {/* Coming Soon items - Bottom */}
      {renderPlaceholderItem("COMING SOON", 2, false, true)}
      {renderPlaceholderItem("COMING SOON", 3, false, true)}
    </div>
  );
};