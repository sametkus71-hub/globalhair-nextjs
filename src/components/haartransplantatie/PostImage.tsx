import { cn } from '@/lib/utils';

interface PostImageProps {
  src?: string;
  alt: string;
  className?: string;
  overlay?: boolean;
}

export const PostImage = ({ 
  src, 
  alt, 
  className = '', 
  overlay = false 
}: PostImageProps) => {
  return (
    <div className={cn("relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg", className)}>
      {src ? (
        <img 
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        // Wireframe placeholder
        <div className="w-full h-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
          <div className="text-center text-muted-foreground/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium">{alt}</p>
          </div>
        </div>
      )}
      
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      )}
    </div>
  );
};