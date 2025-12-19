// src/lib/metaPixel.ts
// Lightweight Meta Pixel wrapper with de-duplication and eventID generation

import { hasValidConsent, isCategoryAllowed } from '@/lib/cookie-consent';

type Params = Record<string, any>;

declare global {
  interface Window {
    __mpLocks?: Record<string, boolean>;
    fbq?: (...args: any[]) => void;
  }
}

// Meta Pixel ID
const PIXEL_ID = '1605900147237994';

// ---- fbq readiness - trust Meta's queue system ----
function isFbqAvailable() {
  return typeof window !== 'undefined' &&
    typeof window.fbq === 'function';
}

function waitForFbq(maxMs = 3000) {
  return new Promise<boolean>((resolve) => {
    if (isFbqAvailable()) return resolve(true);
    const t0 = Date.now();
    const iv = setInterval(() => {
      if (isFbqAvailable()) {
        clearInterval(iv);
        resolve(true);
      } else if (Date.now() - t0 > maxMs) {
        clearInterval(iv);
        resolve(false);
      }
    }, 50);
  });
}

// ---- event id, dedupe ----
function genEventId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function lock(dedupeKey?: string, oncePerSession = false) {
  if (!dedupeKey) return true;
  if (oncePerSession) {
    const k = `mp_once_${dedupeKey}`;
    if (sessionStorage.getItem(k) === 'true') return false;
    sessionStorage.setItem(k, 'true');
  }
  window.__mpLocks ||= {};
  if (window.__mpLocks[dedupeKey]) return false;
  window.__mpLocks[dedupeKey] = true;
  return true;
}

// ---- image fallback (for ad blockers) ----
function imageFallback(eventName: string, params: Params = {}) {
  try {
    const q = new URLSearchParams();
    q.set('id', PIXEL_ID);
    q.set('ev', eventName);
    q.set('noscript', '1');
    Object.entries(params).forEach(([k, v]) => q.set(`cd[${k}]`, String(v)));
    const img = new Image(1, 1);
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?${q.toString()}`;
    document.body?.appendChild(img);
  } catch (_) {
    // Silent fail
  }
}

// --- Test Event Code support (for debugging) ---
function getTestEventCode() {
  try {
    const usp = new URLSearchParams(window.location.search);
    const q = usp.get('test_event_code');
    if (q) {
      sessionStorage.setItem('fb_test_event_code', q);
      return q;
    }
    return sessionStorage.getItem('fb_test_event_code') || '';
  } catch (_) {
    return '';
  }
}

// ---- SEND QUEUE (prevents race conditions) ----
let queue = Promise.resolve();
const SPACING_MS = 250;

function enqueueSend(task: () => Promise<void> | void) {
  queue = queue.then(async () => {
    await task();
    await new Promise(r => setTimeout(r, SPACING_MS));
  }).catch(() => { });
  return queue;
}

async function send(kind: 'track' | 'trackCustom', eventName: string, payload: Params) {
  const finalPayload: Params = { ...payload };
  const testCode = getTestEventCode();
  if (testCode) finalPayload.test_event_code = testCode;

  const ready = await waitForFbq(3000);
  if (ready) {
    try {
      const options: any = {};
      if (finalPayload.eventID) options.eventID = finalPayload.eventID;
      window.fbq?.(kind === 'track' ? 'track' : 'trackCustom', eventName, finalPayload, options);
      return;
    } catch (_) {
      // Fall through to image fallback
    }
  }
  imageFallback(eventName, finalPayload);
}

// ---- Check if marketing consent is given ----
export function isMetaPixelAllowed(): boolean {
  return hasValidConsent() && isCategoryAllowed('marketing');
}

// ---- PUBLIC API ----

// Track standard Facebook events (PageView, Lead, Purchase, etc.)
export async function trackStandard(
  eventName: 'PageView' | 'Lead' | 'CompleteRegistration' | 'Purchase' | string,
  params: Params = {},
  opts?: { dedupeKey?: string; oncePerSession?: boolean; eventIdPrefix?: string }
) {
  if (!isMetaPixelAllowed()) return;
  if (!lock(opts?.dedupeKey, !!opts?.oncePerSession)) return;
  const eventID = params.eventID || genEventId((opts?.eventIdPrefix || eventName).toLowerCase());
  const payload = { ...params, eventID };
  await enqueueSend(() => send('track', eventName, payload));
}

// Track custom events (your own event names)
export async function trackCustom(
  eventName: string,
  params: Params = {},
  opts?: { dedupeKey?: string; oncePerSession?: boolean; eventIdPrefix?: string }
) {
  if (!isMetaPixelAllowed()) return;
  if (!lock(opts?.dedupeKey, !!opts?.oncePerSession)) return;
  const eventID = params.eventID || genEventId((opts?.eventIdPrefix || eventName).toLowerCase());
  const payload = { ...params, eventID };
  await enqueueSend(() => send('trackCustom', eventName, payload));
}

// Convenience function for PageView
export const trackPageView = (params: Params = {}, opts?: { dedupeKey?: string }) =>
  trackStandard('PageView', params, { ...opts, eventIdPrefix: 'pageview' });

// Simple PageView without extra params
export async function trackSimplePageView(opts?: { dedupeKey?: string }) {
  if (!isMetaPixelAllowed()) return;
  if (!lock(opts?.dedupeKey, false)) return;
  await enqueueSend(async () => {
    const ready = await waitForFbq(3000);
    if (ready) {
      try {
        window.fbq?.('track', 'PageView');
        return;
      } catch (_) { }
    }
    imageFallback('PageView');
  });
}

// Initialize Meta Pixel (called when consent is given)
export function initializeMetaPixel() {
  if (!isMetaPixelAllowed()) {
    console.info('Meta Pixel: Marketing consent not given, skipping initialization');
    return;
  }
  console.info('Meta Pixel: Initialized with consent');
}
