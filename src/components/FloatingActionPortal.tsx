import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, MessageCircle, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { ConsultationModal } from './ConsultationModal';
import { ChatOverlay } from './ChatOverlay';

export const FloatingActionPortal: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [chatOverlayOpen, setChatOverlayOpen] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const scrollToNextSection = () => {
    const mainSection = document.getElementById('main-section');
    const treatmentSection = document.getElementById('treatment-section');
    
    if (!mainSection || !treatmentSection) return;
    
    const currentScrollTop = window.scrollY;
    const mainSectionHeight = mainSection.offsetHeight;
    
    // If we're in the first section, scroll to treatment section
    if (currentScrollTop < mainSectionHeight / 2) {
      treatmentSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // If we're already in treatment section, scroll down by viewport height
      window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  if (!mounted) return null;

  const content = (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-4 z-[9999] flex flex-col gap-3 sm:bottom-8 sm:right-6">
        {/* Plan Consultation Button */}
        <button
          className="w-14 h-14 sm:w-16 sm:h-16 bg-primary text-primary-foreground rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 ease-out flex items-center justify-center border-2 border-white/20 backdrop-blur-sm"
          onClick={() => setConsultModalOpen(true)}
          aria-label={language === 'nl' ? 'Plan Consult' : 'Plan Consultation'}
        >
          <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Chat Support Button */}
        <button
          className="w-14 h-14 sm:w-16 sm:h-16 bg-primary text-primary-foreground rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 ease-out flex items-center justify-center border-2 border-white/20 backdrop-blur-sm"
          onClick={() => setChatOverlayOpen(true)}
          aria-label={language === 'nl' ? 'Chat Support' : 'Chat Support'}
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Scroll Down Button */}
        <button
          className="w-14 h-14 sm:w-16 sm:h-16 bg-primary text-primary-foreground rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 ease-out flex items-center justify-center border-2 border-white/20 backdrop-blur-sm"
          onClick={scrollToNextSection}
          aria-label={language === 'nl' ? 'Meer Info' : 'More Info'}
        >
          <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
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