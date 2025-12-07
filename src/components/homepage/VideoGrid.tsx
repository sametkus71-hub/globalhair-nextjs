import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/hooks/useSession';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { VideoGridItem } from './VideoGridItem';
import { cn } from '@/lib/utils';

interface VideoGridProps {
  className?: string;
  heightBreakpoint?: 'small' | 'medium' | 'large';
  startTransition?: (targetPath: string, delay?: number) => void;
}

export const VideoGrid = ({ className, heightBreakpoint = 'large', startTransition }: VideoGridProps) => {
  const { profile, setActiveRoute } = useSession();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [animationKey, setAnimationKey] = useState(0);
  const [navigatingItem, setNavigatingItem] = useState<number | null>(null);

  // Note: Removed animationKey increment to prevent component remounting
  // Video transitions are now handled internally by VideoGridItem

  // Navigation handlers
  const handleHaartransplantatieClick = useCallback(() => {
    setNavigatingItem(0);
    setActiveRoute('haartransplantatie');
    const targetPath = language === 'en' ? '/en/hair-transplant' : '/nl/haartransplantatie';
    if (startTransition) {
      startTransition(targetPath);
    } else {
      navigate(targetPath);
    }
  }, [navigate, startTransition, language, setActiveRoute]);

  const handleV6HairboostClick = useCallback(() => {
    setNavigatingItem(1);
    setActiveRoute('v6-hairboost');
    const targetPath = `/${language}/v6-hairboost`;
    if (startTransition) {
      startTransition(targetPath);
    } else {
      navigate(targetPath);
    }
  }, [navigate, startTransition, language, setActiveRoute]);

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
    // Added missing Rood (Red) combinations for Vrouw
    'Vrouw-Rood-Fijn': { previewCode: 'VRF033', pattern: 'light', contentIndex: 32, baseDarkness: 0.2 },
    'Vrouw-Rood-Stijl': { previewCode: 'VRS034', pattern: 'medium', contentIndex: 33, baseDarkness: 0.25 },
    'Vrouw-Rood-Krul': { previewCode: 'VRK035', pattern: 'curly', contentIndex: 34, baseDarkness: 0.3 },
    'Vrouw-Rood-Kroes': { previewCode: 'VRR036', pattern: 'textured', contentIndex: 35, baseDarkness: 0.35 },
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
    // Added missing Rood (Red) combinations for Man - these have actual videos
    'Man-Rood-Fijn': { previewCode: 'MRF037', pattern: 'light', contentIndex: 36, baseDarkness: 0.2 },
    'Man-Rood-Stijl': { previewCode: 'MRS038', pattern: 'medium', contentIndex: 37, baseDarkness: 0.25 },
    'Man-Rood-Krul': { previewCode: 'MRK039', pattern: 'curly', contentIndex: 38, baseDarkness: 0.3 },
    'Man-Rood-Kroes': { previewCode: 'MRR040', pattern: 'textured', contentIndex: 39, baseDarkness: 0.35 },
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
  const renderGridItem = (title: string, gridIndex: number, isActive: boolean, isStatic?: boolean, onClick?: () => void) => {
    const variation = isStatic ? null : getItemVariation(gridIndex);
    
    // Use VideoGridItem for active items, fallback for static items
    if (!isStatic && variation) {
      return (
        <VideoGridItem
          key={gridIndex}
          title={title}
          gridIndex={gridIndex}
          isActive={isActive}
          onClick={onClick}
          variation={variation}
          profile={profile}
          navigatingItem={navigatingItem}
        />
      );
    }
    
    // Static "Coming Soon" items
    return (
      <div 
        key={`static-${gridIndex}`}
        data-grid-item={gridIndex}
        className={cn(
          "relative w-full h-full overflow-hidden transition-all duration-500 ease-out",
          "cursor-not-allowed"
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(60,60,60,0.8), rgba(40,40,40,0.9))'
        }}
      >
        {/* Hard overlay for coming soon items */}
        <>
          {/* Base overlay using darker brand color with vertical gradient */}
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: `linear-gradient(135deg, #002a3f 0%, #001a26 100%)`,
            }}
          />
          
          {/* Additional vertical darkening overlay - darker towards bottom */}
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: `linear-gradient(to bottom, 
                rgba(0, 0, 0, 0.1) 0%, 
                rgba(0, 0, 0, 0.3) 70%, 
                rgba(0, 0, 0, 0.5) 100%
              )`
            }}
          />
          
          {/* Very subtle shine-through effect */}
          <div 
            className="absolute inset-0 z-10 animate-gradient-shift"
            style={{
              background: `linear-gradient(135deg, 
                rgba(1, 51, 76, 0.8) 0%, 
                rgba(1, 51, 76, 0.6) 50%, 
                rgba(1, 51, 76, 0.8) 100%
              )`
            }}
          />
        </>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-white z-20">
          <h3 className="text-2xl sm:text-3xl md:text-4xl text-white/40 font-light tracking-[0.2em] uppercase font-bold text-center leading-tight">
            {title}
          </h3>
        </div>
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
      {renderGridItem("HAAR TRANSPLANTATIE", 0, true, false, handleHaartransplantatieClick)}
      
      {/* V6 Hairboost® - Top Right - Coming Soon */}
      {renderGridItem("V6 HAIRBOOST®", 1, false, true)}
      
      {/* Coming Soon items - Bottom */}
      {renderGridItem("COMING SOON", 2, false, true)}
      {renderGridItem("COMING SOON", 3, false, true)}
    </div>
  );
};