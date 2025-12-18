'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const ReviewsSkeleton = () => {
    const isMobile = useIsMobile();

    // Create a pseudo-random layout that mimics the real grid
    // We'll create a fixed pattern of items for the skeleton
    const skeletonItems = [
        { width: 1, height: 2 }, // Tall item
        { width: 1, height: 1 },
        { width: 2, height: 1 }, // Wide item
        { width: 1, height: 1 },
        { width: 1, height: 1 },
        { width: 1, height: 1 },
        { width: 2, height: 2 }, // Big item
        { width: 1, height: 1 },
        { width: 1, height: 1 },
        { width: 1, height: 1 },
        { width: 1, height: 2 },
        { width: 2, height: 1 },
    ];

    return (
        <div className="relative w-full overflow-hidden">
            <div
                className="grid grid-rows-3 animate-pulse"
                style={{
                    height: isMobile ? '370px' : '540px',
                    gridAutoColumns: isMobile ? '120px' : '175px',
                    gridAutoFlow: 'column dense',
                    gap: isMobile ? '5px' : '7.5px',
                    backgroundColor: 'transparent'
                }}
            >
                {skeletonItems.map((item, index) => (
                    <div
                        key={index}
                        className={cn(
                            "glass-skeleton-item rounded-xl relative overflow-hidden",
                            item.width === 2 && "col-span-2",
                            item.height === 2 && "row-span-2"
                        )}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            ...(item.width === 2 && { gridColumn: 'span 2' }),
                            ...(item.height === 2 && { gridRow: 'span 2' })
                        }}
                    >
                        {/* Shimmer effect */}
                        <div
                            className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)'
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
