import { useLanguage } from '@/hooks/useLanguage';
import { ContentSection } from './ContentSection';
import { ImageTextLayout } from './ImageTextLayout';

export const NewContentSection = () => {
  const { language } = useLanguage();

  const contentData = [
    {
      id: 'results',
      title: language === 'nl' ? 'Natuurlijke Resultaten' : 'Natural Results',
      description: language === 'nl' 
        ? 'Onze gevorderde FUE-techniek zorgt voor natuurlijk uitziende resultaten die perfect aansluiten bij uw eigen haargroei. Elke follikel wordt zorgvuldig geplaatst voor optimale dichtheid en richting.'
        : 'Our advanced FUE technique ensures natural-looking results that perfectly match your own hair growth. Each follicle is carefully placed for optimal density and direction.',
      imagePosition: 'left' as const,
    },
    {
      id: 'process',
      title: language === 'nl' ? 'Minimaal Invasieve Procedure' : 'Minimally Invasive Procedure',
      description: language === 'nl'
        ? 'Met onze moderne aanpak ervaren patiënten minimale ongemakken en een snelle hersteltijd. De procedure wordt uitgevoerd onder lokale verdoving in een comfortabele, steriele omgeving.'
        : 'With our modern approach, patients experience minimal discomfort and fast recovery time. The procedure is performed under local anesthesia in a comfortable, sterile environment.',
      imagePosition: 'right' as const,
    },
    {
      id: 'aftercare',
      title: language === 'nl' ? 'Complete Nazorg' : 'Complete Aftercare',
      description: language === 'nl'
        ? 'Ons team staat klaar om u te begeleiden tijdens het hele herstelproces. Van de eerste controle tot de langetermijnresultaten, we zorgen ervoor dat u optimale resultaten behaalt.'
        : 'Our team is ready to guide you through the entire recovery process. From the first check-up to long-term results, we ensure you achieve optimal outcomes.',
      imagePosition: 'left' as const,
    },
  ];

  return (
    <>
      {contentData.map((content, index) => (
        <ContentSection key={content.id} id={content.id}>
          <ImageTextLayout
            title={content.title}
            description={content.description}
            imagePosition={content.imagePosition}
            className="animate-fade-in"
          />
        </ContentSection>
      ))}
    </>
  );
};