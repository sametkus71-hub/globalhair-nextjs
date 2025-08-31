import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { Info, BookOpen } from 'lucide-react';
import { calculatePrice, formatPrice } from '@/lib/pricing';

export const TreatmentSelectionSection2 = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useSession();
  const [priceFlash, setPriceFlash] = useState(false);
  const [buttonsLoaded, setButtonsLoaded] = useState([false, false, false]);
  const [screenSize, setScreenSize] = useState<'small' | 'regular' | 'large'>('regular');
  
  const totalPrice = calculatePrice(profile);

  // Screen size detection for iPhone models
  useEffect(() => {
    const detectScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 375) {
        setScreenSize('small'); // iPhone 13 mini, iPhone SE, smaller phones
      } else if (width >= 414) {
        setScreenSize('large'); // iPhone 14 Pro Max, iPhone 15 Plus, etc.
      } else {
        setScreenSize('regular'); // iPhone 14, iPhone 14 Pro, etc.
      }
    };

    detectScreenSize();
    window.addEventListener('resize', detectScreenSize);
    return () => window.removeEventListener('resize', detectScreenSize);
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
      "Lorem ipsum dolor sit amet, consectetur adipiscing",
      "Lorem ipsum dolor sit amet, consectetur adipiscing"
    ],
    Plus: [
      "Plus package lorem ipsum dolor sit amet, consectetur",
      "Plus enhanced features with lorem ipsum dolor sit"
    ],
    Premium: [
      "Premium package lorem ipsum dolor sit amet, consectetur",
      "Premium exclusive features with lorem ipsum dolor"
    ],
    Advanced: [
      "Advanced package lorem ipsum dolor sit amet, consectetur",
      "Advanced cutting-edge features with lorem ipsum"
    ]
  };

  // Dynamic spacing based on screen size
  const getSpacing = () => {
    switch (screenSize) {
      case 'small':
        return {
          containerPadding: 'pt-3 pb-3',
          headerPadding: 'pt-0 mb-1',
          textMargin: 'mb-1',
          countryMargin: 'mb-2',
          packageMargin: 'mb-2',
          contentMargin: 'mb-3',
          priceMargin: 'mb-2'
        };
      case 'large':
        return {
          containerPadding: 'pt-8 pb-8',
          headerPadding: 'pt-2 mb-8',
          textMargin: 'mb-6',
          countryMargin: 'mb-8',
          packageMargin: 'mb-6',
          contentMargin: 'mb-6',
          priceMargin: 'mb-4'
        };
      default:
        return {
          containerPadding: 'pt-6 pb-6',
          headerPadding: 'pt-1 mb-4',
          textMargin: 'mb-3',
          countryMargin: 'mb-4',
          packageMargin: 'mb-4',
          contentMargin: 'mb-4',
          priceMargin: 'mb-3'
        };
    }
  };

  const spacing = getSpacing();


  return (
    <div className="w-full h-full relative bg-[#E4E5E0] flex flex-col">
      {/* Main Content - dynamic spacing based on screen size */}
      <div className={`flex-1 flex flex-col justify-start px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 ${spacing.containerPadding}`}>
        {/* Header */}
        <div className={`text-center ${spacing.headerPadding}`}>
          <h1 className="font-lato text-[31px] sm:text-[34px] md:text-[37px] lg:text-[40px] xl:text-[42px] font-normal text-black mb-2 sm:mb-3 md:mb-4 lg:mb-5" style={{ lineHeight: '0.97' }}>
            Time to start over
          </h1>
          <p className={`font-lato text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] font-normal text-gray-700 ${spacing.textMargin}`} style={{ lineHeight: '0.97' }}>
            Ontdek de kracht van haartransplantatie
          </p>
        </div>

        {/* Country Selection */}
        <div className={`flex justify-center ${spacing.countryMargin}`}>
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
        <div className={`flex justify-center ${spacing.packageMargin}`}>
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

        {/* Dynamic Package Content */}
        <div className={`text-center ${spacing.contentMargin}`}>
          <div className="max-w-48 mx-auto">
            {packageContent[profile.selectedPackage as keyof typeof packageContent]?.map((item, index) => (
              <div key={index} className="flex items-start justify-start mb-1 text-left">
                <span className="text-black mr-3 mt-0.5">•</span>
                <p className="font-lato text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-normal text-gray-700" style={{ lineHeight: '1.2' }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
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