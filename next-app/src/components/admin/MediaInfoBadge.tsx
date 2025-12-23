'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface MediaInfoBadgeProps {
    url: string | null;
    type: 'image' | 'video';
}

export const MediaInfoBadge = ({ url, type }: MediaInfoBadgeProps) => {
    const [size, setSize] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!url) {
            setSize(null);
            return;
        }

        const fetchSize = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, { method: 'HEAD' });
                const contentLength = response.headers.get('content-length');
                if (contentLength) {
                    setSize(parseInt(contentLength, 10));
                }
            } catch (error) {
                console.error('Failed to fetch media size:', error);
                setSize(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSize();
    }, [url]);

    if (!url) {
        return <span className="text-[10px] text-muted-foreground">No media</span>;
    }

    if (loading) {
        return <span className="text-[10px] text-muted-foreground">...</span>;
    }

    // Extract extension from URL
    const getExtension = (url: string): string => {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const ext = pathname.split('.').pop()?.toLowerCase() || '';
            return ext;
        } catch {
            return '';
        }
    };

    const extension = getExtension(url);

    // Check if extension is optimal
    const isOptimalExtension = type === 'video'
        ? extension === 'webm'
        : extension === 'webp';

    // Calculate size
    const sizeInKB = size ? Math.round(size / 1024) : null;
    const sizeInMB = size ? (size / (1024 * 1024)).toFixed(1) : null;

    const displaySize = sizeInKB && sizeInKB > 1024
        ? `${sizeInMB}MB`
        : sizeInKB
            ? `${sizeInKB}KB`
            : '?';

    // Determine warning state based on size
    const isSizeWarning = type === 'video'
        ? (sizeInKB && sizeInKB > 5120) // > 5MB for video
        : (sizeInKB && sizeInKB > 500);  // > 500KB for images

    const hasWarning = !isOptimalExtension || isSizeWarning;

    return (
        <div className="flex flex-col gap-0.5">
            <Badge
                variant="outline"
                className={cn(
                    "text-[9px] px-1.5 py-0 h-4 font-mono rounded-[1px]",
                    hasWarning
                        ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                        : "bg-green-50 border-green-300 text-green-700"
                )}
            >
                {displaySize}
            </Badge>
            <Badge
                variant="outline"
                className={cn(
                    "text-[9px] px-1.5 py-0 h-4 font-mono rounded-[1px] uppercase",
                    !isOptimalExtension
                        ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                        : "bg-gray-50 border-gray-300 text-gray-600"
                )}
            >
                {extension || '?'}
            </Badge>
        </div>
    );
};
