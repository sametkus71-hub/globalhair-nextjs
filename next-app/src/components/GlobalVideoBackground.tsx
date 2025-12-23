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
        pathname.includes('/ozlemdural')
    );

    if (!shouldShowVideo) return null;

    return (
        <div className="fixed inset-0 w-full overflow-hidden z-0" style={{ height: 'var(--initial-height, 100vh)', maxHeight: 'var(--initial-height, 100vh)' }}>
            <VideoBackground className="!fixed !inset-x-0 !top-0 !h-[var(--initial-height,100vh)] !z-0 object-cover" />
        </div>
    );
}
