'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '@/assets/loader-animation.json';

export const SplashLoader = () => {
    // Start with null to prevent hydration mismatch (we need to check window.sessionStorage)
    const [stage, setStage] = useState<'loading' | 'exiting' | 'complete' | null>(null);

    useEffect(() => {
        // Check if we've already shown the splash in this session
        const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

        if (hasSeenSplash) {
            setStage('complete');
            return;
        }

        // Determine if it's mobile for duration adjustment if needed, 
        // but for now we'll just show it.
        setStage('loading');

        // Minimum display time to ensure user sees the animation
        // The animation itself might loop, so we'll enforce a duration or wait for a specific frame if we could.
        // user said "show the lotie animation once". Lottie-react has onComplete if loop={false}.

    }, []);

    const handleAnimationComplete = () => {
        // Start exit sequence
        setStage('exiting');

        // Mark as seen
        sessionStorage.setItem('hasSeenSplash', 'true');

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
                    lottieRef={(ref) => {
                        if (ref) ref.setSpeed(1.5);
                    }}
                    animationData={loaderAnimation}
                    loop={false}
                    autoPlay={true}
                    onComplete={handleAnimationComplete}
                />
            </div>
        </div>
    );
};
