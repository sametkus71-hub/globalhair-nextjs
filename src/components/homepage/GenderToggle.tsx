import { useSession, Gender } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

export const GenderToggle = () => {
  const { profile, updateProfile } = useSession();

  const handleGenderChange = (gender: Gender) => {
    updateProfile('geslacht', gender);
  };

  return (
    <div 
      className="relative inline-flex backdrop-blur-2xl p-0.5 rounded-full"
      style={{
        background: 'linear-gradient(145deg, rgba(30,40,50,0.8), rgba(20,30,40,0.9))',
        border: '1px solid',
        borderImage: 'linear-gradient(145deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1), rgba(255,255,255,0.4)) 1',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      <button
        onClick={() => handleGenderChange('Vrouw')}
        className={cn(
          "relative px-4 py-1.5 rounded-full font-header text-xs font-medium transition-all duration-300 ease-out backdrop-blur-xl",
          profile.geslacht === 'Vrouw'
            ? "text-gray-900 shadow-md"
            : "text-white/80 hover:text-white"
        )}
        style={{
          background: profile.geslacht === 'Vrouw' 
            ? 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,240,240,0.9))'
            : 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          border: profile.geslacht === 'Vrouw' ? 'none' : '1px solid rgba(255,255,255,0.1)',
          boxShadow: profile.geslacht === 'Vrouw' 
            ? '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
            : 'inset 0 1px 0 rgba(255,255,255,0.05)'
        }}
      >
        VROUW
      </button>
      <button
        onClick={() => handleGenderChange('Man')}
        className={cn(
          "relative px-4 py-1.5 rounded-full font-header text-xs font-medium transition-all duration-300 ease-out backdrop-blur-xl",
          profile.geslacht === 'Man'
            ? "text-gray-900 shadow-md"
            : "text-white/80 hover:text-white"
        )}
        style={{
          background: profile.geslacht === 'Man' 
            ? 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,240,240,0.9))'
            : 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          border: profile.geslacht === 'Man' ? 'none' : '1px solid rgba(255,255,255,0.1)',
          boxShadow: profile.geslacht === 'Man' 
            ? '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
            : 'inset 0 1px 0 rgba(255,255,255,0.05)'
        }}
      >
        MAN
      </button>
    </div>
  );
};