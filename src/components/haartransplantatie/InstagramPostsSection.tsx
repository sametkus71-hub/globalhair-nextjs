import { useLanguage } from '@/hooks/useLanguage';
import { useScrollContext } from '@/contexts/ScrollContext';

export const InstagramPostsSection = () => {
  const { language } = useLanguage();
  const { currentPostIndex, scrollToPost } = useScrollContext();

  const posts = [
    {
      id: 'results',
      title: language === 'nl' ? 'Natuurlijke Resultaten' : 'Natural Results',
      description: language === 'nl' 
        ? 'Onze gevorderde FUE-techniek zorgt voor natuurlijk uitziende resultaten die perfect aansluiten bij uw eigen haargroei.' 
        : 'Our advanced FUE technique ensures natural-looking results that perfectly match your own hair growth.',
      image: '/lovable-uploads/36b7add7-c0c6-4b53-a0bd-41854d1270e7.png',
    },
    {
      id: 'process',
      title: language === 'nl' ? 'Minimaal Invasieve Procedure' : 'Minimally Invasive Procedure',
      description: language === 'nl'
        ? 'Met onze moderne aanpak ervaren patiënten minimale ongemakken en een snelle hersteltijd.'
        : 'With our modern approach, patients experience minimal discomfort and fast recovery time.',
      image: '/lovable-uploads/c116d5dd-12bd-4f88-ba77-a5affdd4cdfa.png',
    },
    {
      id: 'aftercare',
      title: language === 'nl' ? 'Complete Nazorg' : 'Complete Aftercare',
      description: language === 'nl'
        ? 'Ons team staat klaar om u te begeleiden tijdens het hele herstelproces.'
        : 'Our team is ready to guide you through the entire recovery process.',
      image: '/lovable-uploads/d8eb3cb6-12d3-4e19-8d1a-70fc0bbbecb2.png',
    },
    {
      id: 'expertise',
      title: language === 'nl' ? 'Expertise & Ervaring' : 'Expertise & Experience',
      description: language === 'nl'
        ? 'Meer dan 10 jaar ervaring in haartransplantaties met duizenden tevreden patiënten.'
        : 'Over 10 years of experience in hair transplants with thousands of satisfied patients.',
      image: '/lovable-uploads/36b7add7-c0c6-4b53-a0bd-41854d1270e7.png',
    },
    {
      id: 'technology',
      title: language === 'nl' ? 'Nieuwste Technologie' : 'Latest Technology',
      description: language === 'nl'
        ? 'We gebruiken de meest geavanceerde apparatuur en technieken voor optimale resultaten.'
        : 'We use the most advanced equipment and techniques for optimal results.',
      image: '/lovable-uploads/c116d5dd-12bd-4f88-ba77-a5affdd4cdfa.png',
    },
  ];

  return (
    <>
      {posts.map((post, index) => (
        <section
          key={index}
          id={`section-${index + 1}`} // section-1, section-2, etc.
          className="snap-section min-h-screen w-full relative flex items-center justify-center bg-background"
        >
          <div className="w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 md:px-16">
            <div className="max-w-4xl w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              {/* Image */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
              
              {/* Content */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  {post.title}
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
                  {post.description}
                </p>
                
                {/* Post indicator */}
                <div className="flex justify-center lg:justify-start gap-2 mb-4">
                  {posts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToPost(i + 1)} // +1 because hero is section 0
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === currentPostIndex - 1 // -1 because hero is section 0
                          ? 'bg-primary w-8' 
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};