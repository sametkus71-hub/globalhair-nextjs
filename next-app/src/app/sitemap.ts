import { MetadataRoute } from 'next';

const BASE_URL = 'https://globalhair.institute';

export default function sitemap(): MetadataRoute.Sitemap {
    // Core routes that exist for both languages
    const commonRoutes = [
        '', // Root
        '/contact',
        '/berkantdural',
        '/ozlemdural',
        '/reviews',
        '/chat',
        '/booking-success',
    ];

    // Specific localized routes (folder names)
    const nlRoutes = [
        ...commonRoutes,
        '/missie',
        '/boek',
        // Haartransplantatie structure (Dutch focused)
        '/haartransplantatie',
        '/haartransplantatie/reviews',
        '/haartransplantatie/contact',
        '/haartransplantatie/mission',
        '/haartransplantatie/how',
        // Package Tiers (NL)
        '/haartransplantatie/nl/standard',
        '/haartransplantatie/nl/premium',
        '/haartransplantatie/nl/elite',
        // Package Tiers (TR)
        '/haartransplantatie/tr/standard',
        '/haartransplantatie/tr/premium',
        '/haartransplantatie/tr/elite',
    ];

    const enRoutes = [
        ...commonRoutes,
        '/mission',
        '/book',
        // Assuming haartransplantatie is also accessible in EN or has EN equivalent structure
        // If 'hair-transplant' folder doesn't exist, we fallback to valid folders or omit.
        // Based on filesystem, only 'haartransplantatie' exists.
        '/haartransplantatie',
        '/haartransplantatie/reviews',
        '/haartransplantatie/contact',
        '/haartransplantatie/mission',
        '/haartransplantatie/how',
        // Package Tiers
        '/haartransplantatie/nl/standard',
        '/haartransplantatie/nl/premium',
        '/haartransplantatie/nl/elite',
        '/haartransplantatie/tr/standard',
        '/haartransplantatie/tr/premium',
        '/haartransplantatie/tr/elite',
    ];

    const entries: MetadataRoute.Sitemap = [];

    // Add NL routes
    nlRoutes.forEach(route => {
        entries.push({
            url: `${BASE_URL}/nl${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: route === '' ? 1 : 0.8,
        });
    });

    // Add EN routes
    enRoutes.forEach(route => {
        entries.push({
            url: `${BASE_URL}/en${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: route === '' ? 1 : 0.8,
        });
    });

    // Add root redirect
    entries.push({
        url: `${BASE_URL}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
    });

    return entries;
}
