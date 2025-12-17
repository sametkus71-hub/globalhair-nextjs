'use client';

import { HaartransplantatieLayout } from '@/components/haartransplantatie/HaartransplantatieLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <HaartransplantatieLayout>
            {children}
        </HaartransplantatieLayout>
    );
}
