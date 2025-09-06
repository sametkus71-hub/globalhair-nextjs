import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

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

  // Staggered entrance animations
  useEffect(() => {
    const titleTimer = setTimeout(() => setTitleVisible(true), 200);
    const contentTimer = setTimeout(() => setContentVisible(true), 500);
    
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(contentTimer);
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
        title={language === 'nl' ? 'Contact - Hair Excellence' : 'Contact - Hair Excellence'}
        description={language === 'nl' ? 'Neem contact met ons op' : 'Get in touch with us'}
        language={language}
      />
      <div className={`contact-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Background matching haartransplantatie page */}
        <div className="min-h-[var(--app-height)]" style={{ background: '#E4E5E0' }}>
          
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
                {language === 'nl' ? 'CONTACT' : 'CONTACT'}
              </h1>
              <p className="text-base md:text-lg text-gray-500 font-normal">
                {language === 'nl' ? 'Neem contact met ons op' : 'Get in touch with us'}
              </p>
            </div>

            {/* Content Placeholder */}
            <div className={`text-center transition-all duration-500 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-gray-600 text-lg">
                {language === 'nl' ? 'Contact informatie komt hier...' : 'Contact information coming soon...'}
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;