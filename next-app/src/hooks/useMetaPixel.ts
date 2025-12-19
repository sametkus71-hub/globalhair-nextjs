'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackStandard, trackCustom, isMetaPixelAllowed } from '@/lib/metaPixel';

export const useMetaPixel = () => {
    const pathname = usePathname();

    // Track PageView and ViewContent on route change
    useEffect(() => {
        if (!isMetaPixelAllowed()) return;

        // PageView (with deduplication per page)
        trackStandard('PageView', {}, {
            dedupeKey: `pageview_${pathname}`,
        });

        // ViewContent (Inhoud bekijken)
        trackStandard('ViewContent', {
            content_name: typeof document !== 'undefined' ? document.title : '',
            content_category: pathname.split('/')[2] || 'home',
            content_type: 'page',
        }, {
            dedupeKey: `viewcontent_${pathname}`,
        });
    }, [pathname]);

    return {
        trackCompleteRegistration: (data?: {
            value?: number;
            currency?: string;
            content_name?: string;
        }) => {
            trackStandard('CompleteRegistration', {
                value: data?.value || 0,
                currency: data?.currency || 'EUR',
                content_name: data?.content_name || 'Booking',
            });
        },

        trackCustomBooking: (data?: {
            booking_id?: string;
            treatment_type?: string;
            country?: string;
            tier?: string;
        }) => {
            trackCustom('BookingCompleted', {
                booking_id: data?.booking_id,
                treatment_type: data?.treatment_type,
                country: data?.country,
                tier: data?.tier,
                timestamp: new Date().toISOString(),
            });
        },
    };
};
