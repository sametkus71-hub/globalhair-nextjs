'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { ConsultationModal } from './ConsultationModal';
import { ChatOverlay } from './ChatOverlay';
import { useScrollContext } from '@/contexts/ScrollContext';

export const FloatingActionPortal: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [chatOverlayOpen, setChatOverlayOpen] = useState(false);
  const [isUserActive, setIsUserActive] = useState(true);
  const { language } = useLanguage();
  const pathname = usePathname();
  const activityTimeout = useRef<NodeJS.Timeout>();

  // Try to get scroll context, but handle case where it's not available
  let scrollContext;
  try {
    scrollContext = useScrollContext();
  } catch {
    scrollContext = null;
  }

  // Activity detection with debouncing
  const resetActivityTimeout = useCallback(() => {
    setIsUserActive(true);

    if (activityTimeout.current) {
      clearTimeout(activityTimeout.current);
    }

    activityTimeout.current = setTimeout(() => {
      setIsUserActive(false);
    }, 3500);
  }, []);

  // Throttled activity handler to reduce excessive calls
  const throttledActivityHandler = useRef<NodeJS.Timeout>();
  const handleUserActivity = useCallback(() => {
    if (throttledActivityHandler.current) return;

    throttledActivityHandler.current = setTimeout(() => {
      resetActivityTimeout();
      throttledActivityHandler.current = undefined;
    }, 100); // Throttle to max 10 calls per second
  }, [resetActivityTimeout]);

  useEffect(() => {
    setMounted(true);
    resetActivityTimeout();

    // Reduced activity event listeners for better performance
    const events = ['mousemove', 'scroll'];

    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      setMounted(false);

      if (activityTimeout.current) {
        clearTimeout(activityTimeout.current);
      }

      if (throttledActivityHandler.current) {
        clearTimeout(throttledActivityHandler.current);
      }

      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [handleUserActivity, resetActivityTimeout]);

  const scrollToNextSection = useCallback(() => {
    if (pathname.includes('/haartransplantatie')) {
      const sections = document.querySelectorAll('.snap-section');
      const totalSections = sections.length;

      let currentSectionIndex = 0;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollTop;

        if (scrollTop >= sectionTop - windowHeight / 2) {
          currentSectionIndex = index;
        }
      });

      if (currentSectionIndex >= totalSections - 1) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const nextSection = sections[currentSectionIndex + 1] as HTMLElement;
      if (nextSection) {
        nextSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      return;
    }

    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }, [pathname]);


  const isBookingPage = pathname?.includes('/boek') || pathname?.includes('/book');

  if (!mounted || isBookingPage) return null;

  const content = (
    <>
      {/* Floating Action Buttons */}
      <div
        className="fixed bottom-24 right-4 z-[9999] flex flex-col gap-2 sm:bottom-28 sm:right-6 transition-opacity duration-500 ease-in-out"
        style={{
          opacity: isUserActive ? 1 : 0.3
        }}
      >
        {/* Plan Consultation Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 ease-out flex items-center justify-center group relative overflow-hidden"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%),
                radial-gradient(circle at 70% 70%, rgba(0, 0, 0, 0.05) 0%, transparent 50%),
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.25) 0%, 
                  rgba(255, 255, 255, 0.08) 25%,
                  rgba(255, 255, 255, 0.15) 50%,
                  rgba(255, 255, 255, 0.05) 75%,
                  rgba(255, 255, 255, 0.2) 100%
                )
              `,
              backdropFilter: 'blur(60px) saturate(180%) brightness(1.2) contrast(1.1)',
              WebkitBackdropFilter: 'blur(60px) saturate(180%) brightness(1.2) contrast(1.1)',
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.1),
                0 1px 0px rgba(255, 255, 255, 0.9) inset,
                0 -1px 0px rgba(0, 0, 0, 0.1) inset,
                0 0 0 1px rgba(255, 255, 255, 0.3),
                0 0 20px rgba(255, 255, 255, 0.2)
              `,
              border: 'none',
              transform: 'translateZ(0)',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateZ(0)';
              e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))';
              e.currentTarget.style.boxShadow = `
                0 12px 40px rgba(0, 0, 0, 0.15),
                0 2px 0px rgba(255, 255, 255, 1) inset,
                0 -2px 0px rgba(0, 0, 0, 0.15) inset,
                0 0 0 1px rgba(255, 255, 255, 0.4),
                0 0 30px rgba(255, 255, 255, 0.3)
              `;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateZ(0)';
              e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))';
              e.currentTarget.style.boxShadow = `
                0 8px 32px rgba(0, 0, 0, 0.1),
                0 1px 0px rgba(255, 255, 255, 0.9) inset,
                0 -1px 0px rgba(0, 0, 0, 0.1) inset,
                0 0 0 1px rgba(255, 255, 255, 0.3),
                0 0 20px rgba(255, 255, 255, 0.2)
              `;
            }}
            onClick={() => setConsultModalOpen(true)}
            aria-label={language === 'nl' ? 'Plan Consult' : 'Plan Consultation'}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(ellipse 100% 60% at 20% 20%, rgba(255, 255, 255, 0.6) 0%, transparent 60%),
                  radial-gradient(ellipse 80% 40% at 80% 80%, rgba(0, 0, 0, 0.1) 0%, transparent 60%)
                `,
                pointerEvents: 'none',
              }}
            />
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 group-hover:text-gray-900 transition-colors relative z-10 drop-shadow-sm" />
          </button>
          <span className="text-[9px] font-medium text-gray-800 text-center">
            {language === 'nl' ? 'Consult' : 'Consult'}
          </span>
        </div>

        {/* Chat Support Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 ease-out flex items-center justify-center group relative overflow-hidden"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%),
                radial-gradient(circle at 70% 70%, rgba(0, 0, 0, 0.05) 0%, transparent 50%),
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.25) 0%, 
                  rgba(255, 255, 255, 0.08) 25%,
                  rgba(255, 255, 255, 0.15) 50%,
                  rgba(255, 255, 255, 0.05) 75%,
                  rgba(255, 255, 255, 0.2) 100%
                )
              `,
              backdropFilter: 'blur(60px) saturate(180%) brightness(1.2) contrast(1.1)',
              WebkitBackdropFilter: 'blur(60px) saturate(180%) brightness(1.2) contrast(1.1)',
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.1),
                0 1px 0px rgba(255, 255, 255, 0.9) inset,
                0 -1px 0px rgba(0, 0, 0, 0.1) inset,
                0 0 0 1px rgba(255, 255, 255, 0.3),
                0 0 20px rgba(255, 255, 255, 0.2)
              `,
              border: 'none',
              transform: 'translateZ(0)',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateZ(0)';
              e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))';
              e.currentTarget.style.boxShadow = `
                0 12px 40px rgba(0, 0, 0, 0.15),
                0 2px 0px rgba(255, 255, 255, 1) inset,
                0 -2px 0px rgba(0, 0, 0, 0.15) inset,
                0 0 0 1px rgba(255, 255, 255, 0.4),
                0 0 30px rgba(255, 255, 255, 0.3)
              `;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateZ(0)';
              e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))';
              e.currentTarget.style.boxShadow = `
                0 8px 32px rgba(0, 0, 0, 0.1),
                0 1px 0px rgba(255, 255, 255, 0.9) inset,
                0 -1px 0px rgba(0, 0, 0, 0.1) inset,
                0 0 0 1px rgba(255, 255, 255, 0.3),
                0 0 20px rgba(255, 255, 255, 0.2)
              `;
            }}
            onClick={() => setChatOverlayOpen(true)}
            aria-label={language === 'nl' ? 'Chat Support' : 'Chat Support'}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(ellipse 100% 60% at 20% 20%, rgba(255, 255, 255, 0.6) 0%, transparent 60%),
                  radial-gradient(ellipse 80% 40% at 80% 80%, rgba(0, 0, 0, 0.1) 0%, transparent 60%)
                `,
                pointerEvents: 'none',
              }}
            />
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 group-hover:text-gray-900 transition-colors relative z-10 drop-shadow-sm" />
          </button>
          <span className="text-[9px] font-medium text-gray-800 text-center">
            {language === 'nl' ? 'Chat' : 'Chat'}
          </span>
        </div>

        {/* Scroll Navigation Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 ease-out flex items-center justify-center group relative overflow-hidden"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%),
                radial-gradient(circle at 70% 70%, rgba(0, 0, 0, 0.05) 0%, transparent 50%),
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.25) 0%, 
                  rgba(255, 255, 255, 0.08) 25%,
                  rgba(255, 255, 255, 0.15) 50%,
                  rgba(255, 255, 255, 0.05) 75%,
                  rgba(255, 255, 255, 0.2) 100%
                )
              `,
              backdropFilter: 'blur(60px) saturate(180%) brightness(1.2) contrast(1.1)',
              WebkitBackdropFilter: 'blur(60px) saturate(180%) brightness(1.2) contrast(1.1)',
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.1),
                0 1px 0px rgba(255, 255, 255, 0.9) inset,
                0 -1px 0px rgba(0, 0, 0, 0.1) inset,
                0 0 0 1px rgba(255, 255, 255, 0.3),
                0 0 20px rgba(255, 255, 255, 0.2)
              `,
              border: 'none',
              transform: 'translateZ(0)',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08) translateZ(0)';
              e.currentTarget.style.filter = 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))';
              e.currentTarget.style.boxShadow = `
                0 12px 40px rgba(0, 0, 0, 0.15),
                0 2px 0px rgba(255, 255, 255, 1) inset,
                0 -2px 0px rgba(0, 0, 0, 0.15) inset,
                0 0 0 1px rgba(255, 255, 255, 0.4),
                0 0 30px rgba(255, 255, 255, 0.3)
              `;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateZ(0)';
              e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))';
              e.currentTarget.style.boxShadow = `
                0 8px 32px rgba(0, 0, 0, 0.1),
                0 1px 0px rgba(255, 255, 255, 0.9) inset,
                0 -1px 0px rgba(0, 0, 0, 0.1) inset,
                0 0 0 1px rgba(255, 255, 255, 0.3),
                0 0 20px rgba(255, 255, 255, 0.2)
              `;
            }}
            onClick={scrollToNextSection}
            aria-label={language === 'nl' ? 'Scroll naar beneden' : 'Scroll down'}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(ellipse 100% 60% at 20% 20%, rgba(255, 255, 255, 0.6) 0%, transparent 60%),
                  radial-gradient(ellipse 80% 40% at 80% 80%, rgba(0, 0, 0, 0.1) 0%, transparent 60%)
                `,
                pointerEvents: 'none',
              }}
            />
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 group-hover:text-gray-900 transition-colors relative z-10 drop-shadow-sm" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <ConsultationModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
      />
      <ChatOverlay
        open={chatOverlayOpen}
        onOpenChange={setChatOverlayOpen}
      />
    </>
  );

  return createPortal(content, document.body);
};