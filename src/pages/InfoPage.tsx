import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';
import { useNavigate } from 'react-router-dom';

const InfoPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [button1Visible, setButton1Visible] = useState(false);
  const [button2Visible, setButton2Visible] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    // Always go to haartransplantatie page
    const haartransplantatieePath = language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant';
    
    // Fast iOS-style dismissal - shorter animation time
    setTimeout(() => {
      // Clear any stored paths to prevent re-animations
      sessionStorage.removeItem('previousPath');
      sessionStorage.setItem('skipPageAnimations', 'true');
      navigate(haartransplantatieePath);
      // Remove the skip flag after navigation
      setTimeout(() => {
        sessionStorage.removeItem('skipPageAnimations');
      }, 100);
    }, 200);
  };

  const handleMethodClick = () => {
    // Store current path and navigate to method subpage
    sessionStorage.setItem('previousPath', window.location.pathname);
    navigate(language === 'nl' ? '/nl/info/methode' : '/en/info/method');
  };

  const handleTrajectClick = () => {
    // Store current path and navigate to trajectory subpage
    sessionStorage.setItem('previousPath', window.location.pathname);
    navigate(language === 'nl' ? '/nl/info/traject' : '/en/info/trajectory');
  };

  // Staggered entrance animations
  useEffect(() => {
    const titleTimer = setTimeout(() => setTitleVisible(true), 200);
    const button1Timer = setTimeout(() => setButton1Visible(true), 500);
    const button2Timer = setTimeout(() => setButton2Visible(true), 650);
    
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(button1Timer);
      clearTimeout(button2Timer);
    };
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      <MetaHead 
        title={language === 'nl' ? 'Hoe kunnen wij u helpen?' : 'How can we help you?'}
        description={language === 'nl' ? 'Kies uw gebied en methode' : 'Choose your area and method'}
        language={language}
      />
      <div className={`info-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Background Image with Animated Overlay */}
        <div 
          className="min-h-[var(--app-height)] relative"
          style={{ 
            backgroundImage: `url('/lovable-uploads/096ed5af-55a0-4490-9d95-4203915c4ce2.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Animated overlay blobs - 3 distinct blobs */}
          <div 
            className="absolute inset-0 animate-gradient-flow"
            style={{ 
              background: `
                radial-gradient(circle at 15% 20%, rgba(137, 179, 186, 0.4) 0%, rgba(137, 179, 186, 0.2) 30%, rgba(137, 179, 186, 0.08) 55%, transparent 80%),
                radial-gradient(circle at 85% 15%, rgba(182, 203, 177, 0.5) 0%, rgba(182, 203, 177, 0.25) 35%, rgba(182, 203, 177, 0.1) 60%, transparent 85%),
                radial-gradient(circle at 80% 85%, rgba(3, 94, 171, 0.6) 0%, rgba(3, 94, 171, 0.3) 25%, rgba(3, 94, 171, 0.12) 50%, rgba(3, 94, 171, 0.05) 70%, transparent 90%)
              `,
              backgroundSize: '120% 120%, 160% 160%, 220% 220%',
              backgroundPosition: '15% 20%, 85% 15%, 80% 85%',
              filter: 'blur(3px)',
              backdropFilter: 'blur(1px)'
            }}
          />
          
          {/* Additional glassy effect layer */}
          <div 
            className="absolute inset-0 animate-gradient-flow"
            style={{ 
              background: `
                radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 70%),
                radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 45%, transparent 75%),
                radial-gradient(circle at 80% 85%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.05) 55%, transparent 80%)
              `,
              backgroundSize: '110% 110%, 150% 150%, 200% 200%',
              backgroundPosition: '15% 20%, 85% 15%, 80% 85%',
              filter: 'blur(1px)',
              animationDelay: '2s'
            }}
          />
          
          
          {/* Content Container */}
          <div className="flex flex-col items-center justify-center min-h-[var(--app-height)] px-6 py-20">
            
            {/* Title Section */}
            <div className={`text-center mb-20 transition-all duration-500 ease-out ${
              titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="font-lato text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight mb-6" style={{ color: '#5D4037' }}>
                PRECISION IS
                <br />
                OUR MISSION
              </h1>
              <p className="text-base md:text-lg font-normal" style={{ color: '#5D4037' }}>
                Choose your topic of interest
              </p>
            </div>

            {/* Buttons Container */}
            <div className="w-full max-w-sm space-y-5">
              
              {/* How it works Button */}
              <button
                onClick={handleMethodClick}
                className={`w-full py-4 px-8 bg-white text-base font-medium rounded-full hover:bg-gray-50 active:scale-[0.98] transition-all duration-300 ease-out shadow-lg ${
                  button1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ color: '#5D4037' }}
              >
                {language === 'nl' ? 'Hoe werkt het' : 'How does it work'}
              </button>

              {/* How long does it take Button */}
              <button
                onClick={handleTrajectClick}
                className={`w-full py-4 px-8 bg-white text-base font-medium rounded-full hover:bg-gray-50 active:scale-[0.98] transition-all duration-300 ease-out shadow-lg ${
                  button2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ color: '#5D4037' }}
              >
                {language === 'nl' ? 'Hoe lang duurt het' : 'How long does it take'}
              </button>
              
            </div>
            
          </div>
        </div>
      </div>
      <BottomNavigationPortal />
    </>
  );
};

export default InfoPage;