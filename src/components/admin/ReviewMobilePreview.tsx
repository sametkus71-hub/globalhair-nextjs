import { useState, useEffect } from 'react';
import { Review, ReviewType } from '@/types/review';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Eye, Star } from 'lucide-react';

interface ReviewMobilePreviewProps {
  formData: {
    review_type: ReviewType;
    name: string;
    description: string;
    behandeling: string;
    video_url: string;
    before_image_url: string;
    after_image_url: string;
    static_image_url: string;
    is_visible: boolean;
    is_featured: boolean;
  };
}

export function ReviewMobilePreview({ formData }: ReviewMobilePreviewProps) {
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  
  // Reset errors when review type or URLs change
  useEffect(() => {
    setImageError({});
  }, [formData.review_type, formData.video_url, formData.before_image_url, formData.after_image_url, formData.static_image_url]);
  
  const renderContent = () => {
    switch (formData.review_type) {
      case 'video':
        return (
          <div key="video-preview" className="w-full h-full bg-muted flex items-center justify-center p-4">
            {formData.video_url ? (
              <video
                key={formData.video_url}
                src={formData.video_url}
                controls
                className="w-full h-full object-cover rounded-[1px]"
              />
            ) : (
              <div className="text-center text-muted-foreground text-xs">
                Voeg een video URL toe om preview te zien
              </div>
            )}
          </div>
        );

      case 'before_after':
        return (
          <div key="before-after-preview" className="w-full h-full bg-muted flex gap-1">
            <div className="flex-1 relative">
              {formData.before_image_url && !imageError['before'] ? (
                <img
                  key={formData.before_image_url}
                  src={encodeURI(formData.before_image_url)}
                  alt="Voor"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(prev => ({...prev, before: true}))}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-muted-foreground p-2 text-center">
                  {imageError['before'] ? 'Ongeldige URL' : 'Voor foto URL'}
                </div>
              )}
              <div className="absolute top-2 left-2 bg-background/80 px-2 py-0.5 rounded-[1px] text-[10px]">
                Voor
              </div>
            </div>
            <div className="flex-1 relative">
              {formData.after_image_url && !imageError['after'] ? (
                <img
                  key={formData.after_image_url}
                  src={encodeURI(formData.after_image_url)}
                  alt="Na"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(prev => ({...prev, after: true}))}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-muted-foreground p-2 text-center">
                  {imageError['after'] ? 'Ongeldige URL' : 'Na foto URL'}
                </div>
              )}
              <div className="absolute top-2 left-2 bg-background/80 px-2 py-0.5 rounded-[1px] text-[10px]">
                Na
              </div>
            </div>
          </div>
        );

      case 'static_image':
        return (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            {formData.static_image_url ? (
              <img
                key={formData.static_image_url}
                src={formData.static_image_url}
                alt="Review"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.innerHTML = '<div class="flex items-center justify-center h-full text-xs text-muted-foreground">Ongeldige foto URL</div>';
                }}
              />
            ) : (
              <div className="text-center text-muted-foreground text-xs p-4">
                Voeg een foto URL toe om preview te zien
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex items-start justify-center bg-muted/30 p-8">
      {/* iPhone mockup */}
      <div className="relative" style={{ width: '280px' }}>
        {/* Phone frame */}
        <div className="bg-background rounded-[28px] shadow-2xl border-[8px] border-foreground/10 overflow-hidden">
          {/* Notch */}
          <div className="h-6 bg-foreground/10 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-background rounded-b-2xl" />
          </div>

          {/* Screen content */}
          <div className="bg-background">
            <AspectRatio ratio={9 / 16}>
              <div className="w-full h-full flex flex-col">
                {/* Media content */}
                <div className="flex-1 relative">
                  {renderContent()}
                  
                  {/* Badges overlay */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {formData.is_featured && (
                      <Badge variant="secondary" className="bg-blue-900 text-white text-[10px] h-5 px-1.5">
                        <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                        Featured
                      </Badge>
                    )}
                    {!formData.is_visible && (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px] h-5 px-1.5">
                        <Eye className="w-2.5 h-2.5 mr-0.5" />
                        Verborgen
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Info overlay with scrollable description */}
                <div className="bg-gradient-to-t from-background via-background/95 to-transparent p-3 space-y-1 max-h-[40%] overflow-y-auto">
                  <h3 className="font-semibold text-sm text-foreground">
                    {formData.name || 'Naam van review'}
                  </h3>
                  {formData.behandeling && (
                    <p className="text-[10px] text-blue-900 font-medium uppercase tracking-wide">
                      {formData.behandeling}
                    </p>
                  )}
                  <div 
                    className="text-xs text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: formData.description || '<p class="text-muted-foreground">Beschrijving van de review...</p>' 
                    }}
                  />
                </div>
              </div>
            </AspectRatio>
          </div>

          {/* Home indicator */}
          <div className="h-5 bg-background flex items-center justify-center">
            <div className="w-24 h-1 bg-foreground/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
