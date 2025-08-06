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
  const [isAtTop, setIsAtTop] = useState(true);
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

  // Simple scroll position tracking
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        setIsAtTop(scrollY < 100); // Show "up" arrow when scrolled past 100px
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const forceScrollToTop = () => {
    // Disable scroll behaviors temporarily
    document.documentElement.classList.add('disable-scroll-snap');
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Force immediate scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Restore behaviors after a short delay
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
      document.documentElement.classList.remove('disable-scroll-snap');
    }, 100);
  };

  const handleScrollAction = () => {
    if (!isAtTop) {
      forceScrollToTop();
    } else {
      // Scroll down one viewport
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
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
            onClick={handleScrollAction}
            aria-label={language === 'nl' ? (!isAtTop ? 'Naar boven' : 'Naar beneden') : (!isAtTop ? 'To top' : 'Scroll down')}
          >
            {!isAtTop ? (
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