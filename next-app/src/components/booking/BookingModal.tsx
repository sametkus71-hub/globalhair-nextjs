'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BookingWizard } from './BookingWizard';
import { useLanguage } from '@/hooks/useLanguage';

export const BookingModal = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const { language } = useLanguage();

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
            router.back();
        }, 350);
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                        style={{ willChange: 'opacity' }}
                    />

                    {/* Modal Panel */}
                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{
                            type: 'tween',
                            duration: 0.35,
                            ease: [0.32, 0.72, 0, 1] // Custom iOS-like easing
                        }}
                        className="relative w-full max-w-lg h-[85vh] sm:h-[90vh] bg-[#0A0A0A] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
                            <span className="text-white font-medium text-sm">
                                {language === 'nl' ? 'Boek een afspraak' : 'Book an appointment'}
                            </span>
                            <button
                                onClick={handleClose}
                                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                            <BookingWizard />
                        </div>

                        {/* Safe Area Spacer for Mobile */}
                        <div className="h-6 shrink-0 sm:hidden" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
