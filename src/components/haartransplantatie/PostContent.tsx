import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Heart, Bookmark, Share } from 'lucide-react';

interface PostContentProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  showInteractions?: boolean;
}

export const PostContent = ({ 
  title, 
  description, 
  children, 
  className = '',
  showInteractions = true
}: PostContentProps) => {
  return (
    <div className={cn("p-6 md:p-8 bg-background", className)}>
      {/* Post Header - Instagram style */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">GlobalHair Clinic</p>
            <p className="text-xs text-muted-foreground">Professional Hair Clinic</p>
          </div>
        </div>
        <button className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {title}
        </h2>
        
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          {description}
        </p>

        {children}
      </div>

      {/* Instagram-style Interactions */}
      {showInteractions && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6" />
                <span className="text-sm font-medium">1,234</span>
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Share className="w-6 h-6" />
              </button>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Bookmark className="w-6 h-6" />
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">globalhair_clinic</span> Professional hair restoration with natural results. Schedule your consultation today!
          </p>
        </div>
      )}
    </div>
  );
};