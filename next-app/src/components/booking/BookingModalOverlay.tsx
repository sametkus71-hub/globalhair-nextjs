'use client';

import { useEffect, useState } from 'react';
import { BookingWizard } from './BookingWizard';
import { useBookingModal } from '@/contexts/BookingModalContext';
import { useLanguage } from '@/hooks/useLanguage';
import { PopupCloseButton } from '@/components/PopupCloseButton';
import { DesktopContainer } from '@/components/layout/DesktopContainer';

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
      document.body.classList.add('popup-open');
      document.body.classList.add('scale-down-active');
    }
  }, [isOpen]);

  // Handle closing with animation
  const handleClose = () => {
    setIsExiting(true);
    document.body.classList.remove('scale-down-active');

    setTimeout(() => {
      document.body.classList.remove('popup-open');
      closeModal();
      setIsExiting(false); // Reset for next time
    }, 350); // Match animation duration from globals.css
  };

  // Ensure cleanup on unmount or forced close
  useEffect(() => {
    return () => {
      document.body.classList.remove('popup-open');
      document.body.classList.remove('scale-down-active');
      document.body.style.overflow = 'unset';
    };
  }, []);

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
        className={`fixed inset-0 z-50 ${isExiting ? 'reviews-page-exit' : 'reviews-page-fullscreen'}`}
        style={{
          background: 'transparent', // Let the blur container handle the background
        }}
      >
        {/* Blur overlay matching BookingPage EXACTLY */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backdropFilter: 'blur(10.6px)',
            background: 'linear-gradient(180deg, rgba(4, 14, 21, 0.4) 0%, rgba(51, 61, 70, 0.2) 100%)'
          }}
          onClick={handleClose}
        />

        {/* Close Button matching BookingPage */}
        <PopupCloseButton
          onClose={handleClose}
          className="!left-auto !right-4"
          style={{ zIndex: 100 }}
        />

        {/* Content Container matching BookingPage EXACTLY */}
        <div className="relative z-10 h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="min-h-screen py-6 px-4">
            <DesktopContainer>
              {/* Use the exact same layout struct for title and content */}
              <div className="opacity-100 translate-y-0">
                <h1
                  className="font-inter mb-6 lg:text-center"
                  style={{
                    lineHeight: 1,
                    fontWeight: 400,
                    fontSize: '40px',
                    background: 'linear-gradient(123.33deg, rgba(255, 255, 255, 0.5) -0.64%, #FFFFFF 39.54%, #FFFFFF 79.72%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0px 3.39px 18.55px #FFFFFF40'
                  }}
                >
                  <span className="lg:hidden">Boek een<br />afspraak</span>
                  <span className="hidden lg:inline">Boek een afspraak</span>
                </h1>

                <BookingWizard />
              </div>
            </DesktopContainer>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Scale down animation for the main content */
        body {
          transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.4s cubic-bezier(0.32, 0.72, 0, 1);
          transform-origin: top center;
        }

        body.scale-down-active {
           transform: scale(0.93) translateY(10px);
           border-radius: 20px;
           overflow: hidden; 
        }
      `}</style>
    </>
  );
};
