import { cn } from '@/lib/utils';
import { LeafIcon } from '@/components/icons/LeafIcon';
import { PlayButtonIcon } from '@/components/icons/PlayButtonIcon';
import { useLanguage } from '@/hooks/useLanguage';

interface StrengthMeterProps {
  package: 'Standard' | 'Premium' | 'Advanced';
  className?: string;
}

export const StrengthMeter = ({ package: packageName, className }: StrengthMeterProps) => {
  const { language } = useLanguage();

  // Define strength levels for each package
  const strengthLevels = {
    Standard: { growth: 1, recovery: 1 },
    Premium: { growth: 2, recovery: 2 },
    Advanced: { growth: 3, recovery: 3 }
  };

  const levels = strengthLevels[packageName];

  const renderMeterRow = (icon: React.ReactNode, label: string, level: number) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="font-lato text-[12px] text-white/90">{label}</span>
      </div>
      <div className="flex space-x-1">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={cn(
              "w-2 h-2 rounded-full",
              dot <= level ? "bg-white" : "bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-3", className)}>
      {renderMeterRow(
        <LeafIcon className="w-4 h-4" />, 
        language === 'nl' ? 'Groei' : 'Growth', 
        levels.growth
      )}
      {renderMeterRow(
        <PlayButtonIcon className="w-4 h-4" />, 
        language === 'nl' ? 'Herstel' : 'Recovery', 
        levels.recovery
      )}
    </div>
  );
};