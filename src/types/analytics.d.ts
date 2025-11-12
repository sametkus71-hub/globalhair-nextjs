/**
 * TypeScript definitions for Google Analytics
 */

interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}
