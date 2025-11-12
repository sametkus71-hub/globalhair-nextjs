/**
 * Google Analytics Integration with Cookie Consent
 * Only loads GA4 after user consent
 */

import { isCategoryAllowed } from './cookie-consent';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

let analyticsInitialized = false;

/**
 * Initialize Google Analytics 4 with consent
 */
export function initializeAnalytics(measurementId?: string): void {
  // Check consent
  if (!isCategoryAllowed('analytics')) {
    console.info('[Analytics] User has not consented to analytics cookies');
    return;
  }

  // Prevent double initialization
  if (analyticsInitialized) {
    console.info('[Analytics] Already initialized');
    return;
  }

  // Get measurement ID from env or parameter
  const gaId = measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!gaId) {
    console.warn('[Analytics] No GA4 Measurement ID found. Set VITE_GA_MEASUREMENT_ID in .env');
    return;
  }

  console.info('[Analytics] Initializing GA4 with ID:', gaId);

  try {
    // Load GA4 script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId, {
      anonymize_ip: true, // GDPR requirement
      cookie_flags: 'SameSite=None;Secure', // Modern cookie security
      send_page_view: true,
    });

    analyticsInitialized = true;
    console.info('[Analytics] GA4 initialized successfully');
  } catch (error) {
    console.error('[Analytics] Error initializing GA4:', error);
  }
}

/**
 * Remove analytics scripts and cookies (when consent is revoked)
 */
export function removeAnalytics(): void {
  console.info('[Analytics] Removing analytics...');

  try {
    // Remove GA4 scripts
    const scripts = document.querySelectorAll('script[src*="googletagmanager"]');
    scripts.forEach(script => {
      script.remove();
      console.info('[Analytics] Removed script:', script.getAttribute('src'));
    });

    // Clear GA cookies
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const cookieName = cookie.trim().split('=')[0];
      if (cookieName.startsWith('_ga') || cookieName.startsWith('_gid')) {
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname}`;
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
        console.info('[Analytics] Removed cookie:', cookieName);
      }
    });

    // Clear dataLayer
    if (window.dataLayer) {
      window.dataLayer = [];
    }

    analyticsInitialized = false;
    console.info('[Analytics] Cleanup complete');
  } catch (error) {
    console.error('[Analytics] Error during cleanup:', error);
  }
}

/**
 * Track a custom event (only if analytics is enabled)
 */
export function trackEvent(eventName: string, eventParams?: object): void {
  if (!isCategoryAllowed('analytics') || !window.gtag) {
    return;
  }

  try {
    window.gtag('event', eventName, eventParams);
    console.info('[Analytics] Event tracked:', eventName, eventParams);
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
  }
}

/**
 * Track a page view (only if analytics is enabled)
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (!isCategoryAllowed('analytics') || !window.gtag) {
    return;
  }

  try {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
    console.info('[Analytics] Page view tracked:', pagePath);
  } catch (error) {
    console.error('[Analytics] Error tracking page view:', error);
  }
}
