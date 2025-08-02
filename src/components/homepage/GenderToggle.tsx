import { useSession, Gender } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

export const GenderToggle = () => {
  const { profile, updateProfile } = useSession();

  const handleGenderChange = (gender: Gender) => {
    updateProfile('geslacht', gender);
  };

  return (
    <div className="relative inline-flex bg-white/8 backdrop-blur-md rounded-lg p-0.5 border border-white/15">
      <button
        onClick={() => handleGenderChange('Vrouw')}
        className={cn(
          "relative px-4 py-2 rounded-md font-header text-xs font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Vrouw'
            ? "bg-white text-gray-900 shadow-md"
            : "text-white/70 hover:text-white"
        )}
      >
        VROUW
      </button>
      <button
        onClick={() => handleGenderChange('Man')}
        className={cn(
          "relative px-4 py-2 rounded-md font-header text-xs font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Man'
            ? "bg-white text-gray-900 shadow-md"
            : "text-white/70 hover:text-white"
        )}
      >
        MAN
      </button>
    </div>
  );
};