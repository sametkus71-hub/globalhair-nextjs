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
  const [titleVisible, setTitleVisible] = useState(false);
  const [mainButtonVisible, setMainButtonVisible] = useState(false);
  const [otherOptionsVisible, setOtherOptionsVisible] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(200);
  };

  // Staggered entrance animations
  useEffect(() => {
    const titleTimer = setTimeout(() => setTitleVisible(true), 200);
    const mainButtonTimer = setTimeout(() => setMainButtonVisible(true), 400);
    const otherOptionsTimer = setTimeout(() => setOtherOptionsVisible(true), 600);
    
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(mainButtonTimer);
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
        title={language === "nl" ? "Ondersteuning" : "Support"}
        description={language === "nl" ? "Stel je vraag of neem contact op" : "Ask your question or get in touch"}
        language={language}
      />
      <div className={`contact-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Dark background */}
        <div className="min-h-[var(--app-height)]" style={{ background: '#0f0f0f' }}>
          
          {/* Close button */}
          <PopupCloseButton onClose={handleClose} />
          
          {/* Content Container */}
          <div className="flex flex-col items-center justify-center min-h-[var(--app-height)] px-6 py-20">
            
            {/* Title Section */}
            <div className={`text-center mb-16 md:mb-20 transition-all duration-500 ease-out ${
              titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-[0.9] tracking-tight">
                {language === 'nl' ? 'HOE KUNNEN WE' : 'HOW CAN WE'}
                <br />
                {language === 'nl' ? 'JE HELPEN?' : 'HELP YOU?'}
              </h1>
              <p className="text-base md:text-lg text-gray-400 font-normal">
                {language === 'nl' 
                  ? 'Stel je vraag of neem contact op'
                  : 'Ask your question or get in touch'
                }
              </p>
            </div>

            {/* Main Chat Button */}
            <div className={`mb-12 md:mb-16 transition-all duration-500 ease-out ${
              mainButtonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <button
                onClick={handleChatClick}
                className="group py-4 px-12 bg-white text-black text-base font-medium rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all duration-300 ease-out flex items-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                {language === 'nl' ? 'Stel je vraag' : 'Ask your question'}
              </button>
            </div>

            {/* Other Contact Methods */}
            <div className={`transition-all duration-500 ease-out ${
              otherOptionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-sm text-gray-500 text-center mb-6 font-normal">
                {language === 'nl' ? 'Of neem contact op via:' : 'Or get in touch via:'}
              </p>
              
              <div className="flex items-center justify-center gap-8">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={index}
                      onClick={method.action}
                      className="group flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded-lg transition-all duration-200"
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs text-gray-400 font-normal">{method.label}</span>
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