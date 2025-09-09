import React, { useState, useEffect } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { MessageCircle, Phone, Instagram, Mail } from 'lucide-react';

const SupportPage: React.FC = () => {
  const { language } = useLanguage();
  const { handlePopupClose } = usePopupClose();
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    handlePopupClose(200);
  };

  // Staggered entrance animations
  useEffect(() => {
    const titleTimer = setTimeout(() => setTitleVisible(true), 200);
    const subtitleTimer = setTimeout(() => setSubtitleVisible(true), 400);
    const optionsTimer = setTimeout(() => setOptionsVisible(true), 600);
    
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(optionsTimer);
    };
  }, []);

  const supportOptions = [
    {
      id: 'chat',
      title: language === 'nl' ? 'Live Chat' : 'Live Chat',
      description: language === 'nl' ? 'Direct chatten met onze experts' : 'Chat directly with our experts',
      icon: MessageCircle,
      action: () => {
        // Navigate to chat subpage
        window.location.href = language === 'nl' ? '/nl/support/chat' : '/en/support/chat';
      },
      primary: true
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: language === 'nl' ? 'Snel contact via WhatsApp' : 'Quick contact via WhatsApp',
      icon: Phone,
      action: () => {
        window.open('https://api.whatsapp.com/send?phone=31633388757', '_blank');
      }
    },
    {
      id: 'instagram',
      title: 'Instagram',
      description: language === 'nl' ? 'Volg ons op Instagram' : 'Follow us on Instagram',
      icon: Instagram,
      action: () => {
        window.open('https://www.instagram.com/globalhair.nl/', '_blank');
      }
    },
    {
      id: 'email',
      title: 'Email',
      description: language === 'nl' ? 'Stuur ons een email' : 'Send us an email',
      icon: Mail,
      action: () => {
        window.location.href = 'mailto:contact@globalhair.nl';
      }
    }
  ];

  return (
    <>
      <MetaHead
        title={language === "nl" ? "Ondersteuning" : "Support"}
        description={language === "nl" ? "Kies hoe u contact met ons wilt opnemen" : "Choose how you want to get in touch with us"}
        language={language}
      />
      <div className={`contact-page-fullscreen overflow-y-auto overflow-x-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {/* Dark background for support environment */}
        <div className="min-h-[var(--app-height)]" style={{ background: '#1a1a1a' }}>
          
          {/* Close button */}
          <PopupCloseButton onClose={handleClose} />
          
          {/* Scrollable Content */}
          <div className="pt-12 md:pt-16 pb-20 md:pb-32 px-6 h-[max(100vh,var(--app-height))]">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              
              {/* Title Section */}
              <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-500 ease-out ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
                  {language === 'nl' ? 'HOE KUNNEN WE' : 'HOW CAN WE'}
                  <br />
                  {language === 'nl' ? 'JE HELPEN?' : 'HELP YOU?'}
                </h1>
              </div>

              {/* Subtitle */}
              <div className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-500 ease-out ${
                subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  {language === 'nl' 
                    ? 'Kies de manier die het beste bij je past om in contact te komen met ons team van experts.'
                    : 'Choose the way that suits you best to get in touch with our team of experts.'
                  }
                </p>
              </div>

              {/* Support Options Grid */}
              <div className={`flex-1 flex items-center justify-center transition-all duration-500 ease-out ${
                optionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                  {supportOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                      <div
                        key={option.id}
                        className={`group cursor-pointer transition-all duration-300 ${
                          option.primary ? 'sm:col-span-2' : ''
                        }`}
                        onClick={option.action}
                      >
                        <div
                          className={`relative p-6 rounded-2xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 ${
                            option.primary 
                              ? 'bg-white text-black border-2 border-white group-hover:bg-gray-100' 
                              : 'bg-white/10 text-white border border-white/20 group-hover:bg-white/20 backdrop-blur-md'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${
                              option.primary 
                                ? 'bg-black/10' 
                                : 'bg-white/20'
                            }`}>
                              <Icon className={`w-6 h-6 ${option.primary ? 'text-black' : 'text-white'}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-bold text-lg mb-1 ${
                                option.primary ? 'text-black' : 'text-white'
                              }`}>
                                {option.title}
                              </h3>
                              <p className={`text-sm ${
                                option.primary ? 'text-gray-600' : 'text-gray-300'
                              }`}>
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportPage;