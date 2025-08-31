import { useSession, Gender } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

export const GenderToggle = () => {
  const { profile, updateProfile } = useSession();

  const handleGenderChange = (gender: Gender) => {
    updateProfile('geslacht', gender);
  };

  return (
    <div 
      className="relative inline-flex p-0.5 rounded-full"
      style={{
        boxShadow: '-2px 6px 6.3px 0px rgba(0, 0, 0, 0.25) inset',
      }}
    >
      <button
        onClick={() => handleGenderChange('Vrouw')}
        className={cn(
          "relative px-3 py-1 rounded-full font-header text-[10px] font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Vrouw'
            ? "text-gray-900"
            : "text-white/80 hover:text-white"
        )}
        style={profile.geslacht === 'Vrouw' ? {
          boxShadow: '5px 0px 12px 0px rgba(151, 151, 151, 1)',
          backdropFilter: 'blur(52.3px)',
          background: 'rgba(255, 255, 255, 0.9)'
        } : {}}
      >
        VROUW
      </button>
      <button
        onClick={() => handleGenderChange('Man')}
        className={cn(
          "relative px-3 py-1 rounded-full font-header text-[10px] font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Man'
            ? "text-gray-900"
            : "text-white/80 hover:text-white"
        )}
        style={profile.geslacht === 'Man' ? {
          boxShadow: '5px 0px 12px 0px rgba(151, 151, 151, 1)',
          backdropFilter: 'blur(52.3px)',
          background: 'rgba(255, 255, 255, 0.9)'
        } : {}}
      >
        MAN
      </button>
    </div>
  );
};