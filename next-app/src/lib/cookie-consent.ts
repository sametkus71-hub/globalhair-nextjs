'use client';

/**
 * Cookie Consent Management System
 * Handles user consent preferences for cookies with GDPR compliance
 */

export type CookieCategory = 'essential' | 'analytics' | 'marketing';

export interface CookieConsent {
  essential: boolean;      // Always true
  analytics: boolean;      // Google Analytics, Search Console
  marketing: boolean;      // Future ads/tracking
  timestamp: number;       // When consent was given
  version: string;         // Policy version
  consentId: string;       // Unique consent ID
}

const CONSENT_KEY = 'globalhair_cookie_consent';
const CONSENT_VERSION = '1.0';
const CONSENT_EXPIRY_DAYS = 365; // 12 months

/**
 * Generate a unique consent ID
 */
function generateConsentId(): string {
  return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current cookie consent from localStorage
 */
export function getCookieConsent(): CookieConsent | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored) as CookieConsent;
  } catch (error) {
    console.error('Error reading cookie consent:', error);
    return null;
  }
}

/**
 * Save cookie consent to localStorage
 */
export function setCookieConsent(consent: Partial<CookieConsent>): void {
  try {
    const fullConsent: CookieConsent = {
      essential: true, // Always true
      analytics: consent.analytics ?? false,
      marketing: consent.marketing ?? false,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
      consentId: consent.consentId ?? generateConsentId(),
    };
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(fullConsent));
    
    // Dispatch custom event for listeners
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: fullConsent 
    }));
    
    console.info('[Cookie Consent] Saved:', {
      analytics: fullConsent.analytics,
      marketing: fullConsent.marketing,
      consentId: fullConsent.consentId
    });
  } catch (error) {
    console.error('Error saving cookie consent:', error);
  }
}

/**
 * Check if consent exists and is valid (not expired, correct version)
 */
export function hasValidConsent(): boolean {
  const consent = getCookieConsent();
  if (!consent) return false;
  
  // Check if consent has expired (365 days)
  const daysSinceConsent = (Date.now() - consent.timestamp) / (1000 * 60 * 60 * 24);
  if (daysSinceConsent > CONSENT_EXPIRY_DAYS) {
    console.info('[Cookie Consent] Expired after', daysSinceConsent.toFixed(0), 'days');
    return false;
  }
  
  // Check if policy version matches
  if (consent.version !== CONSENT_VERSION) {
    console.info('[Cookie Consent] Version mismatch:', consent.version, 'vs', CONSENT_VERSION);
    return false;
  }
  
  return true;
}

/**
 * Check if a specific category is allowed
 */
export function isCategoryAllowed(category: CookieCategory): boolean {
  if (category === 'essential') return true; // Essential always allowed
  
  const consent = getCookieConsent();
  if (!consent || !hasValidConsent()) return false;
  
  return consent[category] ?? false;
}

/**
 * Revoke cookie consent (user wants to withdraw)
 */
export function revokeCookieConsent(): void {
  try {
    localStorage.removeItem(CONSENT_KEY);
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('cookieConsentRevoked'));
    
    console.info('[Cookie Consent] Revoked');
    
    // Reload page to clear analytics
    window.location.reload();
  } catch (error) {
    console.error('Error revoking cookie consent:', error);
  }
}

/**
 * Determine if the banner should be shown
 */
export function shouldShowBanner(): boolean {
  return !hasValidConsent();
}

/**
 * Accept all cookies
 */
export function acceptAllCookies(): void {
  setCookieConsent({
    analytics: true,
    marketing: true,
  });
}

/**
 * Reject non-essential cookies
 */
export function rejectNonEssentialCookies(): void {
  setCookieConsent({
    analytics: false,
    marketing: false,
  });
}

/**
 * Get consent for analytics debugging
 */
export function getConsentDebugInfo(): object {
  const consent = getCookieConsent();
  if (!consent) return { status: 'no_consent' };
  
  const daysSinceConsent = (Date.now() - consent.timestamp) / (1000 * 60 * 60 * 24);
  
  return {
    status: hasValidConsent() ? 'valid' : 'invalid',
    analytics: consent.analytics,
    marketing: consent.marketing,
    version: consent.version,
    daysSinceConsent: Math.floor(daysSinceConsent),
    consentId: consent.consentId,
  };
}
