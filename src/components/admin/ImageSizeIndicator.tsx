import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageSizeIndicatorProps {
  url: string | null;
  className?: string;
}

export const ImageSizeIndicator = ({ url, className }: ImageSizeIndicatorProps) => {
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
  
  const colorClass = sizeInKB > 750 
    ? 'text-red-500' 
    : sizeInKB > 500 
    ? 'text-orange-500' 
    : 'text-muted-foreground';

  return (
    <span className={cn('text-[9px] font-mono', colorClass, className)}>
      {displaySize}
    </span>
  );
};
