import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageSizeIndicatorProps {
  url: string | null;
  className?: string;
  type?: 'image' | 'video';
}

export const ImageSizeIndicator = ({ url, className, type = 'image' }: ImageSizeIndicatorProps) => {
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
        console.error('Failed to fetch image size:', error);
        setSize(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSize();
  }, [url]);

  if (!url || loading || size === null) {
    return null;
  }

  const sizeInKB = Math.round(size / 1024);
  const sizeInMB = (size / (1024 * 1024)).toFixed(2);
  
  const displaySize = sizeInKB > 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`;
  
  // Different thresholds for video vs image
  const colorClass = type === 'video'
    ? sizeInKB > 2048 // 2 MB for video
      ? 'text-red-500'
      : sizeInKB > 1024 // 1 MB for video
      ? 'text-orange-500'
      : 'text-muted-foreground'
    : sizeInKB > 750 // 750 KB for images
      ? 'text-red-500' 
      : sizeInKB > 500 // 500 KB for images
      ? 'text-orange-500' 
      : 'text-muted-foreground';

  return (
    <span className={cn('text-[9px] font-mono', colorClass, className)}>
      {displaySize}
    </span>
  );
};
