'use client';

import { useEffect, useState } from 'react';
import { BookingWizard } from './BookingWizard';
import { useBookingModal } from '@/contexts/BookingModalContext';
import { useLanguage } from '@/hooks/useLanguage';
import { PopupCloseButton, SwipeablePopupWrapper } from '@/components/PopupCloseButton';

export const BookingModalOverlay = () => {
  const { isOpen, closeModal } = useBookingModal();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Only render on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync isExiting with isOpen when opening
  useEffect(() => {
    if (isOpen) {
      setIsExiting(false);
      // Add popup-open class to body
      document.body.classList.add('popup-open');
    }
  }, [isOpen]);

  // Handle closing with animation
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      document.body.classList.remove('popup-open');
      closeModal();
      setIsExiting(false); // Reset for next time
    }, 350); // Match animation duration from globals.css
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || (!isOpen && !isExiting)) return null;

  return (
    <>
      <div
        className={`popup-wrapper-fade ${isExiting ? 'popup-wrapper-fade-out' : ''}`}
        style={{
          overflow: 'hidden',
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker backdrop match
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <div
          className="h-full flex items-start justify-center p-4 pt-4 md:pb-12"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <main
            className="flex flex-col w-full max-w-2xl md:max-w-[42rem]"
            style={{ height: 'calc(var(--app-height) - 32px)' }}
          >
            <SwipeablePopupWrapper onClose={handleClose} className="h-full flex flex-col">
              <section
                className={`relative rounded-[24px] flex-1 mb-0 flex flex-col reviews-page-fullscreen ${isExiting ? 'reviews-page-exit' : ''}`}
                style={{
                  background: '#0A0A0A',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  zIndex: 10,
                  minHeight: 0,
                  transform: 'translateY(100%)', // Default starting position for animation
                }}
              >
                {/* Close button inside section */}
                <PopupCloseButton onClose={handleClose} className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20" />

                {/* Header */}
                <div className="flex items-center justify-center py-4 border-b border-white/10 shrink-0">
                  <span className="text-white font-medium text-sm">
                    {language === 'nl' ? 'Boek een afspraak' : 'Book an appointment'}
                  </span>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <BookingWizard />
                </div>
              </section>
            </SwipeablePopupWrapper>
          </main>
        </div>
      </div>

      {/* CSS for animation classes is in globals.css, but we need to ensure overrides if necessary */}
      <style jsx global>{`
        /* Ensure the modal background doesn't interfere with our dark theme */
        .reviews-page-fullscreen {
          background: #0A0A0A !important; 
        }
      `}</style>
    </>
  );
};
