'use client';


import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  shouldShowBanner,
  acceptAllCookies,
  rejectNonEssentialCookies,
} from '@/lib/cookie-consent';
import { CookieSettings } from './CookieSettings';
import { createPortal } from 'react-dom';

/**
 * Cookie Consent Banner - GDPR Compliant
 * Shows at bottom of screen on first visit
 */
export function CookieConsent() {
  const { language } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if banner should be shown
    const shouldShow = shouldShowBanner();
    if (shouldShow) {
      setShowBanner(true);
      // Animate in after a short delay
      setTimeout(() => setIsVisible(true), 100);
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    handleClose();
  };

  const handleRejectNonEssential = () => {
    rejectNonEssentialCookies();
    handleClose();
  };

  const handleCustomize = () => {
    setShowSettings(true);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const handleSettingsSaved = () => {
    setShowSettings(false);
    handleClose();
  };

  if (!mounted || !showBanner) return null;

  const content = {
    nl: {
      message: 'We gebruiken cookies om uw ervaring te verbeteren en het sitegebruik te analyseren. U kunt kiezen welke cookies u wilt toestaan.',
      acceptAll: 'Alles accepteren',
      rejectNonEssential: 'Alleen essentiële',
      customize: 'Aanpassen',
    },
    en: {
      message: 'We use cookies to improve your experience and analyze site usage. You can choose which cookies to allow.',
      acceptAll: 'Accept All',
      rejectNonEssential: 'Essential Only',
      customize: 'Customize',
    },
  };

  const text = content[language];

  // Render via Portal to ensure it sits on top of everything (breaking stacking contexts)
  return (
    <>
      {/* settings modal is already a portal or should be, assuming it is handled inside CookieSettings */}
      {showSettings && (
        <CookieSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSaved}
        />
      )}

      {/* Banner Portal */}
      {createPortal(
        <div
          className={`fixed bottom-0 left-0 right-0 z-[100000] transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
          style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
        >
          <div
            className="bg-background border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Message */}
                <p className="text-sm text-gray-700 leading-relaxed font-light">
                  {text.message}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 sm:shrink-0">
                  <button
                    onClick={handleCustomize}
                    className="px-4 py-2.5 text-sm font-normal text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {text.customize}
                  </button>

                  <button
                    onClick={handleRejectNonEssential}
                    className="px-4 py-2.5 text-sm font-normal border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-md transition-colors"
                  >
                    {text.rejectNonEssential}
                  </button>

                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2.5 text-sm font-medium bg-[#182F3C] text-white hover:bg-[#182F3C]/90 rounded-md transition-colors shadow-sm"
                  >
                    {text.acceptAll}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
