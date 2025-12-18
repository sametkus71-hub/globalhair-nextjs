'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BookingWizard } from './BookingWizard';
import { useBookingModal } from '@/contexts/BookingModalContext';
import { useLanguage } from '@/hooks/useLanguage';

export const BookingModalOverlay = () => {
  const { isOpen, closeModal } = useBookingModal();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Only render on client
  useEffect(() => {
    setMounted(true);
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

  if (!mounted || !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`booking-modal-backdrop ${isOpen ? 'open' : ''}`}
        onClick={closeModal}
      />

      {/* Modal Panel */}
      <div className={`booking-modal-panel ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
          <span className="text-white font-medium text-sm">
            {language === 'nl' ? 'Boek een afspraak' : 'Book an appointment'}
          </span>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          <BookingWizard />
        </div>

        {/* Safe Area Spacer for Mobile */}
        <div className="h-6 shrink-0 sm:hidden" />
      </div>

      <style jsx>{`
        .booking-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          opacity: 0;
          transition: opacity 0.25s cubic-bezier(0.32, 0.72, 0, 1);
          pointer-events: none;
        }

        .booking-modal-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }

        .booking-modal-panel {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 100%);
          z-index: 51;
          width: 100%;
          max-width: 32rem;
          height: 85vh;
          background: #0A0A0A;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem 1.5rem 0 0;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .booking-modal-panel.open {
          transform: translate(-50%, 0);
        }

        @media (min-width: 640px) {
          .booking-modal-panel {
            bottom: 50%;
            transform: translate(-50%, calc(50% + 100vh));
            height: 90vh;
            border-radius: 1.5rem;
          }

          .booking-modal-panel.open {
            transform: translate(-50%, 50%);
          }
        }
      `}</style>
    </>
  );
};
