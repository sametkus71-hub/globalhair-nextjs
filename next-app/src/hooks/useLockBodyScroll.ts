import { useLayoutEffect } from 'react';

export const useLockBodyScroll = (enable: boolean = true) => {
    useLayoutEffect(() => {
        if (!enable) return;

        // Save original styles
        const originalStyle = {
            overflow: document.body.style.overflow,
            position: document.body.style.position,
            width: document.body.style.width,
            height: document.body.style.height,
            maxHeight: document.body.style.maxHeight,
            top: document.body.style.top,
            left: document.body.style.left,
            right: document.body.style.right,
            bottom: document.body.style.bottom,
            htmlOverflow: document.documentElement.style.overflow,
            htmlHeight: document.documentElement.style.height,
            htmlMaxHeight: document.documentElement.style.maxHeight,
        };

        // Aggressive Locking
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = 'var(--initial-height, 100vh)';
        document.body.style.maxHeight = 'var(--initial-height, 100vh)';
        document.body.style.top = '0';
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.bottom = '0';

        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.height = 'var(--initial-height, 100vh)';
        document.documentElement.style.maxHeight = 'var(--initial-height, 100vh)';

        // Prevent scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Prevent touch move except in allowed containers
        const preventScroll = (e: TouchEvent) => {
            const target = e.target as HTMLElement;
            // Allow scrolling in elements with class 'scrollable-content'
            // or if the element itself is scrollable (has overflow-y: auto)
            // But checking computed style is expensive on scroll.
            // Best to use a marker class like 'overflow-y-auto' or explicit 'scrollable-content'
            if (!target.closest('.overflow-y-auto') && !target.closest('.scrollable-content')) {
                e.preventDefault();
            }
        };

        document.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            // Restore styles
            document.body.style.overflow = originalStyle.overflow;
            document.body.style.position = originalStyle.position;
            document.body.style.width = originalStyle.width;
            document.body.style.height = originalStyle.height;
            document.body.style.maxHeight = originalStyle.maxHeight;
            document.body.style.top = originalStyle.top;
            document.body.style.left = originalStyle.left;
            document.body.style.right = originalStyle.right;
            document.body.style.bottom = originalStyle.bottom;

            document.documentElement.style.overflow = originalStyle.htmlOverflow;
            document.documentElement.style.height = originalStyle.htmlHeight;
            document.documentElement.style.maxHeight = originalStyle.htmlMaxHeight;

            document.removeEventListener('touchmove', preventScroll);
        };
    }, [enable]);
};
