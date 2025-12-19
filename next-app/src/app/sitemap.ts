import { MetadataRoute } from 'next';

const BASE_URL = 'https://globalhair.institute';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/nl',
        '/en',
        '/nl/haartransplantatie',
        '/en/hair-transplant',
        '/nl/haartransplantatie/missie',
        '/en/mission',
        '/nl/haartransplantatie/reviews',
        '/en/hair-transplant/reviews',
        '/nl/haartransplantatie/contact',
        '/en/contact',
        '/nl/ozlemdural',
        '/en/ozlemdural',
        '/nl/berkantdural',
        '/en/berkantdural',
        '/nl/boek',
        '/en/book',
    ];

    return routes.map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' || route === '/nl' || route === '/en' ? 1 : 0.8,
    }));
}
