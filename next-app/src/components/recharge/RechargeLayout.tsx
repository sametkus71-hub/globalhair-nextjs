'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { X, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import Image from 'next/image';
import chatIcon from '@/assets/chat-icon.svg';
import { useBookingModal } from '@/contexts/BookingModalContext';

export const RechargeLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const { openModal } = useBookingModal();

  const tabs = [
    { id: 'recharge', label: 'Recharge' },
    { id: 'rescue', label: 'Rescue' },
    { id: 'reborn', label: 'Reborn' },
  ];

  // Base path depends on language
  const basePath = language === 'nl' ? '/nl/v6-hairboost' : '/en/v6-hairboost';

  const searchParams = useSearchParams();
  const fromSource = searchParams.get('from');

  const handleClose = () => {
    if (fromSource === 'treatments') {
      router.push(`/${language}/v6-hairboost` as any);
    } else if (fromSource === 'how') {
      router.push(`/${language}/v6-hairboost/how` as any);
    } else {
      // Default fallback: Treatments page
      router.push(`/${language}/v6-hairboost` as any);
    }
  }

  // Preserve 'from' parameter when switching tabs within the layout
  const handleTabClick = (tabId: string) => {
    // New structure: /v6-hairboost/[method]
    // Default is explicitly /v6-hairboost/recharge or just /v6-hairboost
    const query = fromSource ? `?from=${fromSource}` : '';
    
    if (tabId === 'recharge') {
      router.push(`${basePath}/recharge${query}` as any);
    } else {
      router.push(`${basePath}/${tabId}${query}` as any);
    }
  };

  const activeTabId = pathname?.includes('/rescue')
    ? 'rescue'
    : pathname?.includes('/reborn')
    ? 'reborn'
    : 'recharge';

  return (
    <div id="recharge-layout-backdrop" className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Background Video - Now covering full page behind overlay */}
      <div id="recharge-bg-video-container" className="absolute inset-0 z-0 overflow-hidden">
        {/* Render all 3 videos, control opacity for smooth transition */}
        {[
          { id: 'recharge', src: 'https://GlobalHair.b-cdn.net/Bg%20Videos/V6%20-%20Restore.mp4' },
          { id: 'rescue', src: 'https://GlobalHair.b-cdn.net/Bg%20Videos/v6%20-%20Rescue.mp4' },
          { id: 'reborn', src: 'https://GlobalHair.b-cdn.net/Bg%20Videos/V6%20-%20Reborn.mp4' }
        ].map((video) => {
          const isActive = activeTabId === video.id;
          return (
            <video
              key={video.id}
              autoPlay={isActive}
              loop
              muted
              playsInline
              preload="metadata"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
               style={{ 
                zIndex: isActive ? 1 : 0 
              }}
              ref={(el) => {
                if (el) {
                  if (isActive) {
                    el.play().catch(() => {});
                  } else {
                    el.pause();
                  }
                }
              }}
            >
              <source src={video.src} type="video/mp4" />
            </video>
          );
        })}
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      <div 
        id="recharge-glass-card"
        className="silver-gradient-border relative z-10 w-full max-w-[400px] h-[800px] max-h-[90vh] rounded-[24px] overflow-hidden flex flex-col"
        style={{
          background: '#0000001A', 
          backdropFilter: 'blur(12.5px)',
          boxShadow: `
            inset 0px 4.01px 8.72px 0px #00000040, 
            inset 0px -1px 4.71px 0px #FFFFFF40,
            0px 3.01px 1px 0px #00000040
          `,
        }}
      >
        {/* Close Button */}
        <button
          id="recharge-close-button"
          onClick={handleClose}
          className="absolute top-4 left-6 z-20 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Tab Navigation */}
        <div id="recharge-tab-nav" className="relative mt-12 px-4 flex justify-center z-10 w-full">
          <div 
            className="flex w-full rounded-full p-[2px] backdrop-blur-xl border border-white/10"
            style={{ boxShadow: 'inset 0 1px 5px rgba(0,0,0,0.2)' }}
          >
            {tabs.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`recharge-tab-btn-${tab.id}`}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative flex-1 py-2.5 rounded-full text-[13px] font-normal transition-all duration-500 ${
                    isActive ? 'text-white active-tab-glow' : 'text-white/40 hover:text-white/60'
                  }`}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {isActive && (
                    <>
                      {/* Active Tab Background Glass & Shine */}
                      <div 
                        className="absolute inset-0 rounded-full z-0 overflow-hidden"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)',
                          boxShadow: 'inset 0 1px 0.5px rgba(255,255,255,0.4), 0 2px 10px rgba(0,0,0,0.3)',
                          backdropFilter: 'blur(8px)',
                        }}
                      />
                      
                      {/* Silver Metallic Border */}
                      <div 
                        className="absolute inset-0 rounded-full z-10 pointer-events-none"
                        style={{
                          padding: '1.5px',
                          background: 'linear-gradient(135deg, #949494 0%, #ACB9C1 20%, #FFFFFF 45%, #FFFFFF 55%, #ACB9C1 80%, #949494 100%)',
                          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          maskComposite: 'exclude',
                          WebkitMaskComposite: 'xor',
                          opacity: 0.9
                        }}
                      />
                    </>
                  )}
                  <span className="relative z-20">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative no-scrollbar">
          {children}
        </div>
      </div>

      {/* Footer Actions (Outside Card, Persistent) */}
      <div id="recharge-footer-actions" className="relative z-10 w-full max-w-[400px] mt-4 flex gap-3">
        {/* Book a consult button - reused from FooterCTAGlass */}
        <button
          id="recharge-btn-book"
          onClick={openModal} 
          className={`flex-1 gold-gradient-border cta-button-glow flex items-center rounded-full transition-all duration-200`}
          style={{
            padding: '0.4rem',
            background: 'linear-gradient(90deg, rgba(15, 25, 40, 0.7), rgba(35, 50, 70, 0.8), rgba(50, 65, 85, 0.75), rgba(35, 50, 70, 0.8), rgba(15, 25, 40, 0.7))',
            backgroundSize: '200% 100%',
            animation: 'background-gradient-shift 7s ease-in-out infinite',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40), 0 0 20px rgba(201, 163, 93, 0.35), 0 0 40px rgba(201, 163, 93, 0.15), inset 0 -20px 30px -10px rgba(255, 255, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
            justifyContent: 'center',
            gap: 0,
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.40), 0 0 25px rgba(201, 163, 93, 0.45), 0 0 50px rgba(201, 163, 93, 0.2), inset 0 -20px 30px -10px rgba(255, 255, 255, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.40), 0 0 20px rgba(201, 163, 93, 0.35), 0 0 40px rgba(201, 163, 93, 0.15), inset 0 -20px 30px -10px rgba(255, 255, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.1)';
          }}
        >
          {/* Shine sweep overlay */}
          <span
            className="shine-sweep"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '60%',
              height: '100%',
              background: 'linear-gradient(90deg, rgba(255,250,235,0) 0%, rgba(255,250,235,0.3) 50%, rgba(255,250,235,0) 100%)',
              transform: 'translateX(-100%) skewX(-15deg)',
              animation: 'shine-sweep 4.5s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 300,
              letterSpacing: '0.01em',
              flex: 1,
              textAlign: 'center',
              zIndex: 2,
              color: 'white',
            }}
          >
            {language === 'nl' ? 'Book a consult' : 'Book a consult'}
          </span>

          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 'auto',
            }}
          >
            <div
              className="silver-gradient-border rounded-full flex items-center justify-center"
              style={{
                width: 'clamp(40px, 4.5vh, 46px)',
                height: 'clamp(40px, 4.5vh, 46px)',
                background: 'rgba(255, 255, 255, 0.10)',
              }}
            >
              <ArrowUpRight style={{ width: 'clamp(20px, 2.2vh, 22px)', height: 'clamp(20px, 2.2vh, 22px)' }} className="text-white" strokeWidth={2.5} />
            </div>
          </span>
        </button>

        {/* Chat Button - reused from FooterCTAGlass */}
        <button
          id="recharge-btn-chat"
          onClick={() => router.push(language === 'nl' ? '/nl/chat' : '/en/chat')}
          className="silver-gradient-border rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            width: 'clamp(56px, 6.5vh, 60px)', // Slightly adjusted to match height of the book button roughly
            height: 'auto',
            aspectRatio: '1/1',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.40), 0 0 15px rgba(172, 185, 193, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.40), 0 0 20px rgba(172, 185, 193, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.40), 0 0 15px rgba(172, 185, 193, 0.2)';
          }}
        >
          <Image src={chatIcon} alt="Chat" style={{ width: 'clamp(18px, 2vh, 20px)', height: 'clamp(18px, 2vh, 20px)' }} />
        </button>
      </div>

      <style jsx global>{`
        .active-tab-glow {
          position: relative;
          overflow: hidden;
        }
        
        .active-tab-glow::before,
        .active-tab-glow::after {
          content: "";
          filter: blur(8px);
          pointer-events: none;
          z-index: 15;
          will-change: opacity;
          background: linear-gradient(90deg, #fff0 0%, #bed5ea 50%, #fff0 100%);
          width: 70%;
          height: 16px;
          position: absolute;
          left: 50%;
          transform: translate(-50%);
        }
        
        .active-tab-glow::before {
          top: -3px;
        }
        
        .active-tab-glow::after {
          bottom: 0; 
        }

        @keyframes background-gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes border-shine-rotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes champagne-float {
          0%, 100% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -52%) scale(1.03);
          }
        }

        @keyframes shine-sweep {
          0% {
            transform: translateX(-100%) skewX(-15deg);
            opacity: 0;
          }
          50% {
            opacity: 0.2;
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
            opacity: 0;
          }
        }

        .gold-gradient-border {
          position: relative;
        }

        .gold-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1.3px;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #B8924A 0%,
            #C9A35D 15%,
            #E3C06B 30%,
            #FFFEF7 45%,
            #FFFEF7 50%,
            #FFFEF7 55%,
            #E3C06B 70%,
            #C9A35D 85%,
            #B8924A 100%
          );
          background-size: 400% 100%;
          animation: border-shine-rotate 4.5s ease-in-out infinite;
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .gold-gradient-border > * {
          position: relative;
          z-index: 1;
        }

        .cta-button-glow::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 85%;
          height: 85%;
          border-radius: 50%;
          background: radial-gradient(circle, #FFFEF7 0%, #E8DCC4 50%, transparent 100%);
          filter: blur(25px);
          opacity: 0.45;
          z-index: 1;
          pointer-events: none;
          animation: champagne-float 6s ease-in-out infinite;
        }

        .silver-gradient-border {
          position: relative;
        }

        .silver-gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(90deg, #949494 7%, #ACB9C1 16%, #FFFFFF 34%, #ACB9C1 51%, #4B555E 78%, #fff 105%);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 50;
        }
      `}</style>
    </div>
  );
};
