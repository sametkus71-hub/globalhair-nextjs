import React, { useState, useEffect } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';

const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const { handlePopupClose } = usePopupClose();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(200);
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
          <PopupCloseButton onClose={handleClose} />
          
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