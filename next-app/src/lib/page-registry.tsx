import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Registry mapping component_key -> React Component
// Using dynamic imports to keep bundle size efficient
const registry: Record<string, ComponentType<any>> = {
    // Brand Pages
    // @ts-ignore
    'v6-hairboost': dynamic(() => import('@/app/[lang]/v6-hairboost/page')),
    // @ts-ignore
    'haartransplantatie': dynamic(() => import('@/app/[lang]/haartransplantatie/page')),

    // Core Pages
    // @ts-ignore
    'contact': dynamic(() => import('@/app/[lang]/contact/page')),
    // @ts-ignore
    'missie': dynamic(() => import('@/app/[lang]/missie/page')),
    // @ts-ignore
    'mission': dynamic(() => import('@/app/[lang]/mission/page')), // Handle both if they exist
    // @ts-ignore
    'reviews': dynamic(() => import('@/app/[lang]/reviews/page')),
    // @ts-ignore
    'boek': dynamic(() => import('@/app/[lang]/boek/page')),
    // @ts-ignore
    'book': dynamic(() => import('@/app/[lang]/book/page')),
    // @ts-ignore
    'booking-success': dynamic(() => import('@/app/[lang]/booking-success/page')),

    // Legal
    // @ts-ignore
    'privacybeleid': dynamic(() => import('@/app/[lang]/privacybeleid/page')),
    // @ts-ignore
    'algemene-voorwaarden': dynamic(() => import('@/app/[lang]/algemene-voorwaarden/page')),

    // People
    // @ts-ignore
    'berkantdural': dynamic(() => import('@/app/[lang]/berkantdural/page')),
    // @ts-ignore
    'ozlemdural': dynamic(() => import('@/app/[lang]/ozlemdural/page')),

    // Special
    // @ts-ignore
    'home': dynamic(() => import('@/app/[lang]/page')), // Root home page
};

export const getComponentForKey = (key: string): ComponentType<any> | null => {
    if (!key) return null;
    return registry[key] || registry[key.toLowerCase()] || null;
};

export const AVAILABLE_COMPONENTS = Object.keys(registry).sort();
