import { useSession } from '@/hooks/useSession';
import { useLanguage } from '@/hooks/useLanguage';
import { PenIcon } from '@/components/icons/PenIcon';
import { LightningIcon } from '@/components/icons/LightningIcon';
import { StrengthMeter } from './StrengthMeter';
import { Separator } from '@/components/ui/separator';

export const NewPackageContent = () => {
  const { language } = useLanguage();
  const { profile } = useSession();

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
          { name: 'V6 Hairboost', icon: <LightningIcon /> }
        ]
      },
      en: {
        items: [
          { name: 'FUE Sapphire / DHI', icon: <PenIcon /> },
          { name: 'V6 Hairboost', icon: <LightningIcon /> }
        ]
      }
    },
    Advanced: {
      nl: {
        items: [
          { name: 'FUE Saffier / DHI', icon: <PenIcon /> },
          { name: 'V6 Hairboost', icon: <LightningIcon /> },
          { name: 'GHI Stamcell Repair™', icon: <div className="w-6 h-6 bg-white rounded-full"></div> }
        ]
      },
      en: {
        items: [
          { name: 'FUE Sapphire / DHI', icon: <PenIcon /> },
          { name: 'V6 Hairboost', icon: <LightningIcon /> },
          { name: 'GHI Stemcell Repair™', icon: <div className="w-6 h-6 bg-white rounded-full"></div> }
        ]
      }
    }
  };

  const currentPackage = packageContent[profile.selectedPackage as keyof typeof packageContent];
  const content = currentPackage[language as keyof typeof currentPackage];

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Package Items - Centered */}
      <div className="space-y-3">
        {content.items.map((item, index) => (
          <div key={index} className="flex items-center justify-center space-x-3">
            {item.icon}
            <span className="font-inter text-[13px] text-white font-light">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* More Information Button */}
      <div className="flex justify-center">
        <button className="px-8 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
          <span className="font-inter text-[13px] text-white font-light">
            {language === 'nl' ? 'More information' : 'More information'}
          </span>
        </button>
      </div>

      {/* Separator */}
      <div className="w-full px-4">
        <Separator className="bg-white/30" />
      </div>

      {/* Strength Meter */}
      <div className="w-full max-w-[180px]">
        <StrengthMeter package={profile.selectedPackage} />
      </div>
    </div>
  );
};