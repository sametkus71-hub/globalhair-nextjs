import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  shouldShowBanner, 
  acceptAllCookies, 
  rejectNonEssentialCookies,
} from '@/lib/cookie-consent';
import { CookieSettings } from './CookieSettings';

/**
 * Cookie Consent Banner - GDPR Compliant
 * Shows at bottom of screen on first visit
 */
export function CookieConsent() {
  const { language } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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

  if (!showBanner) return null;

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

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        role="dialog"
        aria-label="Cookie consent"
        aria-live="polite"
      >
        <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <div className="bg-card border-t border-border shadow-strong rounded-t-lg sm:rounded-lg overflow-hidden">
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Message */}
                <p className="text-sm text-foreground leading-relaxed max-w-2xl">
                  {text.message}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 sm:shrink-0">
                  <button
                    onClick={handleCustomize}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {text.customize}
                  </button>
                  
                  <button
                    onClick={handleRejectNonEssential}
                    className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-accent transition-colors"
                  >
                    {text.rejectNonEssential}
                  </button>

                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {text.acceptAll}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      {showSettings && (
        <CookieSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSaved}
        />
      )}
    </>
  );
}
