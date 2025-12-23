'use client';

import { useEffect, useState } from 'react';

export const DevBadge = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] bg-yellow-400 text-black px-3 py-1.5 rounded-full shadow-lg text-xs font-bold border-2 border-black animate-pulse flex flex-col items-center">
            <span>🚧 V6 DEV MODE</span>
            <span className="text-[10px] font-normal opacity-75">
                {new Date().toLocaleDateString('nl-NL')}
            </span>
        </div>
    );
};
