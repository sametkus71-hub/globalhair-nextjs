import { useState } from 'react';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import shieldIcon from '@/assets/shield-icon.svg';
import v6HairboostIcon from '@/assets/v6-hairboost.png';
import chatIcon from '@/assets/chat-icon.svg';
import whatsappIcon from '@/assets/whatsapp-icon-new.svg';
import instagramIcon from '@/assets/instagram-icon-new.svg';

export const ContactTabContent = () => {
  const [activeTab, setActiveTab] = useState<'nl' | 'tr'>('nl');
  const { height } = useViewportHeight();

  return (
    <div 
      className="h-full w-full flex flex-col"
      style={{
        height: `${height}px`,
        minHeight: '100svh',
      }}
    >
      {/* Tabs Section */}
      <div 
        className="flex justify-center items-center gap-8 px-4"
        style={{
          paddingTop: '12px',
          paddingBottom: '12px',
        }}
      >
        <button
          onClick={() => setActiveTab('nl')}
          className="relative text-white transition-all duration-300"
          style={{
            fontSize: 'clamp(14px, 3vw, 18px)',
            fontWeight: activeTab === 'nl' ? 500 : 300,
            opacity: activeTab === 'nl' ? 1 : 0.5,
            textDecoration: activeTab === 'nl' ? 'underline' : 'none',
            textUnderlineOffset: '4px',
            textDecorationThickness: '2px',
          }}
        >
          Nederland
        </button>
        <button
          onClick={() => setActiveTab('tr')}
          className="relative text-white transition-all duration-300"
          style={{
            fontSize: 'clamp(14px, 3vw, 18px)',
            fontWeight: activeTab === 'tr' ? 500 : 300,
            opacity: activeTab === 'tr' ? 1 : 0.5,
            textDecoration: activeTab === 'tr' ? 'underline' : 'none',
            textUnderlineOffset: '4px',
            textDecorationThickness: '2px',
          }}
        >
          Turkije
        </button>
      </div>

      {/* Content Area - Flex Grow */}
      <div className="flex-1 flex flex-col px-2" style={{ minHeight: 0 }}>
        {/* Darker Blue Container */}
        <div 
          className="flex-1 rounded-3xl overflow-hidden flex flex-col"
          style={{
            background: 'rgba(10, 30, 50, 0.6)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Content based on active tab */}
          <div className="flex-1 flex flex-col justify-center p-6">
            {activeTab === 'nl' ? (
              <div className="flex flex-col h-full">
                {/* Locations */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Barendrecht */}
                  <div className="text-center">
                    <div className="flex gap-2 justify-center items-center mb-2">
                      <img src={shieldIcon} alt="Shield" className="w-4 h-4 opacity-95" />
                      <img src={v6HairboostIcon} alt="V6 Hairboost" className="w-6 h-6" />
                    </div>
                    <h2 className="text-white font-normal mb-1" style={{ fontSize: 'clamp(14px, 3vw, 18px)' }}>
                      Barendrecht
                    </h2>
                    <p className="text-white text-xs opacity-90 mb-2">
                      Pesetastraat 72, 2991 XT
                    </p>
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        fontSize: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      Hoofdvestiging
                    </span>
                  </div>

                  {/* Leiden */}
                  <div className="text-center">
                    <div className="flex gap-2 justify-center items-center mb-2">
                      <img src={v6HairboostIcon} alt="V6 Hairboost" className="w-6 h-6" />
                    </div>
                    <h2 className="text-white font-normal mb-1" style={{ fontSize: 'clamp(14px, 3vw, 18px)' }}>
                      Leiden
                    </h2>
                    <p className="text-white text-xs opacity-90">
                      Fruitweg 22, 2321 GK
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div 
                  className="flex justify-between items-center px-8 py-4 mt-auto"
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                  }}
                >
                  <span className="text-white text-xs opacity-90">Ma – Za 10:00 – 19:00</span>
                  <a href="mailto:info@globalhair.nl" className="text-white text-xs opacity-90 no-underline hover:opacity-100">
                    info@globalhair.nl
                  </a>
                  <a href="tel:+31696969696" className="text-white text-xs opacity-90 no-underline hover:opacity-100">
                    +31 6 96969696
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Istanbul Location */}
                <div className="flex justify-center mb-8">
                  <div className="text-center">
                    <div className="flex gap-2 justify-center items-center mb-2">
                      <img src={shieldIcon} alt="Shield" className="w-4 h-4 opacity-95" />
                    </div>
                    <h2 className="text-white font-normal mb-1" style={{ fontSize: 'clamp(14px, 3vw, 18px)' }}>
                      İstanbul
                    </h2>
                    <p className="text-white text-xs opacity-90">
                      Kaynarca, Erol Kaya Cd No:204,<br />
                      34890 Pendik
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div 
                  className="flex justify-between items-center px-8 py-4 mt-auto"
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                  }}
                >
                  <span className="text-white text-xs opacity-90">Ma – Za 10:00 – 19:00</span>
                  <a href="mailto:info@globalhair.nl" className="text-white text-xs opacity-90 no-underline hover:opacity-100">
                    info@globalhair.nl
                  </a>
                  <a href="tel:+31696969696" className="text-white text-xs opacity-90 no-underline hover:opacity-100">
                    +31 6 96969696
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer with Socials */}
          <footer 
            className="flex items-center justify-center gap-4 py-4"
            style={{
              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.03) 100%)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              aria-label="Chat"
            >
              <img src={chatIcon} alt="Chat" className="w-5 h-5" />
            </button>
            <a 
              href="https://wa.me/31696969696"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              aria-label="WhatsApp"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="w-5 h-5" />
            </a>
            <a 
              href="https://instagram.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              aria-label="Instagram"
            >
              <img src={instagramIcon} alt="Instagram" className="w-5 h-5" />
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
};