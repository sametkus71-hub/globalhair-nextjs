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
    <div className="flex items-center justify-between max-w-[140px] mx-auto">
      <span className="font-body text-[11px] font-light text-white/80">{label}</span>
      <div className="flex items-center space-x-1.5">
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
    <div className={cn("space-y-2.5", className)}>
      {renderMeterRow(
        'Growth',
        levels.growth,
        <LeafIcon className="w-3 h-3" />
      )}
      {renderMeterRow(
        'Recovery',
        levels.recovery,
        <PlayButtonIcon className="w-3 h-3" />
      )}
    </div>
  );
};