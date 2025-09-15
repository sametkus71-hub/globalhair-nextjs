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

  const renderMeterRow = (label: string, level: number, icon: React.ReactNode) => (
    <div className="flex items-center justify-between">
      <span className="font-body text-[11px] font-light text-white/80">{label}</span>
      <div className="flex items-center space-x-2">
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
        {icon}
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-3", className)}>
      {renderMeterRow(
        language === 'nl' ? 'Groei' : 'Growth',
        levels.growth,
        <LeafIcon className="w-3 h-3" />
      )}
      {renderMeterRow(
        language === 'nl' ? 'Herstel' : 'Recovery',
        levels.recovery,
        <PlayButtonIcon className="w-3 h-3" />
      )}
    </div>
  );
};