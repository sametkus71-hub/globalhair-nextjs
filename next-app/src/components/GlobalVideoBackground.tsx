'use client';

import { usePathname } from 'next/navigation';
import { VideoBackground } from '@/components/haartransplantatie/VideoBackground';

/**
 * GlobalVideoBackground - Persists video across all page navigations
 * 
 * Placed in root layout, this component never unmounts, preventing video restarts.
 * Controls visibility based on current route.
 */
export function GlobalVideoBackground() {
    const pathname = usePathname();

    // Define routes where video should be visible
    const videoRoutes = [
        '/nl',
        '/en',
        '/nl/boek',
        '/nl/book',
        '/en/boek',
        '/en/book',
        '/nl/haartransplantatie',
        '/en/hair-transplant',
    ];

    // Check if current route should show video
    // Also show for any sub-routes of haartransplantatie
    const shouldShowVideo = pathname && (
        videoRoutes.some(route => pathname === route) ||
        pathname.includes('/haartransplantatie') ||
        pathname.includes('/hair-transplant') ||
        pathname.includes('/boek') ||
        pathname.includes('/book') ||
        pathname.includes('/chat') ||
        pathname.includes('/berkantdural') ||
        pathname.includes('/ozlemaslan')
    );

    if (!shouldShowVideo) return null;

    return <VideoBackground className="!fixed !inset-0 !z-0" />;
}
