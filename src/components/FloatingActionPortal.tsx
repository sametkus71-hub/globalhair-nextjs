import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Calendar, MessageCircle, ChevronDown, ChevronUp, Instagram, Send, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { ConsultationModal } from './ConsultationModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useScrollContext } from '@/contexts/ScrollContext';

export const FloatingActionPortal: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [isUserActive, setIsUserActive] = useState(true);
  const { language } = useLanguage();
  const location = useLocation();
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
    if (location.pathname.includes('/haartransplantatie')) {
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
  }, [location.pathname]);

  // Memoized calculation to avoid repeated DOM queries
  const isOnLastSection = useMemo(() => {
    if (!location.pathname.includes('/haartransplantatie')) return false;
    
    const sections = document.querySelectorAll('.snap-section');
    const totalSections = sections.length;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    let currentSectionIndex = 0;
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollTop;
      
      if (scrollTop >= sectionTop - windowHeight / 2) {
        currentSectionIndex = index;
      }
    });
    
    return currentSectionIndex >= totalSections - 1;
  }, [location.pathname]);

  if (!mounted) return null;

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
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 ease-out flex items-center justify-center group hover:scale-105"
            style={{
              background: 'hsl(var(--primary))',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: 'var(--shadow-strong)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
            onClick={() => setConsultModalOpen(true)}
            aria-label={language === 'nl' ? 'Plan Consult' : 'Plan Consultation'}
          >
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-white/90 transition-colors" />
          </button>
          <span className="text-[9px] font-medium text-white text-center drop-shadow-sm">
            {language === 'nl' ? 'Consult' : 'Consult'}
          </span>
        </div>

        {/* Chat Support Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 ease-out flex items-center justify-center group hover:scale-105"
            style={{
              background: 'hsl(var(--secondary))',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: 'var(--shadow-strong)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
            onClick={() => setChatModalOpen(true)}
            aria-label={language === 'nl' ? 'Chat Support' : 'Chat Support'}
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-white/90 transition-colors" />
          </button>
          <span className="text-[9px] font-medium text-white text-center drop-shadow-sm">
            {language === 'nl' ? 'Chat' : 'Chat'}
          </span>
        </div>

        {/* Scroll Navigation Button */}
        <div className="flex flex-col items-center gap-1">
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 ease-out flex items-center justify-center group hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 1px 0px rgba(255, 255, 255, 0.4) inset, 0 1px 0px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onClick={scrollToNextSection}
            aria-label={language === 'nl' ? (isOnLastSection ? 'Naar boven' : 'Volgende') : (isOnLastSection ? 'To top' : 'Next')}
          >
            {isOnLastSection ? (
              <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Modals */}
      <ConsultationModal 
        open={consultModalOpen} 
        onOpenChange={setConsultModalOpen}
      />
      
      {/* Chat Support Modal */}
      <Dialog open={chatModalOpen} onOpenChange={setChatModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border shadow-strong">
          <DialogHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 -m-6 mb-4 p-6 rounded-t-lg">
            <DialogTitle className="text-foreground">
              {language === 'nl' ? 'Contact & Support' : 'Contact & Support'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">GlobalHair</p>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <p className="text-sm text-muted-foreground">
              {language === 'nl' 
                ? 'Kies uw voorkeur om contact met ons op te nemen.'
                : 'Choose your preferred way to contact us.'
              }
            </p>
            <div className="flex flex-col gap-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-medium gap-2">
                <MessageCircle className="w-4 h-4" />
                {language === 'nl' ? 'WhatsApp Chat' : 'WhatsApp Chat'}
              </Button>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-medium gap-2">
                <Instagram className="w-4 h-4" />
                {language === 'nl' ? 'Instagram DM' : 'Instagram DM'}
              </Button>
              <Button className="w-full bg-black hover:bg-gray-900 text-white shadow-medium gap-2">
                <Send className="w-4 h-4" />
                {language === 'nl' ? 'TikTok Bericht' : 'TikTok Message'}
              </Button>
              <Button variant="outline" className="w-full border-secondary hover:bg-secondary/10 hover:border-secondary/60 gap-2">
                <Zap className="w-4 h-4" />
                {language === 'nl' ? 'Doe de haarscan' : 'Take hair scan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  return createPortal(content, document.body);
};