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
          {/* Animated overlay blobs */}
          <div 
            className="absolute inset-0 animate-gradient-flow"
            style={{ 
              background: `
                radial-gradient(circle at 0% 0%, rgba(137, 179, 186, 0.35) 0%, rgba(137, 179, 186, 0.15) 35%, transparent 60%),
                radial-gradient(circle at 100% 0%, rgba(182, 203, 177, 0.4) 0%, rgba(182, 203, 177, 0.2) 40%, transparent 70%),
                radial-gradient(circle at 0% 100%, rgba(104, 170, 194, 0.35) 0%, rgba(104, 170, 194, 0.15) 35%, transparent 60%),
                radial-gradient(circle at 100% 100%, rgba(3, 94, 171, 0.35) 0%, rgba(3, 94, 171, 0.15) 35%, transparent 60%)
              `,
              backgroundSize: '140% 140%, 160% 160%, 150% 150%, 135% 135%',
              backgroundPosition: '15% 15%, 85% 15%, 15% 85%, 85% 85%',
              filter: 'blur(1px)',
              backdropFilter: 'blur(0.5px)'
            }}
          />
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-gray-400/60 hover:bg-gray-400/80 transition-colors flex items-center justify-center"
            aria-label={language === 'nl' ? 'Sluiten' : 'Close'}
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {/* Content Container */}
          <div className="flex flex-col items-center justify-center min-h-[var(--app-height)] px-6 py-20">
            
            {/* Title Section */}
            <div className={`text-center mb-20 transition-all duration-500 ease-out ${
              titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-700 mb-6 leading-[0.9] tracking-tight">
                {language === 'nl' ? 'HOW CAN WE' : 'HOW CAN WE'}
                <br />
                {language === 'nl' ? 'HELP YOU?' : 'HELP YOU?'}
              </h1>
              <p className="text-base md:text-lg text-gray-500 font-normal">
                {language === 'nl' ? 'Kies jou gebied en methode' : 'Choose your area and method'}
              </p>
            </div>

            {/* Buttons Container */}
            <div className="w-full max-w-sm space-y-5">
              
              {/* Treatment Method Button */}
              <button
                onClick={handleMethodClick}
                className={`w-full py-4 px-8 bg-gray-900 text-white text-base font-medium rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out ${
                  button1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {language === 'nl' ? 'Behandel methode' : 'Treatment method'}
              </button>

              {/* Treatment Trajectory Button */}
              <button
                onClick={handleTrajectClick}
                className={`w-full py-4 px-8 bg-gray-900 text-white text-base font-medium rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out ${
                  button2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {language === 'nl' ? 'Behandel traject' : 'Treatment trajectory'}
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