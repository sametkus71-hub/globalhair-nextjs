import { useSession, Gender } from '@/hooks/useSession';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

export const GenderToggle = () => {
  const { profile, updateProfile } = useSession();

  const handleGenderChange = (gender: Gender) => {
    updateProfile('geslacht', gender);
  };

  return (
    <div className="flex items-center justify-center space-x-1 bg-background/50 backdrop-blur-sm rounded-full p-1 border border-border/50">
      <Toggle
        pressed={profile.geslacht === 'Vrouw'}
        onPressedChange={() => handleGenderChange('Vrouw')}
        className={cn(
          "h-12 px-6 font-header text-sm font-medium transition-all duration-300",
          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
          "data-[state=off]:bg-transparent data-[state=off]:text-muted-foreground",
          "hover:bg-muted"
        )}
      >
        WOMAN
      </Toggle>
      <Toggle
        pressed={profile.geslacht === 'Man'}
        onPressedChange={() => handleGenderChange('Man')}
        className={cn(
          "h-12 px-6 font-header text-sm font-medium transition-all duration-300",
          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
          "data-[state=off]:bg-transparent data-[state=off]:text-muted-foreground",
          "hover:bg-muted"
        )}
      >
        MAN
      </Toggle>
    </div>
  );
};