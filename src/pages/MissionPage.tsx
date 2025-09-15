import React, { useState, useEffect, useRef } from 'react';
import { MetaHead } from '@/components/MetaHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PopupCloseButton, usePopupClose } from '@/components/PopupCloseButton';
import { MissionContent } from '@/components/mission/MissionContent';
import { BottomNavigationPortal } from '@/components/haartransplantatie/BottomNavigationPortal';
import { getBerkantVideoById } from '@/data/berkantVideos';
const MissionPage: React.FC = () => {
  const {
    language
  } = useLanguage();
  const {
    t
  } = useTranslation(language);
  const navigate = useNavigate();
  const {
    handlePopupClose
  } = usePopupClose();
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  // Get video from URL parameters
  const videoId = searchParams.get('video');
  const berkantVideo = videoId ? getBerkantVideoById(videoId) : null;
  const handleClose = () => {
    setIsExiting(true);
    // Navigate back to reviews page instead of using popup close
    const reviewsPath = language === 'nl' ? '/nl/reviews' : '/en/reviews';
    setTimeout(() => {
      navigate(reviewsPath);
    }, 350);
  };
  const handleMethodsClick = () => {
    // Store current path for back navigation
    sessionStorage.setItem('previousPath', window.location.pathname);
    const methodPath = language === 'nl' ? '/nl/info/methode' : '/en/info/method';
    navigate(methodPath);
  };

  // Handle video loading and staggered entrance animations
  useEffect(() => {
    const timer1 = setTimeout(() => setTitleVisible(true), 100);
    const timer2 = setTimeout(() => setContentVisible(true), 300);
    const timer3 = setTimeout(() => setButtonVisible(true), 500);

    // Auto-play video if available
    if (berkantVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Ignore autoplay failures
      });
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [berkantVideo]);
  return <>
      <MetaHead title={t('mission.page.title')} description={t('mission.page.description')} language={language} />
      
      <style dangerouslySetInnerHTML={{
        __html: `
        @property --gradient-opacity {
          syntax: "<number>";
          initial-value: 1;
          inherits: false;
        }

        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-angle-offset {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-percent {
          syntax: "<percentage>";
          initial-value: 5%;
          inherits: false;
        }

        @property --gradient-shine {
          syntax: "<color>";
          initial-value: white;
          inherits: false;
        }

        .shiny-cta {
          --shiny-cta-bg: rgba(255, 255, 255, 0.15);
          --shiny-cta-bg-subtle: rgba(240, 240, 240, 0.1);
          --shiny-cta-fg: #ffffff;
          --shiny-cta-highlight: #ffffff;
          --shiny-cta-highlight-subtle: #ffffff;
          --animation: gradient-angle linear infinite;
          --duration: 6s;
          --shadow-size: 2px;
          --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);
          
          isolation: isolate;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          outline-offset: 4px;
          padding: 0.75rem 3rem;
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 0.75rem;
          line-height: 1.2;
          font-weight: 400;
          letter-spacing: 0.025em;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 360px;
          color: var(--shiny-cta-fg);
          background: linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
            conic-gradient(
              from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
              transparent,
              color-mix(in srgb, var(--shiny-cta-highlight) calc(var(--gradient-opacity) * 20%), transparent) var(--gradient-percent),
              color-mix(in srgb, var(--gradient-shine) calc(var(--gradient-opacity) * 30%), transparent) calc(var(--gradient-percent) * 2),
              color-mix(in srgb, var(--shiny-cta-highlight) calc(var(--gradient-opacity) * 20%), transparent) calc(var(--gradient-percent) * 3),
              transparent calc(var(--gradient-percent) * 4)
            ) border-box;
          box-shadow: inset 0 0 0 1px var(--shiny-cta-bg-subtle);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: var(--transition);
          transition-property: --gradient-angle-offset, --gradient-percent, --gradient-shine;
        }

        .shiny-cta::before,
        .shiny-cta::after,
        .shiny-cta span::before {
          content: "";
          pointer-events: none;
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 50%;
          translate: -50% -50%;
          z-index: -1;
        }

        .shiny-cta:active {
          translate: 0 1px;
        }

        .shiny-cta::before {
          --size: calc(100% - var(--shadow-size) * 3);
          --position: 2px;
          --space: calc(var(--position) * 2);
          width: var(--size);
          height: var(--size);
          background: radial-gradient(
            circle at var(--position) var(--position),
            white calc(var(--position) / 4),
            transparent 0
          ) padding-box;
          background-size: var(--space) var(--space);
          background-repeat: space;
          mask-image: conic-gradient(
            from calc(var(--gradient-angle) + 45deg),
            black,
            transparent 10% 90%,
            black
          );
          border-radius: inherit;
          opacity: 0.4;
          z-index: -1;
        }

        .shiny-cta::after {
          --animation: shimmer linear infinite;
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(
            -50deg,
            transparent,
            var(--shiny-cta-highlight),
            transparent
          );
          mask-image: radial-gradient(circle at bottom, transparent 40%, black);
          opacity: 0.6;
        }

        .shiny-cta span {
          z-index: 1;
        }

        .shiny-cta span::before {
          --size: calc(100% + 1rem);
          width: var(--size);
          height: var(--size);
          box-shadow: inset 0 -1ex 2rem 4px var(--shiny-cta-highlight);
          opacity: 0;
          transition: opacity var(--transition);
          animation: calc(var(--duration) * 1.5) breathe linear infinite;
        }

        .shiny-cta,
        .shiny-cta::before,
        .shiny-cta::after {
          animation: var(--animation) var(--duration),
            var(--animation) calc(var(--duration) / 0.4) reverse paused;
          animation-composition: add;
        }

        .shiny-cta:is(:hover, :focus-visible) {
          --gradient-percent: 20%;
          --gradient-angle-offset: 95deg;
          --gradient-shine: var(--shiny-cta-highlight-subtle);
        }

        .shiny-cta:is(:hover, :focus-visible),
        .shiny-cta:is(:hover, :focus-visible)::before,
        .shiny-cta:is(:hover, :focus-visible)::after {
          animation-play-state: running;
        }

        .shiny-cta:is(:hover, :focus-visible) span::before {
          opacity: 1;
        }

        @keyframes gradient-angle {
          0% {
            --gradient-angle: 0deg;
            --gradient-opacity: 0.1;
          }
          25% {
            --gradient-angle: 90deg;
            --gradient-opacity: 0.05;
          }
          50% {
            --gradient-angle: 180deg;
            --gradient-opacity: 0.02;
          }
          75% {
            --gradient-angle: 270deg;
            --gradient-opacity: 0.05;
          }
          100% {
            --gradient-angle: 360deg;
            --gradient-opacity: 0.1;
          }
        }

        @keyframes shimmer {
          to {
            rotate: 360deg;
          }
        }

        @keyframes breathe {
          from, to {
            scale: 1;
          }
          50% {
            scale: 1.2;
          }
        }
        `
      }} />
      
      <div className={`fixed inset-0 w-full h-full overflow-hidden ${isExiting ? 'reviews-page-exit' : ''}`}>
        {berkantVideo ?
      // Berkant Video Background
      <video ref={videoRef} src={berkantVideo.unsubbedUrl} autoPlay loop muted={false} playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" /> :
      // Fallback background
      <div className="absolute inset-0 w-full h-full bg-gray-900"></div>}
        
        {/* Gradient overlay for video quality */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/10 via-black/20 to-black/40"></div>
        
        {/* Close button */}
        <PopupCloseButton onClose={handleClose} />
        
        {/* Content overlay - split into top and bottom containers */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between px-6 py-8 pb-32">
          {/* Top container - Title */}
          <div className={`pt-6 text-center transition-all duration-500 ease-out ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[0.85] tracking-wide">
              BERKANT
            </h1>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[0.85] tracking-wide font-medium">
              DURAL
            </h1>
          </div>

          {/* Bottom container - Description and Button */}
          <div className="space-y-6">
            <div className={`max-w-md transition-all duration-500 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-xs leading-snug font-light text-left text-white/90">
                {language === 'nl' ? 'Founder & Medisch Directeur, Berkant Dural, zag al op jonge leeftijd wat erfelijk haarverlies met zijn vader deed en hij was ervan overtuigd dat dit voorkomen kon worden. Na jaren onderzoek en samenwerkingen met Tricho artsen ontwikkelde hij een werkwijze niet alleen voor zijn.' : 'Founder & Medical Director, Berkant Dural, saw at a young age what hereditary hair loss did to his father and he was convinced that this could be prevented. After years of research and collaborations with Tricho doctors, he developed a method not only for his own hair.'}
              </p>
            </div>

            {/* Bottom Button */}
            <div className={`transition-all duration-500 ease-out ${buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button 
                onClick={handleMethodsClick} 
                className="shiny-cta"
              >
                <span>{language === 'nl' ? 'Bekijk methodes' : 'View methods'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigationPortal />
    </>;
};
export default MissionPage;