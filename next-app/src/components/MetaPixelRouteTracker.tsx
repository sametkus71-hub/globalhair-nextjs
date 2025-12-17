'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackPageView, isMetaPixelAllowed } from '@/lib/metaPixel';

// Map routes to content names for better tracking
const getContentName = (pathname: string): string => {
  const routeMap: Record<string, string> = {
    '/nl': 'Home NL',
    '/en': 'Home EN',
    '/nl/haartransplantatie': 'Hair Transplant NL',
    '/en/hairtransplant': 'Hair Transplant EN',
    '/nl/haartransplantatie/mission': 'Mission NL',
    '/en/hairtransplant/mission': 'Mission EN',
    '/nl/haartransplantatie/reviews': 'Reviews NL',
    '/en/hairtransplant/reviews': 'Reviews EN',
    '/nl/haartransplantatie/contact': 'Contact NL',
    '/en/hairtransplant/contact': 'Contact EN',
    '/nl/boeken': 'Booking NL',
    '/en/book': 'Booking EN',
    '/nl/boeken/succes': 'Booking Success NL',
    '/en/book/success': 'Booking Success EN',
    '/nl/haaranalyse': 'Hair Analysis NL',
    '/en/hairanalysis': 'Hair Analysis EN',
  };
  
  return routeMap[pathname] || pathname;
};

const getContentCategory = (pathname: string): string => {
  if (pathname.includes('boeken') || pathname.includes('book')) return 'Booking';
  if (pathname.includes('haaranalyse') || pathname.includes('hairanalysis')) return 'Analysis';
  if (pathname.includes('haartransplantatie') || pathname.includes('hairtransplant')) return 'Hair Transplant';
  if (pathname.includes('reviews')) return 'Reviews';
  if (pathname.includes('contact')) return 'Contact';
  if (pathname.includes('mission')) return 'About';
  return 'General';
};

export const MetaPixelRouteTracker = () => {
  const pathname = usePathname();
  const previousPathRef = useRef<string>('');

  useEffect(() => {
    // Skip if same path (prevents double firing)
    if (previousPathRef.current === pathname) return;
    previousPathRef.current = pathname;

    // Skip if no marketing consent
    if (!isMetaPixelAllowed()) return;

    // Skip admin routes
    if (pathname.startsWith('/admin')) return;

    const contentName = getContentName(pathname);
    const contentCategory = getContentCategory(pathname);

    trackPageView({
      content_name: contentName,
      content_category: contentCategory,
      source_url: window.location.href,
    }, { dedupeKey: `pv_${pathname}_${Date.now()}` });

  }, [pathname]);

  return null;
};
