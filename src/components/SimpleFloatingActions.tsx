import React from 'react';
import { Calendar, MessageCircle, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const SimpleFloatingActions: React.FC = () => {
  const { language } = useLanguage();

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('[data-scroll-target="treatment-info"]');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-4 bottom-32 z-[60] flex flex-col gap-3">
      {/* Plan Consultation Button */}
      <button
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
        onClick={() => alert(language === 'nl' ? 'Plan Consult' : 'Plan Consultation')}
        aria-label={language === 'nl' ? 'Plan Consult' : 'Plan Consultation'}
      >
        <Calendar className="w-6 h-6" />
      </button>

      {/* Chat Support Button */}
      <button
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
        onClick={() => alert(language === 'nl' ? 'Chat Support' : 'Chat Support')}
        aria-label={language === 'nl' ? 'Chat Support' : 'Chat Support'}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* More Info Button */}
      <button
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center"
        onClick={scrollToNextSection}
        aria-label={language === 'nl' ? 'Meer Info' : 'More Info'}
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </div>
  );
};