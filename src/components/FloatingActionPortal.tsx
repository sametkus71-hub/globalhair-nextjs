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

  const scrollToNextSection = () => {
    // Use scroll context if available (on haartransplantatie page)
    if (scrollContext && location.pathname.includes('/haartransplantatie')) {
      const { currentPostIndex, totalPosts, scrollToPost } = scrollContext;
      if (currentPostIndex < totalPosts - 1) {
        scrollToPost(currentPostIndex + 1);
        return;
      } else {
        // If on last section, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    
    // Default behavior for other pages
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  const isOnLastSection = () => {
    if (scrollContext && location.pathname.includes('/haartransplantatie')) {
      const { currentPostIndex, totalPosts } = scrollContext;
      return currentPostIndex >= totalPosts - 1;
    }
    return false;
  };

  if (!mounted) return null;

  const content = (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-6 z-[9999] flex flex-col gap-4 sm:bottom-24 sm:right-8">
        {/* Plan Consultation Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-medium hover:scale-105 hover:shadow-strong transition-all duration-300 ease-out flex items-center justify-center border border-white/10 backdrop-blur-sm group"
            style={{
              background: 'linear-gradient(145deg, hsl(var(--primary)), hsl(var(--primary-glow)))',
              boxShadow: '0 4px 16px hsl(var(--primary) / 0.3), 0 0 0 1px hsl(var(--primary-foreground) / 0.1) inset',
            }}
            onClick={() => setConsultModalOpen(true)}
            aria-label={language === 'nl' ? 'Plan Consult' : 'Plan Consultation'}
          >
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground group-hover:scale-110 transition-transform duration-200" />
          </button>
          <span className="text-xs font-medium text-foreground/70 text-center">
            {language === 'nl' ? 'Consult' : 'Consult'}
          </span>
        </div>

        {/* Chat Support Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-medium hover:scale-105 hover:shadow-strong transition-all duration-300 ease-out flex items-center justify-center border border-white/10 backdrop-blur-sm group"
            style={{
              background: 'linear-gradient(145deg, hsl(var(--secondary)), hsl(var(--secondary-light)))',
              boxShadow: '0 4px 16px hsl(var(--secondary) / 0.3), 0 0 0 1px hsl(var(--secondary-foreground) / 0.1) inset',
            }}
            onClick={() => setChatOverlayOpen(true)}
            aria-label={language === 'nl' ? 'Chat Support' : 'Chat Support'}
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-foreground group-hover:scale-110 transition-transform duration-200" />
          </button>
          <span className="text-xs font-medium text-foreground/70 text-center">
            {language === 'nl' ? 'Chat' : 'Chat'}
          </span>
        </div>

        {/* Scroll Navigation Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-medium hover:scale-105 hover:shadow-strong transition-all duration-300 ease-out flex items-center justify-center border border-white/10 backdrop-blur-sm group"
            style={{
              background: 'linear-gradient(145deg, hsl(var(--gray-700)), hsl(var(--gray-600)))',
              boxShadow: '0 4px 16px hsl(var(--gray-600) / 0.3), 0 0 0 1px hsl(var(--gray-200) / 0.1) inset',
            }}
            onClick={scrollToNextSection}
            aria-label={language === 'nl' ? (isOnLastSection() ? 'Naar boven' : 'Meer Info') : (isOnLastSection() ? 'To top' : 'More Info')}
          >
            {isOnLastSection() ? (
              <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform duration-200" />
            )}
          </button>
          <span className="text-xs font-medium text-foreground/70 text-center">
            {language === 'nl' ? (isOnLastSection() ? 'Top' : 'Meer') : (isOnLastSection() ? 'Top' : 'More')}
          </span>
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