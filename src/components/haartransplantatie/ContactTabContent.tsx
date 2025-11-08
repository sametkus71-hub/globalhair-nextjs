import { useState } from 'react';
import shieldIcon from '@/assets/shield-icon.svg';
import v6HairboostIcon from '@/assets/v6-hairboost.png';
import chatIcon from '@/assets/chat-icon.svg';
import whatsappIcon from '@/assets/whatsapp-icon-new.svg';
import instagramIcon from '@/assets/instagram-icon-new.svg';

export const ContactTabContent = () => {
  const [activeTab, setActiveTab] = useState<'nl' | 'tr'>('nl');

  return (
    <div className="h-full w-full flex flex-col">
      {/* Tabs Section */}
      <div className="w-full flex justify-center px-4" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
        <div 
          className="relative flex items-center justify-center gap-1 rounded-full"
          style={{
            background: '#FFFFFF0D',
            backdropFilter: 'blur(20px)',
            border: '1px solid #FFFFFF12',
            borderRadius: '9999px',
            padding: '3px',
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setActiveTab('nl')}
            className={`relative rounded-full font-light transition-all duration-300 ease-out ${
              activeTab === 'nl'
                ? 'silver-gradient-border scale-105'
                : 'bg-transparent hover:opacity-80 scale-100'
            }`}
            style={{
              padding: 'clamp(0.2rem, 0.5vh, 0.35rem) clamp(1rem, 2.5vw, 1.5rem)',
              fontSize: 'clamp(0.7rem, 1.3vh, 0.8rem)',
              backgroundColor: activeTab === 'nl' ? 'rgba(24, 47, 60, 0.3)' : 'transparent',
              backgroundImage: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Nederland
          </button>
          <button
            onClick={() => setActiveTab('tr')}
            className={`relative rounded-full font-light transition-all duration-300 ease-out ${
              activeTab === 'tr'
                ? 'silver-gradient-border scale-105'
                : 'bg-transparent hover:opacity-80 scale-100'
            }`}
            style={{
              padding: 'clamp(0.2rem, 0.5vh, 0.35rem) clamp(1rem, 2.5vw, 1.5rem)',
              fontSize: 'clamp(0.7rem, 1.3vh, 0.8rem)',
              backgroundColor: activeTab === 'tr' ? 'rgba(24, 47, 60, 0.3)' : 'transparent',
              backgroundImage: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Turkije
          </button>
        </div>
      </div>

      {/* Middle Content Area - Flex Grow with Centered Inner Box */}
      <div className="flex-1 px-2 flex items-center justify-center" style={{ minHeight: 0 }}>
        <div 
          className="w-full rounded-3xl p-6 silver-gradient-border"
          style={{
            background: 'rgba(10, 30, 50, 0.6)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {/* Content based on active tab */}
          {activeTab === 'nl' ? (
            <div className="flex flex-col gap-8 mx-auto" style={{ width: '220px' }}>
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
          ) : (
            <div className="flex justify-center mx-auto" style={{ width: '220px' }}>
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
          )}
        </div>
      </div>

      {/* Footer Row - Fixed at Bottom */}
      <footer 
        className="flex flex-col gap-3 px-2"
        style={{
          padding: '16px 8px',
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.03) 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Contact Info Row */}
        <div className="flex justify-between items-center px-4">
          <span className="text-white text-xs opacity-90">Ma – Za 10:00 – 19:00</span>
          <a href="mailto:info@globalhair.nl" className="text-white text-xs opacity-90 no-underline hover:opacity-100">
            info@globalhair.nl
          </a>
          <a href="tel:+31696969696" className="text-white text-xs opacity-90 no-underline hover:opacity-100">
            +31 6 96969696
          </a>
        </div>
        
        {/* Social Icons Row */}
        <div className="flex items-center justify-center gap-4">
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
        </div>
      </footer>

      <style>{`
        .silver-gradient-border {
          position: relative;
        }

        .silver-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(80deg, #949494 7%, #838e94 16%, #b5b5b5 34%, #ACB9C1 51%, #4e5964 78%, #727272 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .silver-gradient-border > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};