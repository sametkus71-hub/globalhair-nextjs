import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { MessageCircle, Phone, Instagram, Mail, ChevronRight } from 'lucide-react';
import { GlobalHairLogo } from '@/components/logos/GlobalHairLogo';

const SupportPage: React.FC = () => {
  const { language } = useLanguage();
  const { handlePopupClose } = usePopupClose();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [chatButtonVisible, setChatButtonVisible] = useState(false);
  const [otherOptionsVisible, setOtherOptionsVisible] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(200);
  };

  // Staggered entrance animations
  useEffect(() => {
    const logoTimer = setTimeout(() => setLogoVisible(true), 150);
    const titleTimer = setTimeout(() => setTitleVisible(true), 300);
    const chatButtonTimer = setTimeout(() => setChatButtonVisible(true), 450);
    const otherOptionsTimer = setTimeout(() => setOtherOptionsVisible(true), 600);
    
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(titleTimer);
      clearTimeout(chatButtonTimer);
      clearTimeout(otherOptionsTimer);
    };
  }, []);

  const handleChatClick = () => {
    navigate(language === 'nl' ? '/nl/support/chat' : '/en/support/chat');
  };

  const contactMethods = [
    {
      icon: Phone,
      label: 'WhatsApp',
      action: () => window.open('https://api.whatsapp.com/send?phone=31633388757', '_blank')
    },
    {
      icon: Instagram,
      label: 'Instagram',
      action: () => window.open('https://www.instagram.com/globalhair.nl/', '_blank')
    },
    {
      icon: Mail,
      label: 'Email',
      action: () => window.location.href = 'mailto:contact@globalhair.nl'
    }
  ];

  return (
    <>
      <MetaHead
        title={language === "nl" ? "Ondersteuning - GlobalHair" : "Support - GlobalHair"}
        description={language === "nl" ? "We helpen u graag met al uw vragen" : "We're happy to help you with all your questions"}
        language={language}
      />
      <div className={`contact-page-fullscreen overflow-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Light theme background matching other pages */}
        <div className="min-h-[var(--app-height)] overflow-hidden" style={{ background: '#E4E5E0' }}>
          
          {/* Close button */}
          <PopupCloseButton onClose={handleClose} />
          
          {/* Content Container */}
          <div className="flex flex-col items-center justify-center min-h-[var(--app-height)] px-6 py-20">
            
            {/* Brand Logo Section */}
            <div className={`mb-8 md:mb-12 transition-all duration-700 ease-out ${
              logoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="w-32 md:w-40 lg:w-48 mx-auto">
                <GlobalHairLogo className="w-full h-full text-black" />
              </div>
            </div>

            {/* Professional Title */}
            <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ease-out delay-150 ${
              titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <h2 className="text-xl md:text-2xl text-gray-600 font-light mb-2">
                {language === 'nl' ? 'We helpen u graag!' : 'We\'re happy to help you!'}
              </h2>
              <p className="text-sm md:text-base text-gray-500 font-light">
                {language === 'nl' 
                  ? 'Stel uw vraag en ontvang direct antwoord'
                  : 'Ask your question and get an immediate answer'
                }
              </p>
            </div>

            {/* Enhanced Chat Button */}
            <div className={`mb-12 md:mb-14 transition-all duration-700 ease-out delay-300 ${
              chatButtonVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
            }`}>
              <button
                onClick={handleChatClick}
                className="group relative overflow-hidden animate-pulse hover:animate-none"
              >
                <div 
                  className="flex items-center gap-4 px-8 py-5 rounded-2xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 group-hover:shadow-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                    <MessageCircle className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="text-left">
                    <div className="text-gray-800 font-medium text-base mb-1 flex items-center gap-2">
                      {language === 'nl' ? 'Begin gesprek' : 'Start conversation'}
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <div className="text-gray-600 text-sm font-light">
                      {language === 'nl' ? 'Krijg direct antwoord op uw vragen' : 'Get immediate answers to your questions'}
                    </div>
                  </div>
                </div>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 ease-in-out"></div>
              </button>
            </div>

            {/* Compact Contact Methods */}
            <div className={`transition-all duration-700 ease-out delay-500 ${
              otherOptionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <p className="text-xs text-gray-500 text-center mb-4 font-light tracking-wide uppercase">
                {language === 'nl' ? 'Andere contactmogelijkheden' : 'Other ways to reach us'}
              </p>
              
              <div className="flex items-center justify-center gap-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={index}
                      onClick={method.action}
                      className="group flex flex-col items-center gap-2 p-3 hover:bg-white/50 rounded-xl transition-all duration-300 hover:scale-110"
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                        style={{
                          background: 'rgba(255, 255, 255, 0.5)',
                          border: '1px solid rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <Icon className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <span className="text-xs text-gray-500 font-light">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SupportPage;