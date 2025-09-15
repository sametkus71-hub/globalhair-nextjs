import { useSession } from '@/hooks/useSession';
import { useLanguage } from '@/hooks/useLanguage';
import { calculatePrice, formatPrice } from '@/lib/pricing';
import { PenIcon } from '@/components/icons/PenIcon';
import { LightningIcon } from '@/components/icons/LightningIcon';
import { StrengthMeter } from './StrengthMeter';
import { Separator } from '@/components/ui/separator';

export const NewPackageContent = () => {
  const { language } = useLanguage();
  const { profile } = useSession();
  const totalPrice = calculatePrice(profile);

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
          { name: 'GHI Stamcell Repair™', icon: <div className="w-6 h-6 bg-white rounded-full"></div> }
        ]
      },
      en: {
        items: [
          { name: 'FUE Sapphire / DHI', icon: <PenIcon /> },
          { name: 'V6 Hairboost®', icon: <LightningIcon /> },
          { name: 'GHI Stemcell Repair™', icon: <div className="w-6 h-6 bg-white rounded-full"></div> }
        ]
      }
    }
  };

  const currentPackage = packageContent[profile.selectedPackage as keyof typeof packageContent];
  const content = currentPackage[language as keyof typeof currentPackage];

  return (
    <div className="space-y-6">
      {/* Package Items */}
      <div className="flex flex-col items-center">
        <div className="space-y-1.5 w-48 ml-4">
          {content.items.map((item, index) => (
            <div key={index} className="flex items-center justify-start space-x-3 w-full">
              {item.icon}
              <span className="font-body text-[12px] font-light text-white/90 text-left">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* More Details Button */}
      <div className="flex justify-center mt-4">
        <button className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
          <span className="font-body text-[10px] font-light text-white/90">
            {language === 'nl' ? 'Meer informatie' : 'More information'}
          </span>
        </button>
      </div>

      {/* Separator */}
      <div className="px-6 mt-3">
        <Separator className="bg-white/20" />
      </div>

      {/* Strength Meter */}
      <div className="px-2 mt-3">
        <StrengthMeter package={profile.selectedPackage} />
      </div>
    </div>
  );
};