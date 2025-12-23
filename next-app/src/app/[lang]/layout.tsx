'use client';

import { useMetaPixel } from '@/hooks/useMetaPixel';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Automatically track PageView and ViewContent on every page navigation
    useMetaPixel();

    return (
        <>
            {children}
        </>
    );
}
