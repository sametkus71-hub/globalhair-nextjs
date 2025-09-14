import { useSession, Gender } from '@/hooks/useSession';
import { cn } from '@/lib/utils';

export const GenderToggle = () => {
  const { profile, updateProfile } = useSession();

  const handleGenderChange = (gender: Gender) => {
    updateProfile('geslacht', gender);
  };

  const genders = [
    { value: 'Man' as Gender, label: 'Man' },
    { value: 'Vrouw' as Gender, label: 'Vrouw' },
  ];

  const activeIndex = genders.findIndex(g => g.value === profile.geslacht);

  return (
    <div 
      className="relative inline-flex p-1 rounded-full"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      {/* Sliding background */}
      {activeIndex >= 0 && (
        <div
          className="absolute rounded-full transition-transform duration-300 ease-out"
          style={{
            width: 'calc(50% - 4px)',
            height: 'calc(100% - 8px)',
            top: '4px',
            left: '4px',
            backdropFilter: 'blur(40px)',
            background: 'rgba(255, 255, 255, 0.3)',
            transform: `translateX(${activeIndex * 50}%)`,
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        />
      )}
      
      {genders.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleGenderChange(value)}
          className={cn(
            "relative z-10 px-4 py-1.5 rounded-full font-header text-[12px] font-medium transition-colors duration-200 flex items-center justify-center",
            profile.geslacht === value
              ? "text-white"
              : "text-white/80 hover:text-white"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};