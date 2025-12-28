'use client';

import { useEffect, useState, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import loaderAnimation from '@/assets/loader-animation.json';

export const SplashLoader = () => {
    // Start with null to prevent hydration mismatch (we need to check window.sessionStorage)
    const [stage, setStage] = useState<'loading' | 'exiting' | 'complete' | null>(null);
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        // Cleanup the instant splash screen from layout.tsx
        const instantSplash = document.getElementById('instant-splash');

        // Check if we've already shown the splash in this session
        // Use try-catch to handle incognito mode or restricted storage access
        try {
            const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

            if (hasSeenSplash) {
                setStage('complete');
                if (instantSplash) instantSplash.style.display = 'none';
                return;
            }
        } catch (error) {
            console.warn('Storage access restricted', error);
        }

        // Slight delay to ensure Lottie is ready before fading out static splash
        if (instantSplash) {
            setTimeout(() => {
                instantSplash.style.opacity = '0';
                setTimeout(() => instantSplash.remove(), 500);
            }, 100);
        }

        setStage('loading');
    }, []);

    // Set speed when component mounts/updates if ref is available
    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(1.5);
        }
    }, [stage]);

    const handleAnimationComplete = () => {
        // Start exit sequence
        setStage('exiting');

        // Mark as seen
        sessionStorage.setItem('hasSeenSplash', 'true');

        // Dispatch splash complete event
        window.dispatchEvent(new CustomEvent('splashComplete'));

        // Allow exit animation to play out
        setTimeout(() => {
            setStage('complete');
        }, 800); // Matches the transition duration below
    };

    if (stage === 'complete' || stage === null) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0C1B2A] transition-all duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)]
        ${stage === 'exiting' ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}
      `}
        >
            <div className="w-64 h-64 md:w-96 md:h-96">
                <Lottie
                    lottieRef={lottieRef}
                    animationData={loaderAnimation}
                    loop={false}
                    autoPlay={true}
                    onComplete={handleAnimationComplete}
                />
            </div>
        </div>
    );
};
