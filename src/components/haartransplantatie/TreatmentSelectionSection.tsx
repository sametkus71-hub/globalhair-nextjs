import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { Info, BookOpen } from 'lucide-react';
import { calculatePrice, formatPrice } from '@/lib/pricing';
import { ShieldIcon } from '@/components/logos/ShieldIcon';

export const TreatmentSelectionSection = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useSession();
  const { heightBreakpoint } = useViewportHeight();
  const navigate = useNavigate();
  const [priceFlash, setPriceFlash] = useState(false);
  const [buttonsLoaded, setButtonsLoaded] = useState([false, false]);
  
  // Check if user comes from home page
  const isFromHomePage = () => {
    const referrer = document.referrer;
    const currentHost = window.location.origin;
    
    // Check if referrer is from our home page
    return referrer === `${currentHost}/` || 
           referrer === `${currentHost}/nl` || 
           referrer === `${currentHost}/en` ||
           referrer.includes('/nl/') === false && referrer.includes('/en/') === false;
  };
  
  const [comesFromHome] = useState(() => isFromHomePage());
  
  const totalPrice = calculatePrice(profile);

  // Force recompilation to clear cached version with spacing references - v3
  console.log('TreatmentSelectionSection3 loaded successfully - height-based spacing active');

  // Flash effect when price changes
  useEffect(() => {
    setPriceFlash(true);
    const timer = setTimeout(() => setPriceFlash(false), 300);
    return () => clearTimeout(timer);
  }, [totalPrice]);

  // Staggered button entrance animation
  useEffect(() => {
    if (comesFromHome) {
      const timers = [
        setTimeout(() => setButtonsLoaded(prev => [true, prev[1]]), 2700), // 2400ms + 300ms
        setTimeout(() => setButtonsLoaded(prev => [prev[0], true]), 2900), // 2700ms + 200ms
      ];
      
      return () => timers.forEach(clearTimeout);
    } else {
      setButtonsLoaded([true, true]);
    }
  }, [comesFromHome]);

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
      id: 'Advanced', 
      label: 'Advanced',
      isNew: true
    }
  ];

  const packageContent = {
    Standard: [
      "FUE Saffier",
      "GHI Precision Method™",
      "1 Year Personal Aftercare",
      "————————————————————",
      "🌱 Natural growth"
    ],
    Premium: [
      "FUE Saffier / DHI",
      "Comfort Verdoving",
      "V6 Hairboost® - Pre-Treatment",
      "V6 Hairboost® – 1 Year Subscription",
      "GHI Precision Method™",
      "1 Year Personal Aftercare",
      "————————————————————",
      "Recovery x2 faster",
      "🌱🌱 + More density & growth"
    ],
    Advanced: [
      "FUE Saffier / DHI",
      "GHI Stemcell Repair™",
      "Comfort Verdoving",
      "V6 Hairboost® - Pre-Treatment",
      "V6 Hairboost® – 1 Year Subscription",
      "GHI Precision Method™",
      "1 Year Personal Aftercare"
    ]
  };

  // Dynamic spacing based on viewport height breakpoints
  const getSpacing = () => {
    if (heightBreakpoint === 'small') {
      return {
        container: 'pt-0 pb-0', // Ultra compact for small height screens
        header: '-mt-4 mb-0', // Move header up with negative margin
        text: 'mb-2', // Tight space between subtitle and region switch
        country: 'mb-1', // Less gap between region and package switches
        package: 'mb-1', // Small space for content
        content: 'mb-3' // Less space between lorem ipsum and price
      };
    } else if (heightBreakpoint === 'medium') {
      return {
        container: 'pt-1 pb-1', // Moderate padding
        header: '-mt-2 mb-2', // Move header up with negative margin
        text: 'mb-5', // More breathing room between subtitle and location switch
        country: 'mb-3', // Moderate gap between region and package switches
        package: 'mb-3', // Moderate space for content
        content: 'mb-4' // Moderate content spacing
      };
    } else {
      return {
        container: 'pt-2 pb-2', // Generous padding for large screens
        header: '-mt-2 mb-3', // Move header up with negative margin
        text: 'mb-6', // Maximum breathing room between subtitle and location switch
        country: 'mb-4', // Generous gap between region and package switches
        package: 'mb-4', // Generous space for content
        content: 'mb-5' // Generous content spacing
      };
    }
  };

  const spacing = getSpacing();

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* Main Content - phone size specific spacing */}
      <div className={`flex-1 flex flex-col justify-start px-4 relative z-10`}>
        {/* Header */}
        <div className={`text-center ${spacing.header}`}>
          <h1 
            className={`font-lato text-[24px] font-normal text-white mb-2 uppercase ${comesFromHome ? 'opacity-0 animate-ios-entrance' : 'opacity-100'}`}
            style={{ 
              lineHeight: '0.97',
              animationDelay: comesFromHome ? '1000ms' : '0ms' // 600ms (grid) + 400ms = 1000ms
            }}
          >
            WHERE CONFIDENCE GROWS
          </h1>
          <p 
            className={`font-lato text-[13px] font-normal text-white/80 ${spacing.text} ${comesFromHome ? 'opacity-0 animate-ios-entrance' : 'opacity-100'}`}
            style={{ 
              lineHeight: '0.97',
              animationDelay: comesFromHome ? '1300ms' : '0ms' // 1000ms + 300ms = 1300ms
            }}
          >
            GHI Hairtransplant
          </p>
        </div>

        {/* Country Selection */}
        <div 
          className={`flex justify-center ${spacing.country} relative ${comesFromHome ? 'opacity-0 animate-ios-entrance' : 'opacity-100'}`}
          style={{ 
            zIndex: 9999,
            animationDelay: comesFromHome ? '1800ms' : '0ms' // 1300ms + 500ms = 1800ms
          }}
        >
          <div 
            className="inline-flex p-1 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            {['Nederland', 'Turkije'].map((country) => (
              <button
                key={country}
                onClick={() => updateProfile('locatie', country)}
                className={`px-2 py-1 ${profile.locatie === country ? 'rounded-md' : 'rounded-lg'} font-lato text-[10px] font-medium transition-all duration-300 ease-out ${
                  profile.locatie === country
                    ? 'text-gray-900'
                    : 'text-white/80 hover:text-white'
                }`}
                style={profile.locatie === country ? {
                  backdropFilter: 'blur(40px)',
                  background: 'rgba(255, 255, 255, 0.3)'
                } : {}}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* Package Selection */}
        <div 
          className={`flex justify-center ${spacing.package} ${comesFromHome ? 'opacity-0 animate-ios-entrance' : 'opacity-100'}`}
          style={{ animationDelay: comesFromHome ? '2100ms' : '0ms' }} // 1800ms + 300ms = 2100ms
        >
          <div 
            className="inline-flex p-1 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            {packages.map((pkg) => (
              <div key={pkg.id} className="relative">
                {pkg.isNew && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 px-2 py-0.5 rounded-lg font-lato text-[7px] font-normal text-white" style={{ background: 'rgba(76, 104, 125, 1)' }}>
                    Nieuw
                  </div>
                )}
                <button
                  onClick={() => updateProfile('selectedPackage', pkg.id)}
                  className={`px-4 py-1.5 ${profile.selectedPackage === pkg.id ? 'rounded-md' : 'rounded-lg'} font-lato text-[12px] font-medium transition-all duration-300 ease-out ${
                    profile.selectedPackage === pkg.id
                      ? 'text-gray-900'
                      : 'text-white/80 hover:text-white'
                  }`}
                  style={profile.selectedPackage === pkg.id ? {
                    backdropFilter: 'blur(40px)',
                    background: 'rgba(255, 255, 255, 0.3)'
                  } : {}}
                >
                  {pkg.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Package Content */}
        <div 
          className={`text-center ${spacing.content} ${comesFromHome ? 'opacity-0 animate-ios-entrance' : 'opacity-100'}`}
          style={{ animationDelay: comesFromHome ? '2400ms' : '0ms' }} // 2100ms + 300ms = 2400ms
        >
          <div className="max-w-56 mx-auto">
            {packageContent[profile.selectedPackage as keyof typeof packageContent]?.map((item, index) => {
              // Check if item is a separator
              if (item.startsWith('————')) {
                return (
                  <div key={index} className="my-3 px-4">
                    <div className="h-px bg-white/30 w-full"></div>
                  </div>
                );
              }
              
              // Check if item is a benefit line (starts with emoji or contains emoji)
              const isBenefitLine = /^[🌱💪⚡🎯]|Recovery x2|More density/.test(item);
              
              if (isBenefitLine) {
                return (
                  <div key={index} className="text-center my-2">
                    <p className="font-lato text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-light text-white/90" style={{ lineHeight: '1.1' }}>
                      {item}
                    </p>
                  </div>
                );
              }
              
              // Regular feature item with shield icon
              return (
                <div key={index} className="flex items-center justify-start -mb-6 -mt-5 text-left relative" style={{ zIndex: 1 }}>
                  <div className="w-12 h-12 -mr-1 flex-shrink-0 pt-2 relative" style={{ zIndex: 1 }}>
                    <ShieldIcon className="w-full h-full [&_.cls-1]:fill-white" />
                  </div>
                  <p className="font-lato text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-light text-white" style={{ lineHeight: '0.9' }}>
                    {item}
                  </p>
                </div>
              );
            })}
            
            {/* Cost Display - moved inside content section */}
            <div 
              className={`text-center mt-4 ${comesFromHome ? 'opacity-0 animate-ios-entrance' : 'opacity-100'}`}
              style={{ animationDelay: comesFromHome ? '2700ms' : '0ms' }} // 2400ms + 300ms = 2700ms
            >
              <p className={`font-lato text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-normal text-white/70 transition-all duration-300 ${
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
          onClick={() => {
            // Store current path before navigating to popup
            sessionStorage.setItem('previousPath', window.location.pathname);
            navigate(language === 'nl' ? '/nl/info' : '/en/info');
          }}
          className={`w-12 h-12 sm:w-14 sm:h-14 bg-black/18 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/50 hover:border-white/70 hover:bg-black/22 transition-all duration-700 ease-in-out cursor-pointer ${
            buttonsLoaded[0] ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          <Info className="w-6 h-6 sm:w-7 sm:h-7 text-white/90" />
        </button>
        <button 
          onClick={() => {
            // Store current path before navigating to popup
            sessionStorage.setItem('previousPath', window.location.pathname);
            navigate(language === 'nl' ? '/nl/support' : '/en/support');
          }}
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
      </div>
    </div>
  );
};