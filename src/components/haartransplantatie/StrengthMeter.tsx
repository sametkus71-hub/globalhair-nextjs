import { cn } from '@/lib/utils';
import { AnimatedGrowthIcon } from '@/components/icons/AnimatedGrowthIcon';
import { AnimatedRecoveryIcon } from '@/components/icons/AnimatedRecoveryIcon';
import { useLanguage } from '@/hooks/useLanguage';

interface StrengthMeterProps {
  package: 'Standard' | 'Premium' | 'Elite';
  className?: string;
}

export const StrengthMeter = ({ package: packageName, className }: StrengthMeterProps) => {
  const { language } = useLanguage();

  // Define strength levels for each package
  const strengthLevels = {
    Standard: { growth: 1, recovery: 1 },
    Premium: { growth: 2, recovery: 2 },
    Elite: { growth: 3, recovery: 3 }
  };

  const levels = strengthLevels[packageName];

  const renderMeterRow = (label: string, level: number, icon: React.ReactNode) => (
    <div className="flex items-center justify-between max-w-[180px] mx-auto">
      <span className="font-body text-[11px] font-light text-white/80">{label}</span>
      <div className="w-16 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-2.5", className)}>
      {renderMeterRow(
        'Growth',
        levels.growth,
        <AnimatedGrowthIcon level={levels.growth as 1 | 2 | 3} />
      )}
      {renderMeterRow(
        'Recovery',
        levels.recovery,
        <AnimatedRecoveryIcon level={levels.recovery as 1 | 2 | 3} />
      )}
    </div>
  );
};