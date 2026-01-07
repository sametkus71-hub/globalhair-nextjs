import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = ['/nl', '/en'].every(
        (locale) => !pathname.startsWith(locale) && pathname !== locale
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        // Exclude internal paths, api, and static files
        if (
            pathname.startsWith('/_next') ||
            pathname.startsWith('/api') ||
            pathname.startsWith('/admin') || // Exclude admin routes
            pathname.includes('.') || // Files like favicon.ico, sitemap.xml
            pathname === '/robots.txt' ||
            pathname === '/sitemap.xml'
        ) {
            return;
        }

        const locale = 'nl'; // Default locale
        return NextResponse.redirect(
            new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
        );
    }
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next).*)',
        // Optional: only run on root (/)
        // '/'
    ],
};
