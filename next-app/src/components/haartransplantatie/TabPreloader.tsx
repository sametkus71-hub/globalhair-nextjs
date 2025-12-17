'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const TabPreloader = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Only preload if we're on a haartransplantatie page
    const isHaartransplantatiePage =
      pathname.includes('/haartransplantatie') ||
      pathname.includes('/hair-transplant') ||
      pathname === '/nl' ||
      pathname === '/en' ||
      pathname === '/';

    if (!isHaartransplantatiePage) return;

    // Preload all tab components after a short delay (500ms)
    const preloadTimer = setTimeout(() => {
      // Dynamic imports to preload components
      Promise.all([
        import('@/components/TreatmentsPage'),
        import('@/components/HaartransplantatieReviewsPage'),
        import('@/components/HowItWorksPage'),
        import('@/components/HaartransplantatieMissionPage'),
        import('@/components/HaartransplantatieContactPage'),
      ]).catch(() => {
        // Silent fail - preloading is optional
      });
    }, 500);

    return () => clearTimeout(preloadTimer);
  }, [pathname]);

  return null;
};
