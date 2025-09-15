import { useSession } from '@/hooks/useSession';
import { useLanguage } from '@/hooks/useLanguage';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { calculatePrice, formatPrice } from '@/lib/pricing';
import { PenIcon } from '@/components/icons/PenIcon';
import { LightningIcon } from '@/components/icons/LightningIcon';
import { StemcellIcon } from '@/components/icons/StemcellIcon';
import { StrengthMeter } from './StrengthMeter';
import { Separator } from '@/components/ui/separator';
import { ShinyButton } from '@/components/ui/shiny-button';

export const NewPackageContent = () => {
  const { language } = useLanguage();
  const { profile } = useSession();
  const { heightBreakpoint } = useViewportHeight();
  const totalPrice = calculatePrice(profile);

  // Dynamic spacing based on viewport height
  const getContainerSpacing = () => {
    if (heightBreakpoint === 'small') {
      return 'space-y-2'; // Tighter spacing for small screens
    } else if (heightBreakpoint === 'medium') {
      return 'space-y-4'; // Moderate spacing for medium screens
    } else {
      return 'space-y-6'; // More generous spacing for large screens
    }
  };

  // Define simplified package content
  const packageContent = {
    Standard: {
      nl: {
        items: [
          { name: 'FUE Saffier', icon: <PenIcon /> }
        ]
      },
      en: {
        items: [
          { name: 'FUE Sapphire', icon: <PenIcon /> }
        ]
      }
    },
    Premium: {
      nl: {
        items: [
          { name: 'FUE Saffier / DHI', icon: <PenIcon /> },
          { name: 'V6 Hairboost®', icon: <LightningIcon /> }
        ]
      },
      en: {
        items: [
          { name: 'FUE Sapphire / DHI', icon: <PenIcon /> },
          { name: 'V6 Hairboost®', icon: <LightningIcon /> }
        ]
      }
    },
    Advanced: {
      nl: {
        items: [
          { name: 'FUE Saffier / DHI', icon: <PenIcon /> },
          { name: 'V6 Hairboost®', icon: <LightningIcon /> },
          { name: 'GHI Stamcell Repair™', icon: <StemcellIcon /> }
        ]
      },
      en: {
        items: [
          { name: 'FUE Sapphire / DHI', icon: <PenIcon /> },
          { name: 'V6 Hairboost®', icon: <LightningIcon /> },
          { name: 'GHI Stemcell Repair™', icon: <StemcellIcon /> }
        ]
      }
    }
  };

  const currentPackage = packageContent[profile.selectedPackage as keyof typeof packageContent];
  const content = currentPackage[language as keyof typeof currentPackage];

  return (
    <div className={getContainerSpacing()}>
      {/* Package Items */}
      <div className="flex flex-col items-center">
        <div className="space-y-1 w-48 ml-16">
          {content.items.map((item, index) => (
            <div key={index} className="flex items-center justify-start space-x-2 w-full">
              <div className="w-5 flex justify-center">
                {item.icon}
              </div>
              <span className="font-body text-[10px] font-light text-white/90 text-left">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* More Details Button */}
      <div className="flex justify-center">
        <ShinyButton 
          onClick={() => console.log('More information clicked')}
        >
          {language === 'nl' ? 'Meer informatie' : 'More information'}
        </ShinyButton>
      </div>

      {/* Separator */}
      <div className="px-6">
        <Separator className="bg-white/20" />
      </div>

      {/* Strength Meter */}
      <div className="px-2">
        <StrengthMeter package={profile.selectedPackage} />
      </div>
    </div>
  );
};