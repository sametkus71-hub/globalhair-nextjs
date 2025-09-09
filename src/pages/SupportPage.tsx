import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { MessageCircle, Phone, Instagram, Mail } from 'lucide-react';

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
      <div className={`contact-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Light theme background matching other pages */}
        <div className="min-h-[var(--app-height)]" style={{ background: '#E4E5E0' }}>
          
          {/* Close button */}
          <PopupCloseButton onClose={handleClose} />
          
          {/* Content Container */}
          <div className="flex flex-col items-center justify-center min-h-[var(--app-height)] px-6 py-20">
            
            {/* Brand Logo Section */}
            <div className={`mb-8 transition-all duration-700 ease-out ${
              logoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <h1 className="text-3xl md:text-4xl font-light text-gray-700 tracking-wide">
                GlobalHair
              </h1>
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

            {/* Professional Chat Button */}
            <div className={`mb-16 md:mb-20 transition-all duration-700 ease-out delay-300 ${
              chatButtonVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
            }`}>
              <button
                onClick={handleChatClick}
                className="group relative overflow-hidden"
              >
                <div 
                  className="flex items-center gap-4 px-8 py-4 rounded-2xl transition-all duration-300 group-hover:scale-105 group-active:scale-95"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="text-left">
                    <div className="text-gray-800 font-medium text-base mb-1">
                      {language === 'nl' ? 'Begin gesprek' : 'Start conversation'}
                    </div>
                    <div className="text-gray-600 text-sm font-light">
                      {language === 'nl' ? 'Krijg direct antwoord op uw vragen' : 'Get immediate answers to your questions'}
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Subtle Contact Methods */}
            <div className={`transition-all duration-700 ease-out delay-500 ${
              otherOptionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <p className="text-xs text-gray-500 text-center mb-6 font-light tracking-wide uppercase">
                {language === 'nl' ? 'Andere contactmogelijkheden' : 'Other ways to reach us'}
              </p>
              
              <div className="flex items-center justify-center gap-8">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={index}
                      onClick={method.action}
                      className="group flex flex-col items-center gap-3 p-4 hover:bg-white/50 rounded-xl transition-all duration-300"
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                        style={{
                          background: 'rgba(255, 255, 255, 0.5)',
                          border: '1px solid rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <Icon className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
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