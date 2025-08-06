import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Calendar, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { ConsultationModal } from './ConsultationModal';
import { ChatOverlay } from './ChatOverlay';
import { useScrollContext } from '@/contexts/ScrollContext';

export const FloatingActionPortal: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [chatOverlayOpen, setChatOverlayOpen] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const { language } = useLanguage();
  const location = useLocation();
  
  // Try to get scroll context, but handle case where it's not available
  let scrollContext;
  try {
    scrollContext = useScrollContext();
  } catch {
    scrollContext = null;
  }

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Track scroll position to update button state with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Don't update during programmatic scrolling
      if (isScrolling) return;
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (location.pathname.includes('/haartransplantatie')) {
          const sections = document.querySelectorAll('.snap-section');
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          
          let currentIndex = 0;
          sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollTop;
            
            if (scrollTop >= sectionTop - windowHeight / 2) {
              currentIndex = index;
            }
          });
          
          setCurrentSectionIndex(currentIndex);
        }
      }, 100); // Debounce scroll events
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [location.pathname, isScrolling]);

  const scrollToTop = () => {
    setIsScrolling(true);
    
    // Temporarily disable scroll snap
    document.documentElement.classList.add('disable-scroll-snap');
    
    // Multiple fallback methods for scrolling to top
    const scrollMethods = [
      () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      () => { document.documentElement.scrollTop = 0; },
      () => { document.body.scrollTop = 0; },
      () => { window.scrollTo(0, 0); }
    ];
    
    // Try each method
    let methodIndex = 0;
    const tryScroll = () => {
      if (methodIndex < scrollMethods.length) {
        try {
          scrollMethods[methodIndex]();
          methodIndex++;
        } catch (error) {
          methodIndex++;
          if (methodIndex < scrollMethods.length) {
            tryScroll();
          }
        }
      }
    };
    
    tryScroll();
    
    // Re-enable scroll snap and reset scrolling state after animation
    setTimeout(() => {
      document.documentElement.classList.remove('disable-scroll-snap');
      setIsScrolling(false);
    }, 800);
  };

  const scrollToNextSection = () => {
    // Check if we're on haartransplantatie page
    if (location.pathname.includes('/haartransplantatie')) {
      const sections = document.querySelectorAll('.snap-section');
      const totalSections = sections.length;
      
      // If on last section, scroll to top
      if (currentSectionIndex >= totalSections - 1) {
        scrollToTop();
        return;
      }
      
      // Otherwise scroll to next section
      const nextSection = sections[currentSectionIndex + 1] as HTMLElement;
      if (nextSection) {
        setIsScrolling(true);
        nextSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        setTimeout(() => setIsScrolling(false), 800);
      }
      return;
    }
    
    // Default behavior for other pages
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  const isOnLastSection = () => {
    if (location.pathname.includes('/haartransplantatie')) {
      const sections = document.querySelectorAll('.snap-section');
      const totalSections = sections.length;
      return currentSectionIndex >= totalSections - 1;
    }
    return false;
  };

  if (!mounted) return null;

  const content = (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-16 right-6 z-[9999] flex flex-col gap-3 sm:bottom-20 sm:right-8">
        {/* Plan Consultation Button */}
        <div className="flex flex-col items-center">
          <button
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-300 ease-out flex items-center justify-center group hover:scale-110"
            style={{
              background: 'linear-gradient(145deg, rgba(30, 51, 64, 0.25), rgba(22, 35, 43, 0.35), rgba(15, 26, 33, 0.25))',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.08) inset',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            onClick={() => setConsultModalOpen(true)}
            aria-label={language === 'nl' ? 'Plan Consult' : 'Plan Consultation'}
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
          </button>
          <span className="text-[10px] font-medium text-white/60 text-center mt-1">
            {language === 'nl' ? 'Consult' : 'Consult'}
          </span>
        </div>

        {/* Chat Support Button */}
        <div className="flex flex-col items-center">
          <button
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-300 ease-out flex items-center justify-center group hover:scale-110"
            style={{
              background: 'linear-gradient(145deg, rgba(30, 51, 64, 0.25), rgba(22, 35, 43, 0.35), rgba(15, 26, 33, 0.25))',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.08) inset',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            onClick={() => setChatOverlayOpen(true)}
            aria-label={language === 'nl' ? 'Chat Support' : 'Chat Support'}
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
          </button>
          <span className="text-[10px] font-medium text-white/60 text-center mt-1">
            {language === 'nl' ? 'Chat' : 'Chat'}
          </span>
        </div>

        {/* Scroll Navigation Button */}
        <div className="flex flex-col items-center">
          <button
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-300 ease-out flex items-center justify-center group hover:scale-110"
            style={{
              background: 'linear-gradient(145deg, rgba(30, 51, 64, 0.25), rgba(22, 35, 43, 0.35), rgba(15, 26, 33, 0.25))',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.08) inset',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            onClick={scrollToNextSection}
            aria-label={language === 'nl' ? (isOnLastSection() ? 'Naar boven' : 'Volgende') : (isOnLastSection() ? 'To top' : 'Next')}
          >
            {isOnLastSection() ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
            )}
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