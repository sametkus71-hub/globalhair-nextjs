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
        // Direct navigation to the booking page instead of opening a modal
        const lang = pathname?.startsWith('/en') ? 'en' : 'nl';
        const path = lang === 'nl' ? '/nl/boek' : '/en/book';
        // USE HARD NAV to ensure clean load as requested
        window.location.href = path;
    }, [pathname]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        // Go back if we pushed a booking URL
        if (pathname?.includes('/boek') || pathname?.includes('/book')) {
            router.back();
        }
    }, [pathname, router]);

    // Handle browser back button - REMOVED POPSTATE LISTENER
    // We strictly use page navigation now, no modal state management needed.
    useEffect(() => {
        // Logic cleared to prevent accidental modal triggers
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
