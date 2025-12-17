'use client';

import { useSession } from '@/hooks/useSession';
import { useLanguage } from '@/hooks/useLanguage';

export const PackageLocationSelector = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useSession();

  // Elite is only available in Netherlands
  const isCountryDisabled = (countryKey: string) => {
    return countryKey === 'Turkije' && profile.selectedPackage === 'Elite';
  };

  const isPackageDisabled = (packageId: string) => {
    return packageId === 'Elite' && profile.locatie === 'Turkije';
  };

  const packages = [
    { 
      id: 'Standard', 
      label: 'Standard',
      isNew: false
    },
    { 
      id: 'Premium', 
      label: 'Premium',
      isNew: false
    },
    { 
      id: 'Elite', 
      label: 'Elite',
      isNew: true
    }
  ];

  return (
    <div className="flex flex-col items-center space-y-4 px-4 py-6">
      {/* Country Selection */}
      <div className="flex justify-center relative">
        <div 
          className="inline-flex p-0.5 rounded-full"
          style={{
            background: 'rgba(228, 229, 224, 0.1)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0px 0px 8.4px 1px rgba(255, 255, 255, 0.25) inset',
          }}
        >
          {(language === 'nl' ? ['Nederland', 'Turkije'] : ['Netherlands', 'Turkey']).map((country, index) => {
            const countryKey = index === 0 ? 'Nederland' : 'Turkije';
            const disabled = isCountryDisabled(countryKey);
            return (
              <button
                key={countryKey}
                disabled={disabled}
                onClick={() => {
                  if (!disabled) {
                    updateProfile('locatie', countryKey);
                  }
                }}
                className={`px-3 py-2 rounded-full font-lato text-[11px] font-medium transition-all duration-300 ease-out ${
                  disabled
                    ? 'opacity-40 cursor-not-allowed text-white/50'
                    : profile.locatie === countryKey
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                }`}
                style={!disabled && profile.locatie === countryKey ? {
                  background: 'rgba(255, 255, 255, 0.5)',
                  boxShadow: '10px 3px 15px 0px rgba(0, 0, 0, 0.4)'
                } : {}}
              >
                {country}
              </button>
            );
          })}
        </div>
      </div>

      {/* Package Selection */}
      <div className="flex justify-center">
        <div 
          className="inline-flex p-0.5 rounded-full relative"
          style={{
            background: 'rgba(228, 229, 224, 0.1)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0px 0px 8.4px 1px rgba(255, 255, 255, 0.25) inset',
          }}
        >
          {packages.map((pkg) => {
            const disabled = isPackageDisabled(pkg.id);
            return (
              <div key={pkg.id} className="relative">
                {pkg.isNew && (
                  <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 px-1.5 py-0.5 rounded-full font-lato text-[6px] font-medium text-white ${disabled ? 'opacity-40' : ''}`} style={{ background: '#692126', backdropFilter: 'blur(10px)' }}>
                    {language === 'nl' ? 'Nieuw' : 'New'}
                  </div>
                )}
                <button
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) {
                      // If selecting Elite, ensure we're in Netherlands
                      if (pkg.id === 'Elite' && profile.locatie === 'Turkije') {
                        updateProfile('locatie', 'Nederland');
                      }
                      updateProfile('selectedPackage', pkg.id);
                    }
                  }}
                  className={`px-3 py-2.5 rounded-full font-lato text-[13px] font-medium transition-all duration-300 ease-out ${
                    disabled
                      ? 'opacity-40 cursor-not-allowed text-white/50'
                      : profile.selectedPackage === pkg.id
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                  }`}
                  style={!disabled && profile.selectedPackage === pkg.id ? {
                    background: 'rgba(255, 255, 255, 0.5)',
                    boxShadow: '10px 3px 15px 0px rgba(0, 0, 0, 0.4)'
                  } : {}}
                >
                  {pkg.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};