import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { Info, Phone, BookOpen } from 'lucide-react';
import { calculatePrice, formatPrice } from '@/lib/pricing';

export const TreatmentSelectionSection = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useSession();
  const [priceFlash, setPriceFlash] = useState(false);
  
  const totalPrice = calculatePrice(profile);

  // Flash effect when price changes
  useEffect(() => {
    setPriceFlash(true);
    const timer = setTimeout(() => setPriceFlash(false), 300);
    return () => clearTimeout(timer);
  }, [totalPrice]);

  const packages = [
    { 
      id: 'Standard', 
      label: 'Standard',
      isNew: false
    },
    { 
      id: 'Plus', 
      label: 'Plus',
      isNew: false
    },
    { 
      id: 'Premium', 
      label: 'Premium',
      isNew: true
    },
    { 
      id: 'Advanced', 
      label: 'Advanced',
      isNew: true
    }
  ];

  const features = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing",
    "Lorem ipsum dolor sit amet,",
    "Lorem ipsum dolor sit am",
    "Lorem ipsum dolor sit amet, con"
  ];

  return (
    <div className="w-full h-full relative bg-[#E4E5E0] flex flex-col">
      {/* Main Content - now naturally positioned after the grid */}
      <div className="flex-1 flex flex-col justify-start px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-10 sm:pt-14 md:pt-18 lg:pt-22 xl:pt-24 pb-10 sm:pb-14 md:pb-18 lg:pb-22 xl:pb-24">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12">
          <h1 className="font-lato text-[31px] sm:text-[34px] md:text-[37px] lg:text-[40px] xl:text-[42px] font-normal text-black mb-2 sm:mb-3 md:mb-4 lg:mb-5" style={{ lineHeight: '0.97' }}>
            Time to start over
          </h1>
          <p className="font-lato text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] font-normal text-gray-700" style={{ lineHeight: '0.97' }}>
            Ontdek de kracht van haartransplantatie
          </p>
        </div>

        {/* Country Selection */}
        <div className="flex justify-center mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10">
          <div 
            className="rounded-full p-0.5 sm:p-1"
            style={{
              border: '1px solid',
              borderImageSource: 'linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.6) 100%)',
              background: 'rgba(228, 229, 224, 1)',
              backdropFilter: 'blur(30px)',
              boxShadow: '4px 3px 9.1px 4px rgba(0, 0, 0, 0.25) inset',
            }}
          >
            <div className="flex">
              {['Nederland', 'Turkije'].map((country) => (
                <button
                  key={country}
                  onClick={() => updateProfile('locatie', country)}
                  className={`px-4 sm:px-5 md:px-6 lg:px-7 py-1.5 sm:py-2 rounded-full font-lato text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-normal transition-all duration-200 ${
                    profile.locatie === country
                      ? 'text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                  style={profile.locatie === country ? {
                    boxShadow: '5px 0px 12px 0px rgba(151, 151, 151, 1)',
                    backdropFilter: 'blur(52.3px)',
                    background: 'rgba(255, 255, 255, 0.9)'
                  } : {}}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="flex justify-center mb-5 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12">
          <div 
            className="rounded-full p-0.5 sm:p-1"
            style={{
              border: '1px solid',
              borderImageSource: 'linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.6) 100%)',
              background: 'rgba(228, 229, 224, 1)',
              backdropFilter: 'blur(30px)',
              boxShadow: '4px 3px 9.1px 4px rgba(0, 0, 0, 0.25) inset',
            }}
          >
            <div className="flex">
              {packages.map((pkg) => (
                <div key={pkg.id} className="relative">
                  {pkg.isNew && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-50 px-2 py-0.5 rounded-full font-lato text-[7px] font-normal text-white" style={{ background: 'rgba(76, 104, 125, 1)' }}>
                      Nieuw
                    </div>
                  )}
                  <button
                    onClick={() => updateProfile('selectedPackage', pkg.id)}
                    className={`px-4 sm:px-5 md:px-6 lg:px-7 py-1.5 sm:py-2 font-lato text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-normal transition-all duration-200 rounded-full ${
                      profile.selectedPackage === pkg.id
                        ? 'text-black'
                        : 'text-gray-600 hover:text-black'
                    }`}
                    style={profile.selectedPackage === pkg.id ? {
                      boxShadow: '5px 0px 12px 0px rgba(151, 151, 151, 1)',
                      backdropFilter: 'blur(52.3px)',
                      background: 'rgba(255, 255, 255, 0.9)'
                    } : {}}
                  >
                    {pkg.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10 [@media(max-height:780px)]:mb-3">
          <ul className="space-y-1.5 sm:space-y-2 md:space-y-2.5 lg:space-y-3 xl:space-y-3.5 [@media(max-height:780px)]:space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 mr-3 sm:mr-3.5 md:mr-4 flex-shrink-0 [@media(max-height:780px)]:mt-1.5" />
                <span className="font-lato text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] [@media(max-height:780px)]:text-[11px] font-normal leading-snug sm:leading-normal md:leading-relaxed [@media(max-height:780px)]:leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cost Display */}
        <div className="text-center">
          <p className={`font-lato text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-normal text-gray-700 transition-all duration-300 ${
            priceFlash ? 'bg-white/60 px-3 py-1 rounded-full shadow-sm' : ''
          }`}>
            Geschatte kosten: {formatPrice(totalPrice)}
          </p>
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="fixed right-3 sm:right-4 md:right-5 lg:right-6 bottom-20 sm:bottom-24 md:bottom-28 lg:bottom-32 xl:bottom-36 space-y-3 z-50">
        <button 
          onClick={() => {/* TODO: Add info functionality */}}
          className="w-11 h-11 sm:w-12 sm:h-12 bg-black/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/50 hover:border-white/70 hover:bg-black/25 transition-all duration-200 cursor-pointer"
          style={{
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          }}
        >
          <Info className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" />
        </button>
        <button 
          onClick={() => {/* TODO: Add support functionality */}}
          className="w-11 h-11 sm:w-12 sm:h-12 bg-black/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/50 hover:border-white/70 hover:bg-black/25 transition-all duration-200 cursor-pointer"
          style={{
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          }}
        >
          <img 
            src="/lovable-uploads/61372204-ad34-421b-877a-e61ca6adf93e.png" 
            alt="Support icon" 
            className="w-5 h-5 sm:w-6 sm:h-6 opacity-90"
          />
        </button>
        <button 
          onClick={() => {/* TODO: Add guide functionality */}}
          className="w-11 h-11 sm:w-12 sm:h-12 bg-black/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/50 hover:border-white/70 hover:bg-black/25 transition-all duration-200 cursor-pointer"
          style={{
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          }}
        >
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" />
        </button>
      </div>
    </div>
  );
};