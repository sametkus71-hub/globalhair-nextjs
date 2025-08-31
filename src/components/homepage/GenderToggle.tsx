import { useSession, Gender } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

export const GenderToggle = () => {
  const { profile, updateProfile } = useSession();

  const handleGenderChange = (gender: Gender) => {
    updateProfile('geslacht', gender);
  };

  return (
    <div 
      className="relative inline-flex p-1 rounded-full"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <button
        onClick={() => handleGenderChange('Man')}
        className={cn(
          "relative px-4 py-1.5 rounded-full font-header text-[12px] font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Man'
            ? "text-gray-900"
            : "text-white/80 hover:text-white"
        )}
        style={profile.geslacht === 'Man' ? {
          boxShadow: '0 4px 15px 0 rgba(255, 255, 255, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(40px)',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.4)'
        } : {}}
      >
        Man
      </button>
      <button
        onClick={() => handleGenderChange('Vrouw')}
        className={cn(
          "relative px-4 py-1.5 rounded-full font-header text-[12px] font-medium transition-all duration-300 ease-out",
          profile.geslacht === 'Vrouw'
            ? "text-gray-900"
            : "text-white/80 hover:text-white"
        )}
        style={profile.geslacht === 'Vrouw' ? {
          boxShadow: '0 4px 15px 0 rgba(255, 255, 255, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(40px)',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.4)'
        } : {}}
      >
        Vrouw
      </button>
    </div>
  );
};