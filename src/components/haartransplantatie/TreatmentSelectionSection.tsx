import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { Info, BookOpen } from 'lucide-react';
import { calculatePrice, formatPrice } from '@/lib/pricing';
import { ShieldIcon } from '@/components/logos/ShieldIcon';

export const TreatmentSelectionSection = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useSession();
  const [priceFlash, setPriceFlash] = useState(false);
  const [buttonsLoaded, setButtonsLoaded] = useState([false, false, false]);
  const [phoneSize, setPhoneSize] = useState<'small' | 'large'>('small');
  
  const totalPrice = calculatePrice(profile);

  // Force recompilation to clear cached version with spacing references
  console.log('TreatmentSelectionSection2 loaded successfully');

  // Phone size detection - specifically for phones
  useEffect(() => {
    const detectPhoneSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Only apply phone detection for mobile devices
      if (width <= 480 && height > width) { // Portrait mobile devices
        if (width <= 393) { // More robust detection for iPhone 14 and smaller
          setPhoneSize('small'); // iPhone 14, iPhone 13, smaller phones
        } else {
          setPhoneSize('large'); // iPhone 14 Pro Max, iPhone 15 Plus, larger phones
        }
      } else {
        setPhoneSize('large'); // Default for tablets/desktops
      }
      
      console.log('Phone size detected:', width <= 393 ? 'small' : 'large', 'width:', width);
    };

    detectPhoneSize();
    window.addEventListener('resize', detectPhoneSize);
    return () => window.removeEventListener('resize', detectPhoneSize);
  }, []);

  // Flash effect when price changes
  useEffect(() => {
    setPriceFlash(true);
    const timer = setTimeout(() => setPriceFlash(false), 300);
    return () => clearTimeout(timer);
  }, [totalPrice]);

  // Staggered button entrance animation
  useEffect(() => {
    const timers = [
      setTimeout(() => setButtonsLoaded(prev => [true, prev[1], prev[2]]), 3200),
      setTimeout(() => setButtonsLoaded(prev => [prev[0], true, prev[2]]), 3400),
      setTimeout(() => setButtonsLoaded(prev => [prev[0], prev[1], true]), 3600),
    ];
    
    return () => timers.forEach(clearTimeout);
  }, []);

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

  const packageContent = {
    Standard: [
      "Uitgebreide en behandeloptes",
      "Volledig precisieprogrannna",
      "Met intensieve begeleiding",
      "Ons exclusieve biotechprotocol"
    ],
    Plus: [
      "Uitgebreide en behandeloptes",
      "Volledig precisieprogrannna",
      "Met intensieve begeleiding",
      "Ons exclusieve biotechprotocol"
    ],
    Premium: [
      "Uitgebreide en behandeloptes",
      "Volledig precisieprogrannna",
      "Met intensieve begeleiding",
      "Ons exclusieve biotechprotocol"
    ],
    Advanced: [
      "Uitgebreide en behandeloptes",
      "Volledig precisieprogrannna",
      "Met intensieve begeleiding",
      "Ons exclusieve biotechprotocol"
    ]
  };

  // Dynamic spacing based on phone size detection
  const getPhoneSpacing = () => {
    if (phoneSize === 'small') {
      return {
        container: 'pt-0 pb-0', // Ultra compact for iPhone 14
        header: 'pt-0 mb-0', // Move header up more for small phones
        text: 'mb-6', // More space between subtitle and region switch
        country: 'mb-2', // More gap between region and package switches
        package: 'mb-2', // Small space for content
        content: 'mb-5' // More space between lorem ipsum and price
      };
    } else {
      return {
        container: 'pt-6 pb-6',
        header: 'pt-0 mb-4', // Move header up for large phones too
        text: 'mb-4',
        country: 'mb-6',
        package: 'mb-6',
        content: 'mb-6'
      };
    }
  };

  const spacing = getPhoneSpacing();

  return (
    <div className="w-full h-full relative bg-[#E4E5E0] flex flex-col">
      {/* Main Content - phone size specific spacing */}
      <div className={`flex-1 flex flex-col justify-start px-4 ${spacing.container}`}>
        {/* Header */}
        <div className={`text-center ${spacing.header}`}>
          <h1 className="font-lato text-[31px] font-normal text-black mb-2 uppercase" style={{ lineHeight: '0.97' }}>
            Time to start over
          </h1>
          <p className={`font-lato text-[13px] font-normal text-gray-700 ${spacing.text}`} style={{ lineHeight: '0.97' }}>
            GHI Hairtransplant
          </p>
        </div>

        {/* Country Selection */}
        <div className={`flex justify-center ${spacing.country}`}>
          <div 
            className="rounded-lg p-0.5 sm:p-1"
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
                  className={`px-4 sm:px-5 md:px-6 lg:px-7 py-1.5 sm:py-2 rounded-md font-lato text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-normal transition-all duration-200 ${
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
        <div className={`flex justify-center ${spacing.package}`}>
          <div 
            className="rounded-lg p-0.5 sm:p-1"
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
                    className={`px-4 sm:px-5 md:px-6 lg:px-7 py-1.5 sm:py-2 font-lato text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-normal transition-all duration-200 rounded-md ${
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

        {/* Dynamic Package Content */}
        <div className={`text-center ${spacing.content}`}>
          <div className="max-w-48 mx-auto">
            {packageContent[profile.selectedPackage as keyof typeof packageContent]?.map((item, index) => (
              <div key={index} className="flex items-start justify-start mb-2 text-left">
                <div className="w-7 h-7 mr-2 mt-0.5 flex-shrink-0">
                  <ShieldIcon className="w-full h-full [&_.cls-1]:fill-black" />
                </div>
                <p className="font-lato text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-light text-gray-800" style={{ lineHeight: '1.3' }}>
                  {item}
                </p>
              </div>
            ))}
            
            {/* Cost Display - moved inside content section */}
            <div className="text-center mt-4">
              <p className={`font-lato text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-normal text-gray-600 transition-all duration-300 ${
                priceFlash ? 'bg-white/60 px-3 py-1 rounded-full shadow-sm' : ''
              }`}>
                Geschatte kosten: {formatPrice(totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="fixed right-3 sm:right-4 md:right-5 lg:right-6 bottom-20 sm:bottom-24 md:bottom-28 lg:bottom-32 xl:bottom-36 space-y-3 z-50">
        <button 
          onClick={() => {/* TODO: Add info functionality */}}
          className={`w-12 h-12 sm:w-14 sm:h-14 bg-black/18 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/50 hover:border-white/70 hover:bg-black/22 transition-all duration-700 ease-in-out cursor-pointer ${
            buttonsLoaded[0] ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          <Info className="w-6 h-6 sm:w-7 sm:h-7 text-white/90" />
        </button>
        <button 
          onClick={() => {/* TODO: Add support functionality */}}
          className={`w-12 h-12 sm:w-14 sm:h-14 bg-black/18 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/50 hover:border-white/70 hover:bg-black/22 transition-all duration-700 ease-in-out cursor-pointer ${
            buttonsLoaded[1] ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          <img 
            src="/lovable-uploads/61372204-ad34-421b-877a-e61ca6adf93e.png" 
            alt="Support icon" 
            className="w-6 h-6 sm:w-7 sm:h-7 opacity-90"
          />
        </button>
        <button 
          onClick={() => {/* TODO: Add guide functionality */}}
          className={`w-12 h-12 sm:w-14 sm:h-14 bg-black/18 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/50 hover:border-white/70 hover:bg-black/22 transition-all duration-700 ease-in-out cursor-pointer ${
            buttonsLoaded[2] ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white/90" />
        </button>
      </div>
    </div>
  );
};