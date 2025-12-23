'use client';

import { useEffect, useState } from 'react';

export const DevBadge = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] font-mono text-[10px] leading-tight flex flex-col items-end gap-1 opacity-80 hover:opacity-100 transition-opacity">
            <div className="bg-black text-green-400 px-3 py-1.5 rounded border border-green-900 shadow-xl flex flex-col items-start gap-0.5">
                <span className="font-bold uppercase tracking-wider">⚡ V6-Hairboost Branch</span>
                <span className="text-gray-400">
                    Latest Push: 23 Dec • 15:17
                </span>
            </div>
        </div>
    );
};
