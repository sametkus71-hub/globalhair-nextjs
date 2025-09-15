import { cn } from '@/lib/utils';
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

  const renderMeterRow = (label: string, level: number) => (
    <div className="flex items-center justify-between">
      <span className="font-inter text-[13px] font-light text-white/90">{label}</span>
      <div className="flex space-x-2">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={cn(
              "w-3 h-3 rounded-full",
              dot <= level ? "bg-white" : "bg-white/30"
            )}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {renderMeterRow(
        language === 'nl' ? 'Growth' : 'Growth', 
        levels.growth
      )}
      {renderMeterRow(
        language === 'nl' ? 'Recovery' : 'Recovery', 
        levels.recovery
      )}
    </div>
  );
};