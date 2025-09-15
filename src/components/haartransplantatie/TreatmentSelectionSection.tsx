import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useSession } from '@/hooks/useSession';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { NewPackageContent } from './NewPackageContent';

export const TreatmentSelectionSection = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useSession();
  const { heightBreakpoint } = useViewportHeight();
  const navigate = useNavigate();
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

  // Staggered button entrance animation
  useEffect(() => {
    if (comesFromHome) {
      const timers = [
        setTimeout(() => setButtonsLoaded(prev => [true, prev[1]]), 1950),
        setTimeout(() => setButtonsLoaded(prev => [prev[0], true]), 2000), // 50ms gap
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


  // Dynamic spacing based on viewport height breakpoints
  const getSpacing = () => {
    // Check for larger mobile devices (iPhone 14 Pro Max)
    const isLargerMobile = window.innerWidth > 390 && window.innerWidth <= 480 && window.innerHeight > window.innerWidth;
    
    if (heightBreakpoint === 'small') {
      return {
        container: 'pt-0 pb-0', // Ultra compact for small height screens
        country: '-mt-5 mb-2', // Pull closer on small screens (less spacing)
        package: isLargerMobile ? 'mb-3' : 'mb-1', // More space for larger mobile devices
        content: 'mb-3' // Less space between lorem ipsum and price
      };
    } else if (heightBreakpoint === 'medium') {
      return {
        container: 'pt-1 pb-1', // Moderate padding
        country: '-mt-2 mb-2', // Moderate spacing on medium screens
        package: isLargerMobile ? 'mb-5' : 'mb-3', // More space for larger mobile devices
        content: 'mb-4' // Moderate content spacing
      };
    } else {
      return {
        container: 'pt-2 pb-2', // Generous padding for large screens
        country: 'mt-1 mb-2', // More spacing on large screens (further apart)
        package: isLargerMobile ? 'mb-6' : 'mb-4', // More space for larger mobile devices
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
        <div className="text-center -mt-6 mb-2">
          <p 
            className={`font-lato text-[13px] font-normal text-white/80 mb-1 ${comesFromHome ? 'opacity-0 animate-ios-entrance' : 'opacity-100'}`}
            style={{ 
              lineHeight: '0.97',
              marginTop: '-90px',
              paddingBottom: '10px',
              animationDelay: comesFromHome ? '600ms' : '0ms'
            }}
          >
            GHI Hairtransplant
          </p>
          <h1 
            className={`font-lato text-[24px] font-normal text-white uppercase ${comesFromHome ? 'opacity-0 animate-ios-entrance' : 'opacity-100'}`}
            style={{ 
              lineHeight: '0.97',
              animationDelay: comesFromHome ? '900ms' : '0ms'
            }}
          >
            WHERE CONFIDENCE GROWS
          </h1>
        </div>

        {/* Country Text */}
        <div 
          className={`flex justify-center ${spacing.country} relative ${comesFromHome ? 'opacity-0 animate-fade-entrance' : 'opacity-100'}`}
          style={{ 
            animationDelay: comesFromHome ? '1700ms' : '0ms'
          }}
        >
          <p className="font-lato text-[14px] font-normal text-white pb-2">
            Nederland | Turkije
          </p>
        </div>

        {/* Package Selection */}
        <div 
          className={`flex justify-center ${spacing.package} ${comesFromHome ? 'opacity-0 animate-fade-entrance' : 'opacity-100'}`}
          style={{ animationDelay: comesFromHome ? '1750ms' : '0ms' }}
        >
          <div 
            className="inline-flex p-0.5 rounded-full relative"
            style={{
              background: 'rgba(228, 229, 224, 0.1)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0px 0px 8.4px 1px rgba(255, 255, 255, 0.25) inset',
            }}
          >
            {packages.map((pkg) => (
              <div key={pkg.id} className="relative">
                {pkg.isNew && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 px-1.5 py-0.5 rounded-full font-lato text-[6px] font-medium text-white" style={{ background: '#692126', backdropFilter: 'blur(10px)' }}>
                    Nieuw
                  </div>
                )}
                <button
                  onClick={() => updateProfile('selectedPackage', pkg.id)}
                  className={`px-3 py-2.5 rounded-full font-lato text-[13px] font-medium transition-all duration-300 ease-out ${
                    profile.selectedPackage === pkg.id
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                  style={profile.selectedPackage === pkg.id ? {
                    background: 'rgba(255, 255, 255, 0.5)',
                    boxShadow: '10px 3px 15px 0px rgba(0, 0, 0, 0.4)'
                  } : {}}
                >
                  {pkg.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* New Package Content */}
        <div 
          className={`text-center ${spacing.content} ${comesFromHome ? 'opacity-0 animate-fade-entrance' : 'opacity-100'}`}
          style={{ animationDelay: comesFromHome ? '1800ms' : '0ms' }}
        >
          <div className="max-w-56 mx-auto">
            <NewPackageContent />
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
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 sm:w-7 sm:h-7 text-white/90"
          >
            <circle cx="12" cy="12" r="11.6" stroke="white" strokeWidth="0.8"/>
            <path d="M12 5V12L17 17" stroke="white" strokeWidth="0.8"/>
          </svg>
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
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 sm:w-7 sm:h-7 opacity-90"
          >
            <g clipPath="url(#clip0_36_1064)">
              <path d="M4.00001 10.186H9.20001C9.42121 10.186 9.60001 10.0068 9.60001 9.78599C9.60001 9.56519 9.42121 9.38599 9.20001 9.38599H4.00001C3.77881 9.38599 3.60001 9.56519 3.60001 9.78599C3.60001 10.0068 3.77881 10.186 4.00001 10.186Z" fill="white"/>
              <path d="M14.4 11.786H4.00001C3.77881 11.786 3.60001 11.9652 3.60001 12.186C3.60001 12.4068 3.77881 12.586 4.00001 12.586H14.4C14.6212 12.586 14.8 12.4068 14.8 12.186C14.8 11.9652 14.6212 11.786 14.4 11.786Z" fill="white"/>
              <path d="M14.4 14.186H4.00001C3.77881 14.186 3.60001 14.3652 3.60001 14.586C3.60001 14.8068 3.77881 14.986 4.00001 14.986H14.4C14.6212 14.986 14.8 14.8068 14.8 14.586C14.8 14.3652 14.6212 14.186 14.4 14.186Z" fill="white"/>
              <path d="M21.6288 1.01399L7.972 0.985992C6.664 0.985992 5.6 2.04999 5.6 3.35799V5.40759L2.372 5.41439C1.064 5.41439 0 6.47839 0 7.78639V16.2428C0 17.5508 1.064 18.6144 2.372 18.6144H4.8V22.6144C4.8 22.7796 4.9016 22.928 5.056 22.9876C5.1028 23.0056 5.1516 23.0144 5.2 23.0144C5.3104 23.0144 5.4188 22.9684 5.496 22.8836L9.3776 18.6136L16.028 18.5864C17.336 18.5864 18.4 17.5224 18.4 16.2148V16.1696L20.504 18.484C20.5812 18.5688 20.6896 18.6148 20.8 18.6148C20.8484 18.6148 20.8972 18.606 20.944 18.588C21.0984 18.5284 21.2 18.38 21.2 18.2148V14.2148H21.628C22.936 14.2148 24 13.1508 24 11.8432V3.38599C24 2.07839 22.9364 1.01439 21.6288 1.01399ZM17.6 16.2144C17.6 17.0812 16.8948 17.786 16.0264 17.786L9.1984 17.814C9.0864 17.8144 8.9792 17.862 8.904 17.9448L5.6 21.5796V18.214C5.6 17.9932 5.4212 17.814 5.2 17.814H2.372C1.5052 17.814 0.8 17.1088 0.8 16.2424V7.78599C0.8 6.91919 1.5052 6.21399 2.3728 6.21399L6 6.20639L16.028 6.18559C16.8948 6.18559 17.6 6.89079 17.6 7.75759V15.134V16.2144ZM23.2 11.8424C23.2 12.7092 22.4948 13.414 21.628 13.414H20.8C20.5788 13.414 20.4 13.5932 20.4 13.814V17.1796L18.4 14.9796V7.75799C18.4 6.44999 17.336 5.38599 16.0272 5.38599L6.4 5.40559V3.35759C6.4 2.49079 7.1052 1.78559 7.9712 1.78559L21.6276 1.81359C22.4944 1.81359 23.2004 2.51879 23.2004 3.38559L23.2 11.8424Z" fill="white"/>
            </g>
            <defs>
              <clipPath id="clip0_36_1064">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </div>
  );
};