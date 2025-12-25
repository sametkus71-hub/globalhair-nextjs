'use client';

import { usePathname, useRouter } from 'next/navigation';
import { X, ArrowUpRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const RechargeLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();

  const tabs = [
    { id: 'recharge', label: 'Recharge' },
    { id: 'rescue', label: 'Rescue' },
    { id: 'reborn', label: 'Reborn' },
  ];

  // Base path depends on language
  const basePath = language === 'nl' ? '/nl/recharge' : '/en/recharge';

  const handleTabClick = (tabId: string) => {
    // If it's the default 'recharge' tab, we can go to root layout path or explicitly to /recharge
    // The requirement says: /recharge (active styling), /recharge/rescue, /recharge/reborn
    if (tabId === 'recharge') {
      router.push(basePath as any);
    } else {
      router.push(`${basePath}/${tabId}` as any);
    }
  };

  const activeTabId = pathname?.includes('/rescue')
    ? 'rescue'
    : pathname?.includes('/reborn')
    ? 'reborn'
    : 'recharge';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Background Video - Now covering full page behind overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            key={activeTabId} 
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover animate-in fade-in duration-700 opacity-100"
          >
            <source
              src={
                activeTabId === 'rescue'
                  ? 'https://GlobalHair.b-cdn.net/Bg%20Videos/v6%20-%20Rescue.mp4'
                  : activeTabId === 'reborn'
                  ? 'https://GlobalHair.b-cdn.net/Bg%20Videos/V6%20-%20Reborn.mp4'
                  : 'https://GlobalHair.b-cdn.net/Bg%20Videos/V6%20-%20Restore.mp4' 
              }
              type="video/mp4"
            />
          </video>
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40" />
      </div>

      <div 
        className="silver-gradient-border relative z-10 w-full max-w-[400px] h-[800px] max-h-[90vh] rounded-[32px] overflow-hidden flex flex-col"
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
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-20 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Tab Navigation */}
        <div className="relative mt-20 px-6 flex justify-center z-10 w-full">
          <div className="flex w-full bg-white/5 rounded-full p-1 backdrop-blur-md border border-white/10">
            {tabs.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex-1 py-3 rounded-full text-[13px] font-light transition-all duration-300 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </div>

      {/* Footer Actions (Outside Card, Persistent) */}
      <div className="relative z-10 w-full max-w-[400px] mt-4 flex gap-3">
        {/* Book a consult button - reused from FooterCTAGlass */}
        <button
          onClick={() => router.push(language === 'nl' ? '/nl/boek' : '/en/book')} // Or openModal if available
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
          <MessageCircle size={24} className="text-white" />
        </button>
      </div>

      <style jsx global>{`

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
