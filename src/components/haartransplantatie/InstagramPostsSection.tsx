import { useLanguage } from '@/hooks/useLanguage';
import { useScrollContext } from '@/contexts/ScrollContext';
import { ChevronRight } from 'lucide-react';

export const InstagramPostsSection = () => {
  const { language } = useLanguage();
  const { currentPostIndex, scrollToPost } = useScrollContext();

  const posts = [
    {
      id: 'results',
      title: language === 'nl' ? 'Transformatie' : 'Transformation',
      subtitle: language === 'nl' ? 'Voorbeelden' : 'Examples',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: '/lovable-uploads/9a5567ac-b6d3-4a0b-98db-aefd6f1d3e21.png',
    },
    {
      id: 'procedure',
      title: language === 'nl' ? 'Precisie Techniek' : 'Precision Technique',
      subtitle: language === 'nl' ? 'Procedure' : 'Procedure',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: '/lovable-uploads/ea501157-5b9d-400b-ad68-e4172e38bb56.png',
    },
    {
      id: 'consultation',
      title: language === 'nl' ? 'Professionele Analyse' : 'Professional Analysis',
      subtitle: language === 'nl' ? 'Consultatie' : 'Consultation',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      image: '/lovable-uploads/a593ff6b-3d96-407a-a55c-598bbc56df9b.png',
    },
    {
      id: 'contact',
      title: 'GlobalHair',
      subtitle: language === 'nl' ? 'Contact' : 'Contact',
      description: language === 'nl' 
        ? 'Ontdek wat GlobalHair voor u kan betekenen. Onze experts staan klaar voor een persoonlijk gesprek over uw mogelijkheden.'
        : 'Discover what GlobalHair can do for you. Our experts are ready for a personal consultation about your possibilities.',
      image: '/lovable-uploads/96425c30-bd66-43e5-be1c-2102821e76f1.png',
      isContact: true,
    },
  ];

  return (
    <>
      {posts.map((post, index) => (
        <section
          key={index}
          id={`section-${index + 1}`} // section-1, section-2, etc.
          className="snap-section min-h-screen w-full relative flex flex-col"
        >
          {/* Large Image - fixed height for consistency */}
          <div className="h-[70vh] w-full overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          {/* Content Section - fixed height for consistency */}
          <div className="h-[30vh] w-full bg-white px-6 py-6 pb-32 flex flex-col justify-between">
            <div>
              {/* Subtitle - small elegant text */}
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                {post.subtitle}
              </p>
              
              {/* Main Title - refined typography */}
              <h1 className="text-xl font-semibold text-foreground mb-4 leading-tight">
                {post.title}
              </h1>
              
              {/* Description - smaller, elegant */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {post.description}
              </p>
            </div>

            {/* Contact CTA - only for last item, positioned at bottom */}
            {post.isContact && (
              <button className="group inline-flex items-center text-sm text-foreground hover:text-primary transition-colors duration-200 self-start">
                <span className="border-b border-current">
                  {language === 'nl' ? 'Neem contact op' : 'Get in touch'}
                </span>
                <ChevronRight className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </section>
      ))}
    </>
  );
};