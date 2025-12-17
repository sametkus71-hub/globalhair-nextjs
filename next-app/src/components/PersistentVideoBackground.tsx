'use client';

import { usePathname } from 'next/navigation';
import { VideoBackground } from '@/components/haartransplantatie/VideoBackground';

export function PersistentVideoBackground() {
  const pathname = usePathname();

  // Show video background on these routes
  const showVideo = pathname?.includes('/nl') || pathname?.includes('/en') || pathname?.includes('/book') || pathname?.includes('/boek');

  if (!showVideo) return null;

  return <VideoBackground className="!fixed !inset-0 !z-0" />;
}
