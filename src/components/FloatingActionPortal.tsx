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
    // Check if we're on haartransplantatie page
    if (location.pathname.includes('/haartransplantatie')) {
      const sections = document.querySelectorAll('.snap-section');
      const totalSections = sections.length;
      
      // Find current section by checking which one is most visible
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
      
      console.log('🔄 Scroll Debug:', {
        currentSectionIndex,
        totalSections,
        scrollTop,
        isOnLast: currentSectionIndex >= totalSections - 1
      });
      
      // If on last section, scroll to top
      if (currentSectionIndex >= totalSections - 1) {
        console.log('📤 Scrolling to top');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      // Otherwise scroll to next section
      const nextSection = sections[currentSectionIndex + 1] as HTMLElement;
      if (nextSection) {
        console.log('📥 Scrolling to next section:', currentSectionIndex + 1);
        nextSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
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
      
      const isLast = currentSectionIndex >= totalSections - 1;
      console.log('🔍 Button State Check:', {
        currentSectionIndex,
        totalSections,
        isLast,
        scrollTop
      });
      
      return isLast;
    }
    return false;
  };

  if (!mounted) return null;

  const content = (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-4 z-[9999] flex flex-col gap-1 sm:bottom-28 sm:right-6">
        {/* Plan Consultation Button */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white border border-gray-200 transition-all duration-200 ease-out flex items-center justify-center group hover:bg-gray-50"
            onClick={() => setConsultModalOpen(true)}
            aria-label={language === 'nl' ? 'Plan Consult' : 'Plan Consultation'}
          >
            <Calendar className="w-4 h-4 text-gray-700 group-hover:text-gray-900" />
          </button>
          <span className="text-[8px] font-medium text-gray-900 text-center">
            {language === 'nl' ? 'Consult' : 'Consult'}
          </span>
        </div>

        {/* Chat Support Button */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white border border-gray-200 transition-all duration-200 ease-out flex items-center justify-center group hover:bg-gray-50"
            onClick={() => setChatOverlayOpen(true)}
            aria-label={language === 'nl' ? 'Chat Support' : 'Chat Support'}
          >
            <MessageCircle className="w-4 h-4 text-gray-700 group-hover:text-gray-900" />
          </button>
          <span className="text-[8px] font-medium text-gray-900 text-center">
            {language === 'nl' ? 'Chat' : 'Chat'}
          </span>
        </div>

        {/* Scroll Navigation Button */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white border border-gray-200 transition-all duration-200 ease-out flex items-center justify-center group hover:bg-gray-50"
            onClick={scrollToNextSection}
            aria-label={language === 'nl' ? (isOnLastSection() ? 'Naar boven' : 'Volgende') : (isOnLastSection() ? 'To top' : 'Next')}
          >
            {isOnLastSection() ? (
              <ChevronUp className="w-4 h-4 text-gray-700 group-hover:text-gray-900" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-700 group-hover:text-gray-900" />
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