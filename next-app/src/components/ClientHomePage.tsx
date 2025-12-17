'use client';

import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';

const HomePage = dynamic(() => import('@/components/HomePage'), { ssr: false });

export const ClientHomePage = () => {
    return (
        <ErrorBoundary>
            <HomePage />
        </ErrorBoundary>
    );
};
