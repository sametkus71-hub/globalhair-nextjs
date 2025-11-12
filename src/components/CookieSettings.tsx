import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { getCookieConsent, setCookieConsent, type CookieConsent } from '@/lib/cookie-consent';

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

/**
 * Cookie Settings Dialog
 * Allows users to customize their cookie preferences
 */
export function CookieSettings({ isOpen, onClose, onSave }: CookieSettingsProps) {
  const { language } = useLanguage();
  const [settings, setSettings] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Load current consent
    const consent = getCookieConsent();
    if (consent) {
      setSettings({
        essential: true, // Always true
        analytics: consent.analytics,
        marketing: consent.marketing,
      });
    }
  }, [isOpen]);

  const handleSave = () => {
    setCookieConsent(settings);
    onSave();
    // Reload to apply changes
    window.location.reload();
  };

  const content = {
    nl: {
      title: 'Cookie-instellingen',
      description: 'Beheer uw cookievoorkeuren. Essentiële cookies zijn altijd ingeschakeld omdat ze nodig zijn voor de basisfunctionaliteit van de website.',
      essential: {
        title: 'Essentiële cookies',
        description: 'Vereist voor het goed functioneren van de website. Omvat: sessiebeheer, taalvoorkeuren.',
      },
      analytics: {
        title: 'Analytische cookies',
        description: 'Helpen ons te begrijpen hoe bezoekers onze site gebruiken. Omvat: Google Analytics, Search Console.',
      },
      marketing: {
        title: 'Marketing cookies',
        description: 'Gebruikt om relevante advertenties te tonen. Momenteel niet gebruikt.',
      },
      cancel: 'Annuleren',
      save: 'Voorkeuren opslaan',
    },
    en: {
      title: 'Cookie Settings',
      description: 'Manage your cookie preferences. Essential cookies are always enabled as they are required for the basic functionality of the website.',
      essential: {
        title: 'Essential Cookies',
        description: 'Required for the website to function properly. Includes: session management, language preferences.',
      },
      analytics: {
        title: 'Analytics Cookies',
        description: 'Help us understand how visitors use our site. Includes: Google Analytics, Search Console.',
      },
      marketing: {
        title: 'Marketing Cookies',
        description: 'Used to show relevant advertisements. Currently not in use.',
      },
      cancel: 'Cancel',
      save: 'Save Preferences',
    },
  };

  const text = content[language];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {text.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {text.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Essential Cookies */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1">
                {text.essential.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {text.essential.description}
              </p>
            </div>
            <Switch
              checked={settings.essential}
              disabled
              className="shrink-0"
              aria-label={text.essential.title}
            />
          </div>

          {/* Analytics Cookies */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1">
                {text.analytics.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {text.analytics.description}
              </p>
            </div>
            <Switch
              checked={settings.analytics}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, analytics: checked }))
              }
              className="shrink-0"
              aria-label={text.analytics.title}
            />
          </div>

          {/* Marketing Cookies */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1">
                {text.marketing.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {text.marketing.description}
              </p>
            </div>
            <Switch
              checked={settings.marketing}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, marketing: checked }))
              }
              className="shrink-0"
              aria-label={text.marketing.title}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-sm"
          >
            {text.cancel}
          </Button>
          <Button
            onClick={handleSave}
            className="text-sm"
          >
            {text.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
