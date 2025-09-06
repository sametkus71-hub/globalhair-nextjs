import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
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
    // Get previous path or default to haartransplantatie
    const previousPath = sessionStorage.getItem('previousPath') || 
                        (language === 'nl' ? '/nl/haartransplantatie' : '/en/hair-transplant');
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      sessionStorage.removeItem('previousPath');
      navigate(previousPath);
    }, 300);
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
        {/* Background matching haartransplantatie page */}
        <div className="min-h-[var(--app-height)]" style={{ background: '#E4E5E0' }}>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="fixed top-4 left-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors transform hover:scale-105 active:scale-95"
            aria-label={language === 'nl' ? 'Sluiten' : 'Close'}
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          
          {/* Content Container */}
          <div className="flex flex-col items-center justify-center min-h-[var(--app-height)] px-6 py-20">
            
            {/* Title Section */}
            <div className={`text-center mb-16 transition-all duration-500 ease-out ${
              titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                {language === 'nl' ? 'HOW CAN WE' : 'HOW CAN WE'}
                <br />
                {language === 'nl' ? 'HELP YOU?' : 'HELP YOU?'}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 font-medium">
                {language === 'nl' ? 'Kies jou gebied en methode' : 'Choose your area and method'}
              </p>
            </div>

            {/* Buttons Container */}
            <div className="w-full max-w-md space-y-6">
              
              {/* Treatment Method Button */}
              <button
                onClick={handleMethodClick}
                className={`w-full py-6 px-8 bg-gray-900 text-white text-lg font-semibold rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out ${
                  button1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {language === 'nl' ? 'Behandel methode' : 'Treatment method'}
              </button>

              {/* Treatment Trajectory Button */}
              <button
                onClick={handleTrajectClick}
                className={`w-full py-6 px-8 bg-gray-900 text-white text-lg font-semibold rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 ease-out ${
                  button2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {language === 'nl' ? 'Behandel traject' : 'Treatment trajectory'}
              </button>
              
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoPage;