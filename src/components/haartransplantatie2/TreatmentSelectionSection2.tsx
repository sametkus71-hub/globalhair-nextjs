import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { calculatePrice, formatPrice } from '@/lib/pricing';
import { Info, BookOpen } from 'lucide-react';

export const TreatmentSelectionSection2 = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useSession();
  const [priceFlash, setPriceFlash] = useState(false);
  const [buttonsLoaded, setButtonsLoaded] = useState([false, false, false]);
  
  const totalPrice = calculatePrice(profile);

  // Flash effect for price changes
  useEffect(() => {
    setPriceFlash(true);
    const timer = setTimeout(() => setPriceFlash(false), 200);
    return () => clearTimeout(timer);
  }, [totalPrice]);

  // Staggered button loading animation
  useEffect(() => {
    const timers = [
      setTimeout(() => setButtonsLoaded(prev => [true, prev[1], prev[2]]), 1500),
      setTimeout(() => setButtonsLoaded(prev => [prev[0], true, prev[2]]), 1800),
      setTimeout(() => setButtonsLoaded(prev => [prev[0], prev[1], true]), 2100),
    ];
    
    return () => timers.forEach(clearTimeout);
  }, []);

  const packages = [
    { 
      id: 'Standard', 
      label: language === 'nl' ? 'Standard' : 'Standard',
      isNew: false
    },
    { 
      id: 'Plus', 
      label: language === 'nl' ? 'Plus' : 'Plus',
      isNew: false
    },
    { 
      id: 'Premium', 
      label: language === 'nl' ? 'Premium' : 'Premium',
      isNew: false
    },
    { 
      id: 'Advanced', 
      label: language === 'nl' ? 'Advanced' : 'Advanced',
      isNew: true
    }
  ];

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Main Content - now naturally positioned after the grid */}
      <div className="flex-1 flex flex-col justify-start px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-10 sm:pt-14 md:pt-18 lg:pt-22 xl:pt-24 pb-10 sm:pb-14 md:pb-18 lg:pb-22 xl:pb-24">
        {/* Header */}
        <div className="text-center pt-6 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-16 mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20">
          <h1 className="font-lato text-[31px] sm:text-[34px] md:text-[37px] lg:text-[40px] xl:text-[42px] font-normal text-black mb-2 sm:mb-3 md:mb-4 lg:mb-5" style={{ lineHeight: '0.97' }}>
            Time to start over
          </h1>
          <p className="text-[13px] sm:text-[14px] md:text-[15px] text-gray-600 font-medium leading-relaxed mb-12 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24">
            Kies uw locatie en pakket om te beginnen aan uw transformatie
          </p>
        </div>

        {/* Country Selection */}
        <div className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24">
          <div className="flex justify-center gap-4 sm:gap-6 md:gap-8">
            <button
              onClick={() => updateProfile('locatie', 'Nederland')}
              className={`px-6 sm:px-8 md:px-10 lg:px-12 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base font-medium rounded-full transition-all duration-300 ${
                profile.locatie === 'Nederland' 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Nederland
            </button>
            <button
              onClick={() => updateProfile('locatie', 'Turkije')}
              className={`px-6 sm:px-8 md:px-10 lg:px-12 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base font-medium rounded-full transition-all duration-300 ${
                profile.locatie === 'Turkije' 
                  ? 'bg-black text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Turkije
            </button>
          </div>
        </div>

        {/* Package Selection */}
        <div className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 max-w-sm sm:max-w-md mx-auto">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
              onClick={() => updateProfile('selectedPackage', pkg.id)}
              className={`relative px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-300 ${
                profile.selectedPackage === pkg.id
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {pkg.label}
                {pkg.isNew && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    Nieuw
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price Display */}
        <div className="text-center">
          <div 
            className={`inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-200 ${
              priceFlash ? 'bg-yellow-100 scale-105' : 'bg-gray-50'
            }`}
          >
            <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">
              Geschatte kosten
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
              {formatPrice(totalPrice)}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Informational Icons */}
      <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 flex flex-col space-y-3 z-40">
        {/* Info Button */}
        <button 
          className={`w-12 h-12 sm:w-14 sm:h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 ${
            buttonsLoaded[0] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <Info className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
        
        {/* Guide Button */}
        <button 
          className={`w-12 h-12 sm:w-14 sm:h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 ${
            buttonsLoaded[1] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
        
        {/* Support Button */}
        <button 
          className={`w-12 h-12 sm:w-14 sm:h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 ${
            buttonsLoaded[2] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <img 
            src="/lovable-uploads/b5004700-4ebf-4a8d-9f10-fcddc2176942.png" 
            alt="Support" 
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </button>
      </div>
    </div>
  );
};