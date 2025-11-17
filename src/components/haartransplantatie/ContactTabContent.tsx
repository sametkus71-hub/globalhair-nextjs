import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shieldIcon from '@/assets/shield-icon.svg';
import v6HairboostIcon from '@/assets/v6-hairboost.png';
import chatIcon from '@/assets/chat-icon.svg';
import whatsappIcon from '@/assets/whatsapp-icon-new.svg';
import instagramIcon from '@/assets/instagram-icon-new.svg';

export const ContactTabContent = () => {
  const navigate = useNavigate();
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
      <div className="flex-1 w-full px-2 flex items-center justify-center mx-auto lg:max-w-[600px]" style={{ minHeight: 0 }}>
        <div 
          className="w-[80%] lg:w-full rounded-2xl silver-gradient-border lg:max-w-[900px] px-4 py-3 lg:py-8"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {/* Content based on active tab */}
          {activeTab === 'nl' ? (
            <div className="flex flex-col lg:flex-row mx-auto justify-center items-center lg:items-start lg:gap-20" style={{ gap: 'clamp(1rem, 2vh, 2rem)' }}>
              {/* Barendrecht */}
              <div className="text-center w-full lg:w-[280px]">
                <div className="flex gap-1 justify-center items-center mb-2 lg:-mb-1">
                  <img src={shieldIcon} alt="Shield" className="w-5 h-5 lg:w-6 lg:h-6" style={{ filter: 'brightness(0) invert(1)' }} />
                  <img src={v6HairboostIcon} alt="V6 Hairboost" className="w-7 h-7 lg:w-8 lg:h-8" style={{ filter: 'brightness(0) invert(1)' }} />
                </div>
                <h2 className="text-white text-lg mb-1 lg:text-3xl" style={{ fontFamily: 'Inter', fontWeight: 400, lineHeight: '83%', letterSpacing: '-4%', textAlign: 'center' }}>
                  Barendrecht
                </h2>
                <p className="text-white opacity-90 mb-2 lg:text-base lg:mb-0" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(10px, 1.8vh, 12px)', fontWeight: 300 }}>
                  Pesetastraat 72, 2991 XT
                </p>
                <span 
                  className="inline-block px-3 py-1 rounded-full text-white"
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    fontSize: '12.32px',
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    lineHeight: '83%',
                    letterSpacing: '-4%',
                    textAlign: 'center',
                    border: '0.38px solid transparent',
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12)), linear-gradient(269.87deg, #4B555E 3.18%, #ACB9C1 51.79%, #FFFFFF 76.09%, #ACB9C1 88.24%, #4B555E 100.39%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    backdropFilter: 'blur(13.1px)',
                    WebkitBackdropFilter: 'blur(13.1px)',
                    boxShadow: '0px -0.77px 3.62px 0px rgba(255, 255, 255, 0.25) inset',
                  }}
                >
                  Hoofdvestiging
                </span>
              </div>

              {/* Leiden */}
              <div className="text-center w-full lg:w-[280px]">
                <div className="flex gap-1 justify-center items-center mb-2">
                  <img src={v6HairboostIcon} alt="V6 Hairboost" className="w-7 h-7 lg:w-8 lg:h-8" style={{ filter: 'brightness(0) invert(1)' }} />
                </div>
                <h2 className="text-white text-lg mb-1 lg:text-3xl" style={{ fontFamily: 'Inter', fontWeight: 400, lineHeight: '83%', letterSpacing: '-4%', textAlign: 'center' }}>
                  Leiden
                </h2>
                <p className="text-white opacity-90 lg:text-base" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(10px, 1.8vh, 12px)', fontWeight: 300 }}>
                  Fruitweg 22, 2321 GK
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mx-auto w-full lg:w-[280px]">
              <div className="text-center">
                <div className="flex gap-1 justify-center items-center mb-2">
                  <img src={shieldIcon} alt="Shield" className="w-5 h-5 lg:w-6 lg:h-6" style={{ filter: 'brightness(0) invert(1)' }} />
                </div>
                <h2 className="text-white text-lg mb-1 lg:text-3xl" style={{ fontFamily: 'Inter', fontWeight: 400, lineHeight: '83%', letterSpacing: '-4%', textAlign: 'center' }}>
                  İstanbul
                </h2>
                <p className="text-white opacity-90 lg:text-base" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(10px, 1.8vh, 12px)', fontWeight: 300 }}>
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
        className="flex flex-col gap-5 px-2"
        style={{
          padding: '16px 8px',
        }}
      >
        {/* Separator Line */}
        <div className="w-full lg:max-w-[450px] lg:mx-auto">
          <div 
            style={{
              width: '100%',
              height: '1px',
              background: 'rgba(255, 255, 255, 0.08)',
            }}
          />
        </div>
        
        {/* Contact Info Row */}
        <div className="w-full lg:max-w-[450px] lg:mx-auto">
          <div className="flex items-center">
            <span className="flex-1 text-left text-white" style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '11px', lineHeight: '120%', letterSpacing: '-4%', opacity: 0.9 }}>
              Ma – Za 10:00 – 19:00
            </span>
            <a href="mailto:info@globalhair.nl" className="flex-1 text-center text-white no-underline hover:opacity-100 transition-opacity" style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '11px', lineHeight: '120%', letterSpacing: '-4%', opacity: 0.9 }}>
              info@globalhair.nl
            </a>
            <a href="tel:0857500577" className="flex-1 text-right text-white no-underline hover:opacity-100 transition-opacity" style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '11px', lineHeight: '120%', letterSpacing: '-4%', opacity: 0.9 }}>
              085 750 0577
            </a>
          </div>
        </div>
        
        {/* Social Icons Row */}
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={() => navigate('/nl/chat')}
            className="transition-all duration-200 hover:scale-105 cursor-pointer"
            aria-label="Chat"
          >
            <img src={chatIcon} alt="Chat" className="w-6 h-6" />
          </button>
          <a 
            href="https://wa.me/31857500577"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-200 hover:scale-105"
            aria-label="WhatsApp"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="w-10 h-10" />
          </a>
          <a 
            href="https://www.instagram.com/globalhair.institute/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-200 hover:scale-105"
            aria-label="Instagram"
          >
            <img src={instagramIcon} alt="Instagram" className="w-6 h-6" />
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
          padding: 2px;
          border-radius: inherit;
          background: linear-gradient(269.87deg, #4B555E 3.18%, #ACB9C1 51.79%, #FFFFFF 76.09%, #ACB9C1 88.24%, #4B555E 100.39%);
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