import { useLanguage } from '@/hooks/useLanguage';

interface ImageTextLayoutProps {
  imagePlaceholder?: string;
  title: string;
  description: string;
  imagePosition?: 'left' | 'right';
  className?: string;
}

export const ImageTextLayout2 = ({ 
  imagePlaceholder = "https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=Coming+Soon",
  title,
  description,
  imagePosition = 'left',
  className = ''
}: ImageTextLayoutProps) => {
  const { language } = useLanguage();

  const isImageLeft = imagePosition === 'left';

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen ${className}`}>
      {/* Image Section - 3/4 */}
      <div className={`lg:w-3/4 h-64 lg:h-screen relative overflow-hidden ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
        <img 
          src={imagePlaceholder}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for better text readability when needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
      </div>

      {/* Text Section - 1/4 */}
      <div className={`lg:w-1/4 flex flex-col justify-center p-8 lg:p-12 bg-background ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="max-w-prose">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
            {title}
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-8">
            {description}
          </p>
          
          {/* CTA Button */}
          <button className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium">
            {language === 'nl' ? 'Meer informatie' : 'Learn more'}
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};