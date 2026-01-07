import { lazy } from 'react';

// Map of slug segments or identifiers to React Components
// This allows us to map a DB page like "nl/haartransplantatie" to a specific React Component
// In the future, this could be stored in the DB as a 'template_id' field.

type ComponentMap = Record<string, React.LazyExoticComponent<any>>;

// Lazy load components to optimize bundle size
const HomePage = lazy(() => import('@/components/HomePage'));
const ContactPage = lazy(() => import('@/components/ContactPage'));
// Add other mappings as we migrate them...

export const PAGE_REGISTRY: ComponentMap = {
    'home': HomePage,
    'contact': ContactPage,
};

/**
 * Resolves which component to render based on the slug.
 * This is a heuristic mapping for now, to support the legacy pages.
 */
export function getComponentForSlug(slug: string): React.LazyExoticComponent<any> | null {
    // Normalization
    const normalizedSlug = slug.toLowerCase();

    // 1. Exact matches (for core pages)
    if (normalizedSlug === '' || normalizedSlug === 'nl' || normalizedSlug === 'en') {
        return HomePage;
    }
    if (normalizedSlug.endsWith('/contact')) {
        return ContactPage;
    }

    // TODO: Add more heuristics or explicit DB mapping here
    // e.g., if (slug.includes('haartransplantatie')) return HaartransplantatiePage;

    return null;
}
