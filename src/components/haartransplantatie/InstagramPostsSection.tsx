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
          className="snap-section min-h-screen w-full relative flex flex-col bg-white"
        >
          {/* Large Image */}
          <div className="flex-1 w-full bg-gray-100 flex items-center justify-center">
            <div className="w-full h-full min-h-[60vh] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              {/* Wireframe placeholder with X */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-2 border-gray-400 rounded"></div>
                <div className="absolute inset-2 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gray-400 rotate-45"></div>
                  <div className="absolute w-full h-0.5 bg-gray-400 -rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="w-full bg-white px-6 py-8">
            <div className="max-w-2xl">
              {/* Header */}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {post.title}
              </h2>
              
              {/* Sub Header */}
              <h3 className="text-lg sm:text-xl text-gray-600 mb-4 font-medium">
                {language === 'nl' ? 'Behandeling' : 'Treatment'}
              </h3>
              
              {/* Description */}
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                {post.description}
              </p>
              
              {/* Post indicator */}
              <div className="flex gap-2">
                {posts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToPost(i + 1)} // +1 because hero is section 0
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentPostIndex - 1 // -1 because hero is section 0
                        ? 'bg-gray-800 w-6' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};