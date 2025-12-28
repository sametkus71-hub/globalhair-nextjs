'use client';

import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

interface AnimatedHeadHeroProps {
  inHeader?: boolean;
  inFooter?: boolean;
}

export const AnimatedHeadHero = ({ inHeader = false, inFooter = false }: AnimatedHeadHeroProps) => {
  const { language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

  const handleAnalyzeClick = () => {
    window.open('http://scan.globalhair.institute/', '_blank');
  };

  return (
    <div
      className="relative flex items-start"
      style={{
        paddingLeft: (inHeader || inFooter) ? '0' : 'clamp(0.75rem, 1vw, 1rem)',
        animation: (inHeader || inFooter) ? 'none' : 'fade-up 0.8s ease-out 0.4s both',
      }}
    >
      {/* Primary CTA - Analyze my hair */}
      <button
        onClick={handleAnalyzeClick}
        className="animated-border-shine cursor-pointer group z-10 relative rounded-full flex items-center gap-2 transition-all duration-300"
        style={{
          padding: inFooter ? '0.4rem' : 'clamp(0.15rem, 0.3vh, 0.25rem) clamp(0.2rem, 0.3vw, 0.35rem) clamp(0.15rem, 0.3vh, 0.25rem) clamp(1.8rem, 1.4vw, 1.6rem)',
          width: inFooter ? '250px' : undefined,
          justifyContent: inFooter ? 'center' : undefined,
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 3.29px 3.29px 0px #00000040, 0px 3.29px 7.15px 0px #00000040 inset, 0px -0.82px 3.86px 0px #FFFFFF40 inset',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
        }}
      >
        <span
          className="text-white whitespace-nowrap"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: inFooter ? undefined : 'clamp(0.875rem, 1.4vh, 1rem)',
            fontWeight: '300',
            letterSpacing: inFooter ? '0.01em' : undefined,
            paddingRight: inFooter ? '0' : '.75rem',
            flex: inFooter ? 1 : undefined,
            textAlign: inFooter ? 'center' : undefined,
          }}
        >
          AI Hairscan
        </span>
        <div
          className="silver-gradient-border cta-button-glow flex items-center justify-center rounded-full"
          style={{
            width: 'clamp(35px, 5vh, 45px)',
            height: 'clamp(35px, 5vh, 45px)',
            marginLeft: inFooter ? 'auto' : 'clamp(0.5rem, 0.7vw, 0.65rem)',
          }}
        >
          <img
            src="/assets/camera-icon.svg"
            alt="Camera"
            width={24}
            height={20}
            style={{ width: 'clamp(19px, 2.4vh, 24px)', height: 'clamp(17px, 2.2vh, 20px)', marginTop: '-2px', marginRight: '-2px' }}
          />
        </div>
      </button>

      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .animated-border-shine {
          position: relative;
        }

        .animated-border-shine::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #7a7a7a 0%,
            #8a8a8a 15%,
            #a5a5a5 30%,
            #d5d5d5 45%,
            #f0f0f0 50%,
            #d5d5d5 55%,
            #a5a5a5 70%,
            #8a8a8a 85%,
            #7a7a7a 100%
          );
          background-size: 300% 100%;
          animation: border-shine-rotate 6s ease-in-out infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        .animated-border-shine > * {
          position: relative;
          z-index: 3;
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
          z-index: 0;
        }

        .silver-gradient-border > * {
          position: relative;
          z-index: 1;
        }

        .cta-button-glow::after {
          content: "";
          position: absolute;
          top: 80%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 80%;
          border-radius: 50%;
          background: #7990A5;
          filter: blur(20px);
          opacity: 1;
          z-index: 1;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};
