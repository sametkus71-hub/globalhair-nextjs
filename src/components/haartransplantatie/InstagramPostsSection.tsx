import { useLanguage } from '@/hooks/useLanguage';
import { useInstagramScroll } from '@/hooks/useInstagramScroll';
import { InstagramPost } from './InstagramPost';
import { PostImage } from './PostImage';
import { PostContent } from './PostContent';
import { PostNavigation } from './PostNavigation';
import { BookingPost } from './BookingPost';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Users, Award } from 'lucide-react';

export const InstagramPostsSection = () => {
  const { language } = useLanguage();
  const totalPosts = 6; // 5 content posts + 1 booking post
  
  const { 
    currentPost, 
    nextPost, 
    canGoNext,
    isScrolling 
  } = useInstagramScroll({ 
    postCount: totalPosts,
    onPostChange: (postIndex) => {
      console.log(`Switched to post ${postIndex + 1}`);
    }
  });

  const posts = [
    {
      id: 'natural-results',
      title: language === 'nl' ? 'Natuurlijke Resultaten' : 'Natural Results',
      description: language === 'nl' 
        ? 'Onze gevorderde FUE-techniek zorgt voor natuurlijk uitziende resultaten die perfect aansluiten bij uw eigen haargroei. Elke follikel wordt zorgvuldig geplaatst voor optimale dichtheid en richting.'
        : 'Our advanced FUE technique ensures natural-looking results that perfectly match your own hair growth. Each follicle is carefully placed for optimal density and direction.',
      features: [
        language === 'nl' ? '95% succespercentage' : '95% success rate',
        language === 'nl' ? 'Natuurlijke haarlijn' : 'Natural hairline',
        language === 'nl' ? 'Permanente resultaten' : 'Permanent results'
      ]
    },
    {
      id: 'minimally-invasive',
      title: language === 'nl' ? 'Minimaal Invasieve Procedure' : 'Minimally Invasive Procedure',
      description: language === 'nl'
        ? 'Met onze moderne aanpak ervaren patiënten minimale ongemakken en een snelle hersteltijd. De procedure wordt uitgevoerd onder lokale verdoving in een comfortabele, steriele omgeving.'
        : 'With our modern approach, patients experience minimal discomfort and fast recovery time. The procedure is performed under local anesthesia in a comfortable, sterile environment.',
      features: [
        language === 'nl' ? 'Geen littekens' : 'No scarring',
        language === 'nl' ? '1-3 dagen herstel' : '1-3 days recovery',
        language === 'nl' ? 'Lokale verdoving' : 'Local anesthesia'
      ]
    },
    {
      id: 'expert-team',
      title: language === 'nl' ? 'Expert Team' : 'Expert Team',
      description: language === 'nl'
        ? 'Ons team van gecertificeerde specialisten heeft meer dan 15 jaar ervaring in haartransplantatie. We blijven ons ontwikkelen met de nieuwste technieken en technologieën.'
        : 'Our team of certified specialists has over 15 years of experience in hair transplantation. We continue to evolve with the latest techniques and technologies.',
      features: [
        language === 'nl' ? '15+ jaar ervaring' : '15+ years experience',
        language === 'nl' ? 'Internationale certificering' : 'International certification',
        language === 'nl' ? '5000+ behandelingen' : '5000+ treatments'
      ]
    },
    {
      id: 'patient-care',
      title: language === 'nl' ? 'Complete Nazorg' : 'Complete Aftercare',
      description: language === 'nl'
        ? 'Ons team staat klaar om u te begeleiden tijdens het hele herstelproces. Van de eerste controle tot de langetermijnresultaten, we zorgen ervoor dat u optimale resultaten behaalt.'
        : 'Our team is ready to guide you through the entire recovery process. From the first check-up to long-term results, we ensure you achieve optimal outcomes.',
      features: [
        language === 'nl' ? '24/7 ondersteuning' : '24/7 support',
        language === 'nl' ? 'Gratis controles' : 'Free check-ups',
        language === 'nl' ? '12 maanden nazorg' : '12 months aftercare'
      ]
    },
    {
      id: 'success-stories',
      title: language === 'nl' ? 'Succesverhalen' : 'Success Stories',
      description: language === 'nl'
        ? 'Duizenden tevreden patiënten hebben hun zelfvertrouwen teruggekregen. Lees hun verhalen en zie de transformaties die mogelijk zijn met onze expertise.'
        : 'Thousands of satisfied patients have regained their confidence. Read their stories and see the transformations possible with our expertise.',
      features: [
        language === 'nl' ? '98% tevredenheid' : '98% satisfaction',
        language === 'nl' ? '5-sterren reviews' : '5-star reviews',
        language === 'nl' ? 'Internationale patiënten' : 'International patients'
      ]
    }
  ];

  return (
    <div className="relative">
      {/* Content Posts */}
      {posts.map((post, index) => (
        <InstagramPost 
          key={post.id} 
          postIndex={index} 
          isActive={currentPost === index}
          className="px-6 py-12"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image Section */}
              <div className={index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
                <PostImage 
                  alt={post.title}
                  className="h-80 lg:h-96"
                  overlay={true}
                />
              </div>

              {/* Content Section */}
              <div className={index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}>
                <PostContent 
                  title={post.title}
                  description={post.description}
                  showInteractions={false}
                  className="p-0"
                >
                  {/* Features List */}
                  <div className="space-y-3 mt-6">
                    {post.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <Button 
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                    >
                      {language === 'nl' ? 'Meer Informatie' : 'Learn More'}
                    </Button>
                  </div>
                </PostContent>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex justify-center">
              <PostNavigation
                currentPost={currentPost}
                totalPosts={totalPosts}
                onNext={nextPost}
                canGoNext={canGoNext}
                className="max-w-sm"
              />
            </div>
          </div>
        </InstagramPost>
      ))}

      {/* Final Booking Post */}
      <BookingPost 
        postIndex={totalPosts - 1} 
        isActive={currentPost === totalPosts - 1}
      />

      {/* Scroll Progress Indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:block">
        <div className="flex flex-col space-y-3">
          {Array.from({ length: totalPosts }, (_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-all duration-300 ${
                index === currentPost 
                  ? 'bg-primary' 
                  : index < currentPost 
                    ? 'bg-primary/50' 
                    : 'bg-muted-foreground/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};