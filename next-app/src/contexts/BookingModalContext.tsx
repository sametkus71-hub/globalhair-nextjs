'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface BookingModalContextType {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined);

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Removed auto-open effect to allow direct page access to work normally
    // without the modal overlaying the main booking page content.
    // The modal should only open via explicit user interaction (openModal).

    const openModal = useCallback(() => {
        setIsOpen(true);
        // Update URL without navigation (instant, no loading)
        const lang = pathname?.startsWith('/en') ? 'en' : 'nl';
        const path = lang === 'nl' ? '/nl/boek' : '/en/book';
        window.history.pushState({}, '', path);
    }, [pathname]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        // Go back if we pushed a booking URL
        if (pathname?.includes('/boek') || pathname?.includes('/book')) {
            router.back();
        }
    }, [pathname, router]);

    // Handle browser back button
    useEffect(() => {
        const handlePopState = () => {
            const newPath = window.location.pathname;
            if (newPath.includes('/boek') || newPath.includes('/book')) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return (
        <BookingModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
        </BookingModalContext.Provider>
    );
}

export function useBookingModal() {
    const context = useContext(BookingModalContext);
    if (!context) {
        throw new Error('useBookingModal must be used within BookingModalProvider');
    }
    return context;
}
